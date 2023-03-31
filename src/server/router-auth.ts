import * as Sentry from '@sentry/node';
import express from 'express';
import { attemptSilentLogin, auth } from 'express-openid-connect';
import { apiSuccessResult } from '../universal/helpers';
import {
  BffEndpoints,
  oidcConfigDigid,
  oidcConfigEherkenning,
  oidcConfigYivi,
  OIDC_SESSION_COOKIE_NAME,
} from './config';
import {
  decodeOIDCToken,
  getAuth,
  hasSessionCookie,
  nocache,
  sendUnauthorized,
} from './helpers/app';
import { countLoggedInVisit } from './services/visitors';

export const router = express.Router();

export const isAuthenticated =
  () =>
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (hasSessionCookie(req)) {
      try {
        const a = await getAuth(req);
        return next();
      } catch (error) {
        Sentry.captureException(error);
      }
    }
    return sendUnauthorized(res);
  };

router.use(nocache);

// Enable OIDC
router.use(BffEndpoints.AUTH_BASE_DIGID, auth(oidcConfigDigid));
router.use(BffEndpoints.AUTH_BASE_EHERKENNING, auth(oidcConfigEherkenning));
router.use(BffEndpoints.AUTH_BASE_YIVI, auth(oidcConfigYivi));

router.use(BffEndpoints.AUTH_BASE_SSO, async (req, res) => {
  const authMethod = req.query.authMethod;

  switch (authMethod) {
    case 'digid':
      return res.redirect(BffEndpoints.AUTH_BASE_SSO_DIGID);
    case 'eherkenning':
      return res.redirect(BffEndpoints.AUTH_BASE_SSO_EHERKENNING);
    default: {
      // No sessions found at Identify provider, let the front-end decide which SSO attempt is made.
      return res.redirect(`${process.env.BFF_FRONTEND_URL}?sso=1`);
    }
  }
});

router.use(
  BffEndpoints.AUTH_BASE_SSO_DIGID,
  attemptSilentLogin(),
  (req, res, next) => {
    return res.send(req.oidc.isAuthenticated());
  }
);
router.use(
  BffEndpoints.AUTH_BASE_SSO_EHERKENNING,
  attemptSilentLogin(),
  (req, res, next) => {
    return res.send(req.oidc.isAuthenticated());
  }
);

router.get(BffEndpoints.AUTH_LOGIN_DIGID, (req, res) => {
  return res.oidc.login({
    returnTo: BffEndpoints.AUTH_LOGIN_DIGID_LANDING,
    authorizationParams: {
      redirect_uri: BffEndpoints.AUTH_CALLBACK_DIGID,
    },
  });
});

router.get(BffEndpoints.AUTH_LOGIN_EHERKENNING, (req, res) => {
  return res.oidc.login({
    returnTo: process.env.BFF_FRONTEND_URL + '?authMethod=eherkenning',
    authorizationParams: {
      redirect_uri: BffEndpoints.AUTH_CALLBACK_EHERKENNING,
    },
  });
});

router.get(BffEndpoints.AUTH_LOGIN_YIVI, (req, res) => {
  return res.oidc.login({
    returnTo: process.env.BFF_FRONTEND_URL + '?authMethod=yivi',
    authorizationParams: {
      redirect_uri: BffEndpoints.AUTH_CALLBACK_YIVI,
    },
  });
});

router.get(BffEndpoints.AUTH_LOGIN_DIGID_LANDING, async (req, res) => {
  const auth = await getAuth(req);
  if (auth.profile.id) {
    countLoggedInVisit(auth.profile.id);
  }
  return res.redirect(process.env.BFF_FRONTEND_URL + '?authMethod=digid');
});

router.get(BffEndpoints.AUTH_CHECK_EHERKENNING, async (req, res) => {
  if (req.oidc.isAuthenticated()) {
    return res.send(
      apiSuccessResult({
        isAuthenticated: true,
        profileType: 'commercial',
        authMethod: 'eherkenning',
      })
    );
  }
  res.clearCookie(OIDC_SESSION_COOKIE_NAME);
  return sendUnauthorized(res);
});

router.get(BffEndpoints.AUTH_CHECK_DIGID, async (req, res) => {
  if (req.oidc.isAuthenticated()) {
    return res.send(
      apiSuccessResult({
        isAuthenticated: true,
        profileType: 'private',
        authMethod: 'digid',
      })
    );
  }
  res.clearCookie(OIDC_SESSION_COOKIE_NAME);
  return sendUnauthorized(res);
});

router.get(BffEndpoints.AUTH_CHECK_YIVI, async (req, res) => {
  if (req.oidc.isAuthenticated()) {
    return res.send(
      apiSuccessResult({
        isAuthenticated: true,
        profileType: 'private-attributes',
        authMethod: 'yivi',
      })
    );
  }
  res.clearCookie(OIDC_SESSION_COOKIE_NAME);
  return sendUnauthorized(res);
});

// AuthMethod agnostic endpoints
router.get(BffEndpoints.AUTH_CHECK, async (req, res) => {
  if (hasSessionCookie(req)) {
    try {
      const auth = await getAuth(req);
      let redirectUrl = '';
      switch (auth.profile.authMethod) {
        case 'eherkenning':
          redirectUrl = BffEndpoints.AUTH_CHECK_EHERKENNING;
          break;
        case 'digid':
          redirectUrl = BffEndpoints.AUTH_CHECK_DIGID;
          break;
        case 'yivi':
          redirectUrl = BffEndpoints.AUTH_CHECK_YIVI;
          break;
      }

      return res.redirect(redirectUrl);
    } catch (error) {
      Sentry.captureException(error);
    }
  }

  res.clearCookie(OIDC_SESSION_COOKIE_NAME);
  return sendUnauthorized(res);
});

router.get(BffEndpoints.AUTH_TOKEN_DATA, async (req, res) => {
  if (hasSessionCookie(req)) {
    try {
      const auth = await getAuth(req);
      return res.send(
        apiSuccessResult({
          tokenData: await decodeOIDCToken(auth.token),
          profile: auth.profile,
        })
      );
    } catch (error) {
      Sentry.captureException(error);
    }
  }

  return sendUnauthorized(res);
});

router.get(BffEndpoints.AUTH_LOGOUT, async (req, res) => {
  if (hasSessionCookie(req)) {
    const auth = await getAuth(req);

    let redirectUrl = '';

    switch (auth.profile.authMethod) {
      case 'eherkenning':
        redirectUrl = BffEndpoints.AUTH_LOGOUT_EHERKENNING;
        break;
      case 'digid':
        redirectUrl = BffEndpoints.AUTH_LOGOUT_DIGID;
        break;
      case 'yivi':
        redirectUrl = BffEndpoints.AUTH_LOGOUT_YIVI;
        break;
    }

    return res.redirect(redirectUrl);
  }

  return res.redirect(`${process.env.BFF_FRONTEND_URL}`);
});
