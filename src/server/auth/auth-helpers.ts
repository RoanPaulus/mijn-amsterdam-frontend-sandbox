import type { Request, Response } from 'express';
import * as jose from 'jose';
import { ParsedQs } from 'qs';
import { FeatureToggle } from '../../universal/config/feature-toggles';
import { ExternalConsumerEndpoints } from '../routing/bff-routes';
import { generateFullApiUrlBFF } from '../routing/route-helpers';
import { captureException } from '../services/monitoring';
import { addToBlackList } from '../services/session-blacklist';
import {
  OIDC_SESSION_COOKIE_NAME,
  OIDC_TOKEN_ID_ATTRIBUTE,
  RETURNTO_AMSAPP_STADSPAS_ADMINISTRATIENUMMER,
  RETURNTO_MAMS_LANDING,
} from './auth-config';
import { authRoutes } from './auth-routes';
import { AuthProfile, MaSession, TokenData } from './auth-types';

export function getReturnToUrl(queryParams?: ParsedQs) {
  switch (queryParams?.returnTo) {
    case RETURNTO_AMSAPP_STADSPAS_ADMINISTRATIENUMMER:
      return generateFullApiUrlBFF(
        ExternalConsumerEndpoints.public.STADSPAS_ADMINISTRATIENUMMER,
        {
          token: queryParams['amsapp-session-token'] as string,
        }
      );
    default:
    case RETURNTO_MAMS_LANDING:
      return authRoutes.AUTH_LOGIN_DIGID_LANDING;
  }
}

export function getAuthProfile(
  maSession: MaSession,
  tokenData: TokenData
): AuthProfile {
  const idAttr = OIDC_TOKEN_ID_ATTRIBUTE[maSession.authMethod](tokenData);
  return {
    id: tokenData[idAttr],
    sid: maSession.sid,
    authMethod: maSession.authMethod,
    profileType: maSession.profileType,
  };
}

function getSessionData(req: Request) {
  const reqWithSession = req as Request &
    Record<typeof OIDC_SESSION_COOKIE_NAME, MaSession>;
  return reqWithSession?.[OIDC_SESSION_COOKIE_NAME] ?? null;
}

export function getAuth(req: Request) {
  const tokenData = (req.oidc?.user as TokenData | null) ?? null;
  const oidcToken = req.oidc?.idToken ?? '';
  const maSession = getSessionData(req);

  if (
    !maSession?.authMethod ||
    !tokenData ||
    !(maSession.authMethod in OIDC_TOKEN_ID_ATTRIBUTE)
  ) {
    return null;
  }

  const profile = getAuthProfile(maSession, tokenData);

  return {
    token: oidcToken,
    profile,
  };
}

export function isSessionCookieName(cookieName: string) {
  return cookieName === OIDC_SESSION_COOKIE_NAME;
}

export function hasSessionCookie(req: Request) {
  return Object.keys(req.cookies).some((cookieName) =>
    isSessionCookieName(cookieName)
  );
}

export async function isRequestAuthenticated(
  req: Request,
  authMethod: AuthMethod
) {
  try {
    if (req.oidc.isAuthenticated()) {
      const auth = getAuth(req);
      if (auth) {
        return auth.profile.authMethod === authMethod;
      }
    }
  } catch (error) {
    console.error(error);
    captureException(error);
  }
  return false;
}

export function decodeToken<T extends Record<string, string> = {}>(
  jwtToken: string
): T {
  return jose.decodeJwt(jwtToken) as unknown as T;
}

export function createLogoutHandler(
  postLogoutRedirectUrl: string,
  doIDPLogout: boolean = true
) {
  return async (req: Request, res: Response) => {
    if (req.oidc.isAuthenticated() && doIDPLogout) {
      const auth = getAuth(req);
      if (auth) {
        // Add the session ID to a blacklist. This way the jwt id_token, which itself has longer lifetime, cannot be reused after logging out at IDP.
        if (auth.profile.sid) {
          await addToBlackList(auth.profile.sid);
        }

        return res.oidc.logout({
          returnTo: postLogoutRedirectUrl,
          logoutParams: {
            id_token_hint: !FeatureToggle.oidcLogoutHintActive
              ? auth.token
              : null,
            logout_hint: FeatureToggle.oidcLogoutHintActive
              ? (req as any)[OIDC_SESSION_COOKIE_NAME]?.TMASessionID
              : null,
          },
        });
      }
    }

    // Destroy the session context
    (req as any)[OIDC_SESSION_COOKIE_NAME] = undefined;
    res.clearCookie(OIDC_SESSION_COOKIE_NAME);

    return res.redirect(postLogoutRedirectUrl);
  };
}
