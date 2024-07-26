import classnames from 'classnames';
import { useEffect } from 'react';
import {
  BrowserRouter,
  Redirect,
  Route,
  Switch,
  matchPath,
  useHistory,
  useLocation,
} from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { FeatureToggle } from '../universal/config/feature-toggles';
import { AppRoutes } from '../universal/config/routes';

import styles from './App.module.scss';
import { AutoLogoutDialog, MainFooter, MainHeader } from './components';
import MyAreaLoader from './components/MyArea/MyAreaLoader';
import { useSessionApi } from './hooks/api/useSessionApi';
import { useAppStateRemote } from './hooks/useAppState';
import {
  useDeeplinkRedirect,
  useSetDeeplinkEntry,
} from './hooks/useDeeplink.hook';
import { useProfileTypeValue } from './hooks/useProfileType';
import { useUsabilla } from './hooks/useUsabilla';

import { loginUrlByAuthMethod } from './config/api';
import { default as LandingPage } from './pages/Landing/Landing';

import { AppRoutesRedirect, isPrivateRoute } from './config/routes';
import { useAnalytics } from './hooks/analytics.hook';
import { usePageChange } from './hooks/usePageChange';
import Burgerzaken from './pages//Burgerzaken/Burgerzaken';
import AVG from './pages/AVG/AVG';
import AVGDetail from './pages/AVGDetail/AVGDetail';
import Accessibility from './pages/Accessibility/Accessibility';
import Bezwaren from './pages/Bezwaren/Bezwaren';
import BezwarenDetail from './pages/BezwarenDetail/BezwarenDetail';
import BFF500Error from './pages/BffError/BffError';
import Bodem from './pages/Bodem/Bodem';
import LoodMeting from './pages/Bodem/LoodMeting';
import BurgerzakenIDKaart from './pages/BurgerzakenDetail/BurgerzakenIDKaart';
import Dashboard from './pages/Dashboard/Dashboard';
import ErfpachtDossierDetail from './pages/Erfpacht/DossierDetail/ErfpachtDossierDetail';
import Erfpacht from './pages/Erfpacht/Erfpacht';
import ErfpachtDossiers from './pages/Erfpacht/ErfpachtDossiers';
import ErfpachtFacturen from './pages/Erfpacht/ErfpachtFacturen';
import ErfpachtOpenFacturen from './pages/Erfpacht/ErfpachtOpenFacturen';
import GarbageInformation from './pages/GarbageInformation/GarbageInformation';
import GeneralInfo from './pages/GeneralInfo/GeneralInfo';
import HLI from './pages/HLI/HLI';
import HLIRegeling from './pages/HLI/HLIRegeling';
import HLIRegelingen from './pages/HLI/HLIRegelingen';
import HLIStadspas from './pages/HLI/HLIStadspas';
import Horeca from './pages/Horeca/Horeca';
import HorecaDetail from './pages/HorecaDetail/HorecaDetail';
import Inkomen from './pages/Inkomen/Inkomen';
import InkomenDetailBbz from './pages/InkomenDetail/InkomenDetailBbz';
import InkomenDetailTonk from './pages/InkomenDetail/InkomenDetailTonk';
import InkomenDetailTozo from './pages/InkomenDetail/InkomenDetailTozo';
import InkomenDetailUitkering from './pages/InkomenDetail/InkomenDetailUitkering';
import InkomenSpecificaties from './pages/InkomenSpecificaties/InkomenSpecificaties';
import Klachten from './pages/Klachten/Klachten';
import KlachtenDetail from './pages/KlachtenDetail/KlachtenDetail';
import Krefia from './pages/Krefia/Krefia';
import MyNotifications from './pages/MyNotifications/MyNotifications';
import NotFound from './pages/NotFound/NotFound';
import Parkeren from './pages/Parkeren/Parkeren';
import ProfileCommercial from './pages/Profile/ProfileCommercial';
import Profile from './pages/Profile/ProfilePrivate';
import Search from './pages/Search/Search';
import ToeristischeVerhuur from './pages/ToeristischeVerhuur/ToeristischeVerhuur';
import ToeristischeVerhuurDetail from './pages/ToeristischeVerhuurDetail/ToeristischeVerhuurDetail';
import VergunningDetail from './pages/VergunningDetail/VergunningDetail';
import Vergunningen from './pages/Vergunningen/Vergunningen';
import VergunningV2Detail from './pages/VergunningenV2/VergunningDetail';
import VergunningenV2 from './pages/VergunningenV2/Vergunningen';
import { VergunningenList } from './pages/VergunningenV2/VergunningenList';
import ZaakStatus from './pages/ZaakStatus/ZaakStatus';
import Zorg from './pages/Zorg/Zorg';
import ZorgDetail from './pages/ZorgDetail/ZorgDetail';
import { useMonitoring } from './utils/monitoring';

