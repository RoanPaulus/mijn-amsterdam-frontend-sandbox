import { Grid, Heading, Link, Paragraph } from '@amsterdam/design-system-react';
import { generatePath, useParams } from 'react-router-dom';
import { AppRoutes } from '../../../../universal/config';
import { Datalist } from '../../../components/Datalist/Datalist';
import { LinkToListPage } from '../../../components/LinkToListPage/LinkToListPage';
import { MaParagraph } from '../../../components/Paragraph/Paragraph';
import { TableV2 } from '../../../components/Table/TableV2';
import { MAX_TABLE_ROWS_ON_THEMA_PAGINA } from '../../../config/app';
import { useErfpachtV2Data } from '../erfpachtData.hook';
import { ErfpachtDatalistProps } from './DatalistGeneral';
import styles from './ErfpachtDossierDetail.module.scss';
import classNames from 'classnames';

export function DataTableFacturen({
  dossier,
  relatieCode,
}: ErfpachtDatalistProps) {
  const { displayPropsAlleFacturen, colStyles } = useErfpachtV2Data();
  const { dossierNummerUrlParam } = useParams<{
    dossierNummerUrlParam: string;
  }>();
  const mailBody = `Dossiernummer: ${
    dossier.dossierNummer
  }%0D%0ARelatiecode: ${dossier.relaties?.find((relatie) => relatie.betaler)
    ?.relatieCode}%0D%0ADebiteurnummer: ${dossier.facturen?.debiteurNummer}`;
  const betaler = dossier.relaties?.find((relatie) => relatie.betaler);
  const isBetaler = betaler?.relatieCode === relatieCode;
  const facturenBetalerDebiteurRows = [
    {
      rows: [
        {
          label: dossier.facturen.titelBetaler,
          content: dossier.facturen.betaler || '-',
          className: styles.FacturenBetalerDebiteur_Col1,
        },
        {
          label: dossier.facturen.titelDebiteurNummer,
          content: dossier.facturen.debiteurNummer || '-',
          className: styles.FacturenBetalerDebiteur_Col2,
        },
        {
          label: null,
          content: isBetaler ? (
            <Link
              href={`mailto:debiteurenadministratie@amsterdam.nl?subject=Betaler wijzigen&body=${mailBody}`}
              rel="noopener noreferrer"
              variant="inList"
            >
              Betaler aanpassen
            </Link>
          ) : (
            ''
          ),
          className: styles.FacturenBetalerDebiteur_Col3,
        },
      ],
    },
  ];
  return (
    <Grid className={styles.FacturenBetaler}>
      <Grid.Cell span="all">
        <Heading level={4} size="level-4">
          Factuur naar nieuw adres
        </Heading>
        <MaParagraph>
          Wilt u uw facturen voor erfpacht en canon op een nieuw adres
          ontvangen? Stuur een e-mail naar{' '}
          <Link
            rel="noopener noreferrer"
            href={`mailto:erfpachtadministratie@amsterdam.nl?subject=Adreswijziging facturen erfpacht en canon&body=${mailBody}`}
          >
            erfpachtadministratie@amsterdam.nl
          </Link>
          . Zet in het onderwerp 'Adreswijziging'. Vermeld in de mail uw
          debiteurennummer of het E-dossiernummer en uw nieuwe adresgegevens. U
          krijgt binnen 3 werkdagen een reactie.
        </MaParagraph>
        <Heading level={4} size="level-4">
          Factuur via e-mail
        </Heading>
        <MaParagraph>
          U kunt uw facturen ook per e-mail krijgen. Mail hiervoor uw
          e-mailadres en debiteurennummer naar{' '}
          <Link
            rel="noopener noreferrer"
            href={`mailto:debiteurenadministratie@amsterdam.nl?subject=Facturen per e-mail ontvangen&body=${mailBody}`}
          >
            debiteurenadministratie@amsterdam.nl
          </Link>
          .
        </MaParagraph>
      </Grid.Cell>
      <Grid.Cell span="all">
        <Datalist
          className={styles.FacturenBetalerDebiteur}
          rows={facturenBetalerDebiteurRows}
        />
        {!!dossier.facturen?.facturen?.length && (
          <TableV2
            gridColStyles={colStyles.facturenTable}
            items={dossier.facturen.facturen.slice(0, 3)}
            className={classNames(
              styles.FacturenTable,
              styles.DossierDetailFacturenTable
            )}
            displayProps={displayPropsAlleFacturen}
          />
        )}
        {!!dossier.facturen?.facturen?.length &&
          dossier.facturen.facturen.length > MAX_TABLE_ROWS_ON_THEMA_PAGINA && (
            <MaParagraph textAlign="right">
              <LinkToListPage
                count={dossier.facturen.facturen.length}
                route={generatePath(AppRoutes['ERFPACHTv2/ALLE_FACTUREN'], {
                  dossierNummerUrlParam,
                })}
              />
            </MaParagraph>
          )}
        {!dossier.facturen?.facturen?.length && (
          <Paragraph>U heeft geen facturen.</Paragraph>
        )}
      </Grid.Cell>
    </Grid>
  );
}
