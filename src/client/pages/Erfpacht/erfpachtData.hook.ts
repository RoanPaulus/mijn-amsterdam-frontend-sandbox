import { addLinkElementToProperty } from '../../components/Table/Table';
import { useMediumScreen } from '../../hooks/media.hook';
import { useAppStateGetter } from '../../hooks/useAppState';
import styles from './Erfpacht.module.scss';

type DisplayPropsDossiers = Record<string, string> & {
  voorkeursadres: string;
  dossierNummer: string;
  zaaknummer?: string;
  wijzigingsAanvragen?: string;
};

type DisplayPropsFacturen = Record<string, string> & {
  dossierAdres?: string;
  factuurNummer: string;
  formattedFactuurBedrag: string;
  status?: string;
  vervalDatum: string;
};

export function useErfpachtV2Data() {
  const { ERFPACHTv2 } = useAppStateGetter();
  const isMediumScreen = useMediumScreen();
  const dossiersBase = ERFPACHTv2.content?.dossiers;
  const dossiers = addLinkElementToProperty(
    dossiersBase?.dossiers ?? [],
    'voorkeursadres'
  );
  const openFacturenBase = ERFPACHTv2.content?.openstaandeFacturen;
  const openFacturen = openFacturenBase?.facturen ?? [];

  let displayPropsDossiers: DisplayPropsDossiers | null = null;
  let titleDossiers = ERFPACHTv2.content?.titelDossiersKop;
  let displayPropsOpenFacturen: Partial<DisplayPropsFacturen> | null = null;
  let displayPropsAlleFacturen: DisplayPropsFacturen | null = null;
  let titleOpenFacturen = ERFPACHTv2.content?.titelOpenFacturenKop;

  if (!!dossiersBase) {
    displayPropsDossiers = {
      voorkeursadres: dossiersBase.titelVoorkeursAdres,
      dossierNummer: dossiersBase.titelDossiernummer,
    };

    if (!!dossiers?.length && 'zaaknummer' in dossiers[0]) {
      displayPropsDossiers.zaaknummer = dossiersBase.titelZaakNummer;
    }
    if (!!dossiers?.length && 'wijzigingsAanvragen' in dossiers[0]) {
      displayPropsDossiers.wijzigingsAanvragen =
        dossiersBase.titelWijzigingsAanvragen;
    }
  }

  if (!!openFacturenBase) {
    if (isMediumScreen) {
      displayPropsOpenFacturen = {
        dossierAdres: openFacturenBase.titelFacturenDossierAdres,
      };
    }
    displayPropsOpenFacturen = {
      ...displayPropsOpenFacturen,
      factuurNummer: openFacturenBase.titelFacturenNummer,
      formattedFactuurBedrag: openFacturenBase.titelFacturenFactuurBedrag,
      vervalDatum: openFacturenBase.titelFacturenVervaldatum,
    };
  }

  if (!!openFacturenBase) {
    displayPropsAlleFacturen = {
      factuurNummer: openFacturenBase.titelFacturenNummer,
      formattedFactuurBedrag: openFacturenBase.titelFacturenFactuurBedrag,
      status: openFacturenBase.titelFacturenStatus,
      vervalDatum: openFacturenBase.titelFacturenVervaldatum,
    };
  }

  return {
    isMediumScreen,
    ERFPACHTv2,
    openFacturen,
    dossiers,
    displayPropsDossiers,
    displayPropsOpenFacturen,
    displayPropsAlleFacturen,
    titleDossiers,
    titleOpenFacturen,
    colStyles: isMediumScreen
      ? {
          openFacturenTable: [
            styles.OpenFacturenTable_col1,
            styles.OpenFacturenTable_col2,
            styles.OpenFacturenTable_col3,
            styles.OpenFacturenTable_col4,
          ],
          facturenTable: [
            styles.FacturenTable_col1,
            styles.FacturenTable_col2,
            styles.FacturenTable_col3,
            styles.FacturenTable_col4,
          ],
          dossiersTable: [
            styles.DossiersTable_col1,
            styles.DossiersTable_col2,
            styles.DossiersTable_col3,
            styles.DossiersTable_col4,
          ],
        }
      : {},
  };
}