function AppNotAuthenticated() {
  useSetDeeplinkEntry(['sso', 'authMethod']);
  usePageChange(false);
  useUsabilla();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const hasSSO = params.get('sso');
  const authMethod = params.get('authMethod');
  const shouldRedirectSSO =
    hasSSO && authMethod && authMethod in loginUrlByAuthMethod;

  // NOTE: Instantly redirecting users client side may lead to suboptimal UX. See also: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#sect2 and https://en.wikipedia.org/wiki/Meta_refresh
  useEffect(() => {
    if (shouldRedirectSSO) {
      window.location.href = loginUrlByAuthMethod[authMethod];
    }
  }, [shouldRedirectSSO, authMethod]);

  if (shouldRedirectSSO) {
    return (
      <p className={styles.PreLoader}>
        Automatische toegang tot Mijn Amsterdam wordt gecontroleerd...
      </p>
    );
  }

  return (
    <>
      <MainHeader isAuthenticated={false} />
      <div className={classnames(styles.App, styles.NotYetAuthenticated)}>
        <Switch>
          {AppRoutesRedirect.map(({ from, to }) => (
            <Redirect key={from + to} from={from} to={to} />
          ))}
          <Route exact path={AppRoutes.ROOT} component={LandingPage} />
          <Route path={AppRoutes.ACCESSIBILITY} component={Accessibility} />
          <Route path={AppRoutes.BFF_500_ERROR} component={BFF500Error} />
          <Route
            render={({ location: { pathname } }) => {
              if (isPrivateRoute(pathname)) {
                // Private routes are redirected to Home
                return <Redirect to={AppRoutes.ROOT} />;
              }
              // All other routes are presented with a 404 page
              return <Route component={NotFound} />;
            }}
          />
        </Switch>
      </div>
      <MainFooter />
    </>
  );
}

