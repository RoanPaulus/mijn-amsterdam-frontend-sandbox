import React from 'react';

import {
  Alert,
  Button,
  Grid,
  Link,
  Paragraph,
  UnorderedList,
} from '@amsterdam/design-system-react';
import { useHistory } from 'react-router-dom';

import { AfisFactuurFrontend } from './Afis-thema-config';
import styles from './Afis.module.scss';
import { useAfisThemaData } from './useAfisThemaData.hook';
import { entries } from '../../../universal/helpers/utils';
import { ThemaTitles } from '../../config/thema';
import ThemaPagina from '../ThemaPagina/ThemaPagina';
import ThemaPaginaTable from '../ThemaPagina/ThemaPaginaTable';

const pageContentTop = (
  <Paragraph>
    Hieronder ziet u een overzicht van uw facturen. U ziet hier niet de facturen
    inzake Gemeentebelastingen. Deze vindt u terug bij{' '}
    <Link rel="noreferrer" href={import.meta.env.REACT_APP_SSO_URL_BELASTINGEN}>
      Mijn Belastingen
    </Link>
    .
  </Paragraph>
);

export function AfisDisclaimer() {
  return (
    <Alert severity="warning">
      <UnorderedList>
        <UnorderedList.Item>
          Het verwerken van uw betaling kan tot 4 werkdagen duren.
        </UnorderedList.Item>
        <UnorderedList.Item>
          Enkel het openstaande bedrag wordt getoond.
        </UnorderedList.Item>
        <UnorderedList.Item>
          Gebruik de betaallink alleen voor het voldoen van het volledige
          factuurbedrag. Indien er sprake is van een betalingsregeling of
          deelbetaling verzoeken we u het resterend bedrag handmatig over te
          maken onder vermelding van de gegevens op uw factuur.
        </UnorderedList.Item>
      </UnorderedList>
    </Alert>
  );
}

export function AfisDisclaimerOvergedragenFacturen() {
  return (
    <Alert>
      <Paragraph>
        Bij het uitblijven van een betaling, wordt uw factuur door Financiën
        overgedragen naar de afdeling Incasso & Invordering van directie
        Belastingen. Deze afdeling is vanaf dat moment verantwoordelijk voor de
        invordering van uw factuur en daarmee uw aanspreekpunt. De status van uw
        factuur wordt hier niet bijgewerkt. Heeft u vragen? Afdeling Incasso &
        Invordering is van maandag tot en met vrijdag tussen 08.00 en 18.00 uur
        bereikbaar op{' '}
        <Link rel="noreferrer" href="tel:0202554800">
          020 255 4800
        </Link>
        . U kunt ook een e-mail sturen naar{' '}
        <Link rel="noreferrer" href="mailto:belastingen@amsterdam.nl">
          belastingen@amsterdam.nl
        </Link>
        . Noem in het onderwerp uw vorderingsnummer en team Incasso.
      </Paragraph>
    </Alert>
  );
}

export function AfisThemaPagina() {
  const history = useHistory();
  const {
    dependencyErrors,
    facturenByState,
    facturenTableConfig,
    isThemaPaginaError,
    isThemaPaginaLoading,
    isOverviewApiError,
    isOverviewApiLoading,
    listPageTitle,
    routes,
  } = useAfisThemaData();

  const isPartialError = entries(dependencyErrors).some(
    ([, hasError]) => hasError
  );

  const pageContentSecondary = (
    <Grid.Cell span="all">
      <Button
        className="ams-mb--sm"
        variant="secondary"
        onClick={() => history.push(routes.betaalVoorkeuren)}
      >
        Betaalvoorkeuren
      </Button>
      <AfisDisclaimer />
    </Grid.Cell>
  );

  const pageContentErrorAlert = (
    <>
      We kunnen niet alle gegevens tonen.{' '}
      {entries(dependencyErrors)
        .filter(([, hasError]) => hasError)
        .map(([state]) => (
          <React.Fragment key={state}>
            <br />- {listPageTitle[state]} kunnen nu niet getoond worden.
          </React.Fragment>
        ))}
    </>
  );

  const pageContentTables = entries(facturenTableConfig).map(
    ([
      state,
      {
        title,
        subTitle,
        displayProps,
        maxItems,
        listPageLinkLabel,
        listPageRoute,
      },
    ]) => {
      const subTitleNode =
        state === 'overgedragen' && !!facturenByState?.[state]?.facturen.length
          ? state === 'overgedragen' && <AfisDisclaimerOvergedragenFacturen />
          : subTitle;
      return (
        <ThemaPaginaTable<AfisFactuurFrontend>
          key={state}
          title={title}
          subTitle={subTitleNode}
          zaken={facturenByState?.[state]?.facturen ?? []}
          displayProps={displayProps}
          textNoContent={`U heeft geen ${title.toLowerCase()}`}
          maxItems={maxItems}
          totalItems={facturenByState?.[state]?.count}
          listPageLinkLabel={listPageLinkLabel}
          listPageRoute={listPageRoute}
          className={styles.FacturenTable}
        />
      );
    }
  );

  return (
    <ThemaPagina
      title={ThemaTitles.AFIS}
      isError={isOverviewApiError && isThemaPaginaError}
      isPartialError={isPartialError}
      errorAlertContent={pageContentErrorAlert}
      isLoading={isThemaPaginaLoading || isOverviewApiLoading}
      linkListItems={[
        {
          to: 'https://www.amsterdam.nl/ondernemen/afis/facturen/',
          title: 'Meer over facturen van de gemeente',
        },
        {
          to: import.meta.env.REACT_APP_SSO_URL_BELASTINGEN,
          title: 'Belastingen op Mijn Amsterdam',
        },
      ]}
      pageContentTop={pageContentTop}
      pageContentMain={
        <>
          {pageContentSecondary}
          {pageContentTables}
        </>
      }
    />
  );
}
