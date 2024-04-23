import { Heading, Link } from '@amsterdam/design-system-react';
import {
  ErfpachtDossierDetailHuidigePeriode,
  ErfpachtDossierDetailToekomstigePeriode,
} from '../../../../server/services/simple-connect/erfpacht';
import { Datalist, Row } from '../../../components/Datalist/Datalist';
import { DatalistCanons } from './DatalistCanons';
import { ErfpachtDatalistProps } from './DatalistGeneral';
import styles from './ErfpachtDossierDetail.module.scss';
import { defaultDateFormat } from '../../../../universal/helpers';

interface DatalistFinancieelPeriodeProps<T> {
  periode: T;
  titelAlgemeneBepaling: string;
  titelPeriodeVan: string;
  titelCanon: string;
  isHuidigePeriode: boolean;
}

function DatalistFinancieelPeriode({
  periode,
  titelAlgemeneBepaling,
  titelPeriodeVan,
  titelCanon,
  isHuidigePeriode,
}: DatalistFinancieelPeriodeProps<
  ErfpachtDossierDetailHuidigePeriode | ErfpachtDossierDetailToekomstigePeriode
>) {
  const rows: Row[] = [
    {
      label: titelAlgemeneBepaling,
      content: (
        <>
          <Link
            rel="noopener noreferrer"
            href="https://www.amsterdam.nl/wonen-leefomgeving/erfpacht/algemene-bepalingen/"
          >
            {periode.algemeneBepaling}
          </Link>{' '}
          - {periode.regime}
        </>
      ),
    },
  ];

  if (isHuidigePeriode) {
    rows.push({
      label: periode.titelAfgekocht,
      content: periode.afgekocht,
    });
  } else if ('titelBetalenVanaf' in periode && periode.betalenVanaf) {
    rows.push({
      label: periode.titelBetalenVanaf,
      content: defaultDateFormat(periode.betalenVanaf),
    });
  }

  rows.push({
    label: titelCanon,
    content: <DatalistCanons canons={periode.canons} />,
  });

  return (
    <div className={styles.DataListFinancieelPeriode}>
      <Heading level={3} size="level-4" className={styles.Section_heading}>
        {titelPeriodeVan}:{' '}
        <span className={styles.periodeSamengesteld}>
          {periode.periodeSamengesteld}
        </span>
      </Heading>
      <Datalist rows={rows} />
    </div>
  );
}

function DatalistHuidigePeriode({ dossier }: ErfpachtDatalistProps) {
  if (dossier.financieel?.huidigePeriode) {
    return (
      <DatalistFinancieelPeriode
        titelAlgemeneBepaling={
          dossier.financieel.huidigePeriode.titelFinancieelAlgemeneBepaling
        }
        titelPeriodeVan={
          dossier.financieel.huidigePeriode.titelFinancieelPeriodeVan
        }
        titelCanon={dossier.financieel.huidigePeriode.titelFinancieelCanon}
        periode={dossier.financieel.huidigePeriode}
        isHuidigePeriode
      />
    );
  }
  return null;
}

function DatalistToekomstigePeriodes({ dossier }: ErfpachtDatalistProps) {
  return dossier.financieel?.toekomstigePeriodeList?.map((periode) => (
    <DatalistFinancieelPeriode
      titelAlgemeneBepaling={periode.titelFinancieelToekomstigeAlgemeneBepaling}
      titelPeriodeVan={periode.titelFinancieelToekomstigePeriodeVan}
      titelCanon={periode.titelFinancieelToekomstigeCanon}
      periode={periode}
      isHuidigePeriode={false}
    />
  ));
}

export function DatalistsFinancieel({ dossier }: ErfpachtDatalistProps) {
  return (
    <>
      <DatalistHuidigePeriode dossier={dossier} />
      <DatalistToekomstigePeriodes dossier={dossier} />
    </>
  );
}