function AppAuthenticated() {
  useAppStateRemote();
  usePageChange(true);

  const history = useHistory();
  const profileType = useProfileTypeValue();
  const redirectAfterLogin = useDeeplinkRedirect();

  useUsabilla(profileType);

  useEffect(() => {
    if (redirectAfterLogin && redirectAfterLogin !== '/') {
      history.push(redirectAfterLogin);
    }
  }, [redirectAfterLogin, history]);

  const isHeroVisible = !matchPath(history.location.pathname, {
    path: AppRoutes.BUURT,
  });

  return (
    <>
      <MainHeader isAuthenticated isHeroVisible={isHeroVisible} />
      <div className={styles.App} id="skip-to-id-AppContent">
        <Switch>
          {AppRoutesRedirect.map(({ from, to }) => (
            <Redirect key={from + to} from={from} to={to} />
          ))}
          <Route path={AppRoutes.ZAAK_STATUS} component={ZaakStatus} />
          <Route path={AppRoutes.BUURT} component={MyAreaLoader} />
          <Route exact path={AppRoutes.ROOT} component={Dashboard} />
          <Route path={AppRoutes.NOTIFICATIONS} component={MyNotifications} />
          <Route path={AppRoutes.BRP} component={Profile} />
          <Route path={AppRoutes.KVK} component={ProfileCommercial} />
          {FeatureToggle.hliThemaActive && (
            <Route path={AppRoutes['HLI/STADSPAS']} component={HLIStadspas} />
          )}
          {FeatureToggle.hliThemaActive && (
            <Route
              path={AppRoutes['HLI/REGELINGEN_LIJST']}
              component={HLIRegelingen}
            />
          )}
          {FeatureToggle.hliThemaActive && (
            <Route path={AppRoutes['HLI/REGELING']} component={HLIRegeling} />
          )}
          {FeatureToggle.hliThemaActive && (
            <Route path={AppRoutes['HLI']} component={HLI} />
          )}
          <Route
            path={AppRoutes['INKOMEN/BIJSTANDSUITKERING']}
            component={InkomenDetailUitkering}
          />
          <Route
            path={AppRoutes['INKOMEN/SPECIFICATIES']}
            component={InkomenSpecificaties}
          />
          <Route
            path={AppRoutes['INKOMEN/TOZO']}
            component={InkomenDetailTozo}
          />
          <Route
            path={AppRoutes['INKOMEN/TONK']}
            component={InkomenDetailTonk}
          />
          {FeatureToggle.inkomenBBZActive && (
            <Route
              path={AppRoutes['INKOMEN/BBZ']}
              component={InkomenDetailBbz}
            />
          )}
          <Route path={AppRoutes.INKOMEN} component={Inkomen} />
          <Route
            path={AppRoutes['ZORG/VOORZIENINGEN']}
            component={ZorgDetail}
          />
          <Route path={AppRoutes.ZORG} component={Zorg} />
          <Route
            path={AppRoutes['BURGERZAKEN/ID-KAART']}
            component={BurgerzakenIDKaart}
          />
          <Route path={AppRoutes.BURGERZAKEN} component={Burgerzaken} />
          {FeatureToggle.garbageInformationPage && (
            <Route path={AppRoutes.AFVAL} component={GarbageInformation} />
          )}
          <Route path={AppRoutes.ACCESSIBILITY} component={Accessibility} />
          <Route path={AppRoutes.GENERAL_INFO} component={GeneralInfo} />
          {FeatureToggle.vergunningenV2Active && (
            <Route
              path={AppRoutes['VERGUNNINGEN/LIST']}
              component={VergunningenList}
            />
          )}
          <Route
            path={AppRoutes['VERGUNNINGEN/DETAIL']}
            component={
              FeatureToggle.vergunningenV2Active
                ? VergunningV2Detail
                : VergunningDetail
            }
          />
          <Route
            path={AppRoutes.VERGUNNINGEN}
            component={
              FeatureToggle.vergunningenV2Active ? VergunningenV2 : Vergunningen
            }
          />
          <Route
            path={AppRoutes['KLACHTEN/KLACHT']}
            component={KlachtenDetail}
          />
          <Route path={AppRoutes.KLACHTEN} component={Klachten} />
          {FeatureToggle.bezwarenActive && (
            <Route
              path={AppRoutes['BEZWAREN/DETAIL']}
              component={BezwarenDetail}
            />
          )}
          {FeatureToggle.bezwarenActive && (
            <Route path={AppRoutes.BEZWAREN} component={Bezwaren} />
          )}
          {FeatureToggle.toeristischeVerhuurActive && (
            <Route
              path={[
                AppRoutes['TOERISTISCHE_VERHUUR/VERGUNNING/BB'],
                AppRoutes['TOERISTISCHE_VERHUUR/VERGUNNING/VV'],
                AppRoutes['TOERISTISCHE_VERHUUR/VERGUNNING'],
              ]}
              component={ToeristischeVerhuurDetail}
            />
          )}
          {FeatureToggle.toeristischeVerhuurActive && (
            <Route
              path={AppRoutes.TOERISTISCHE_VERHUUR}
              component={ToeristischeVerhuur}
            />
          )}
          {FeatureToggle.afisActive && <Route path={AppRoutes.AFIS} />}
          {FeatureToggle.krefiaActive && (
            <Route path={AppRoutes.KREFIA} component={Krefia} />
          )}
          {FeatureToggle.horecaActive && (
            <Route path={AppRoutes['HORECA/DETAIL']} component={HorecaDetail} />
          )}
          {FeatureToggle.horecaActive && (
            <Route path={AppRoutes.HORECA} component={Horeca} />
          )}
          {FeatureToggle.avgActive && (
            <Route path={AppRoutes['AVG/DETAIL']} component={AVGDetail} />
          )}
          {FeatureToggle.avgActive && (
            <Route path={AppRoutes.AVG} component={AVG} />
          )}
          {FeatureToggle.bodemActive && (
            <Route path={AppRoutes.BODEM} component={Bodem} />
          )}
          {FeatureToggle.bodemActive && (
            <Route
              path={AppRoutes['BODEM/LOOD_METING']}
              component={LoodMeting}
            />
          )}
          {FeatureToggle.erfpachtV2Active && (
            <Route
              path={AppRoutes['ERFPACHTv2/DOSSIERS']}
              component={ErfpachtDossiers}
            />
          )}
          {FeatureToggle.erfpachtV2Active && (
            <Route
              path={AppRoutes['ERFPACHTv2/ALLE_FACTUREN']}
              component={ErfpachtFacturen}
            />
          )}
          {FeatureToggle.erfpachtV2Active && (
            <Route
              path={AppRoutes['ERFPACHTv2/OPEN_FACTUREN']}
              component={ErfpachtOpenFacturen}
            />
          )}
          {FeatureToggle.erfpachtV2Active && (
            <Route
              path={AppRoutes['ERFPACHTv2/DOSSIERDETAIL']}
              component={ErfpachtDossierDetail}
            />
          )}
          {FeatureToggle.erfpachtV2Active && (
            <Route path={AppRoutes.ERFPACHTv2} component={Erfpacht} />
          )}
          <Route path={AppRoutes.SEARCH} component={Search} />
          <Route path={AppRoutes.PARKEREN} component={Parkeren} />
          <Route path={AppRoutes.BFF_500_ERROR} component={BFF500Error} />
          <Route component={NotFound} />
        </Switch>
      </div>
      <MainFooter isAuthenticated />
    </>
  );
}

function AppLanding() {
  const session = useSessionApi();
  const { isPristine, isAuthenticated } = session;

  // If session was previously authenticated we don't want to show the loader again
  if (isPristine) {
    return <p className={styles.PreLoader}>Welkom op Mijn Amsterdam</p>;
  }

  return isAuthenticated ? (
    <>
      <AppAuthenticated />
      <AutoLogoutDialog />
    </>
  ) : (
    <AppNotAuthenticated />
  );
}

export default function App() {
  /**
   * Visitor analytics and support
   */
  useAnalytics(!!import.meta.env.REACT_APP_ANALYTICS_ID);
  useMonitoring();

  return (
    <RecoilRoot>
      <BrowserRouter>
        <AppLanding />
      </BrowserRouter>
    </RecoilRoot>
  );
}
