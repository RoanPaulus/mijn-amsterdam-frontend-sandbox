import { IS_AP, IS_DEVELOPMENT, IS_OT, IS_PRODUCTION } from './env';

export const FeatureToggle = {
  afisActive: !IS_PRODUCTION,
  avgActive: true,
  bbDocumentDownloadsActive: IS_OT,
  bekendmakingenDatasetActive: false,
  belastingApiActive: true,
  bezwarenActive: true,
  bodemActive: true,
  cleopatraApiActive: true,
  cmsFooterActive: true,
  dbDisabled: false,
  decosServiceActive: IS_OT,
  ehKetenmachtigingActive: !IS_PRODUCTION,
  eherkenningActive: true,
  erfpachtV2Active: !IS_PRODUCTION,
  erfpachtV2EndpointActive: !IS_PRODUCTION,
  evenementenDatasetActive: false,
  garbageInformationPage: true,
  hliThemaActive: !IS_PRODUCTION,
  horecaActive: true,
  identiteitsbewijzenActive: true,
  inkomenBBZActive: true,
  isSearchEnabled: true,
  klachtenActive: true,
  krefiaActive: true,
  kvkActive: true,
  laadpalenActive: !IS_PRODUCTION,
  meldingenBuurtActive: true,
  oidcLogoutHintActive: true,
  overtredingenActive: !IS_PRODUCTION,
  parkerenActive: true,
  passQueryParamsToStreamUrl: !IS_AP,
  powerbrowserActive: !IS_PRODUCTION,
  profileToggleActive: true,
  residentCountActive: true,
  sportDatasetsActive: true,
  stadspasRequestsActive: false,
  subsidieActive: true,
  svwiLinkActive: IS_DEVELOPMENT,
  tipsFlipActive: true,
  toeristischeVerhuurActive: true,
  vergunningenActive: true,
  vergunningenV2Active: false, // TODO: Enable when working on MIJN-8914
  wiorDatasetActive: true,
  wiorMeldingen: true,
  zorgnedDocumentAttachmentsActive: true,
};
