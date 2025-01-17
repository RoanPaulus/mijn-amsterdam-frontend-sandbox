import { useEffect, useState } from 'react';

import {
  ActionGroup,
  Alert,
  Button,
  Grid,
  Heading,
  Paragraph,
  Screen,
} from '@amsterdam/design-system-react';
import { useParams } from 'react-router-dom';

import { getThemaTitleWithAppState } from './helpers';
import styles from './HLIStadspas.module.scss';
import { useBlockStadspas, useStadspassen } from './useStadspassen.hook';
import {
  StadspasBudget,
  StadspasBudgetTransaction,
  StadspasFrontend,
} from '../../../server/services/hli/stadspas-types';
import { AppRoutes } from '../../../universal/config/routes';
import {
  ApiResponse_DEPRECATED,
  apiPristineResult,
  isError,
  isLoading,
} from '../../../universal/helpers/api';
import {
  DetailPage,
  ErrorAlert,
  LoadingContent,
  Modal,
  PageHeading,
  ThemaIcon,
} from '../../components';
import { Datalist } from '../../components/Datalist/Datalist';
import { BarConfig } from '../../components/LoadingContent/LoadingContent';
import { MaRouterLink } from '../../components/MaLink/MaLink';
import { Spinner } from '../../components/Spinner/Spinner';
import { TableV2 } from '../../components/Table/TableV2';
import { useDataApi } from '../../hooks/api/useDataApi';
import { usePhoneScreen } from '../../hooks/media.hook';
import { useAppStateGetter } from '../../hooks/useAppState';

const loadingContentBarConfigDetails: BarConfig = [
  ['10rem', '2rem', '.5rem'],
  ['16rem', '2rem', '3rem'],
  ['10rem', '2rem', '.5rem'],
  ['25rem', '2rem', '3rem'],
  ['8rem', '2rem', '.5rem'],
  ['5rem', '2rem', '3rem'],
];
const loadingContentBarConfigList: BarConfig = [
  ['60rem', '2rem', '.5rem'],
  ['60rem', '2rem', '4rem'],
];

const displayPropsTransacties = {
  title: 'Omschrijving',
  datePublishedFormatted: 'Datum',
  amountFormatted: 'Bedrag',
};

const displayPropsTransactiesWithBudget = {
  title: displayPropsTransacties.title,
  budget: 'Budget',
  datePublishedFormatted: displayPropsTransacties.datePublishedFormatted,
  amountFormatted: displayPropsTransacties.amountFormatted,
};

const displayPropsBudgets = {
  title: 'Omschrijving',
  dateEndFormatted: 'Tegoed geldig t/m',
  budgetAssignedFormatted: 'Bedrag',
};

const PHONENUMBERS = {
  CCA: '14020',
  WerkEnInkomen: '020 252 6000',
} as const;

export default function HLIStadspas() {
  const isPhoneScreen = usePhoneScreen();
  const appState = useAppStateGetter();

  const { HLI } = appState;
  const { passNumber } = useParams<{ passNumber: string }>();
  const stadspassen = useStadspassen();

  const stadspas = passNumber
    ? stadspassen.find((pass) => pass.passNumber.toString() === passNumber)
    : null;

  const isErrorStadspas = isError(HLI);
  const isLoadingStadspas = isLoading(HLI);
  const noContent = !stadspas;

  const NAME = {
    label: 'Naam',
    content: stadspas?.owner.firstname,
  };

  const NUMBER = {
    label: 'Stadspasnummer',
    content: stadspas?.passNumberComplete,
  };

  const BALANCE = {
    label: 'Saldo',
    content: `${stadspas?.balanceFormatted} (Dit is het bedrag dat u nog kunt uitgeven)`,
  };

  const requestOptions = {
    method: 'get',
    url: stadspas?.urlTransactions,
    postpone: true,
  };

  const [transactionsApi, fetchTransactions] = useDataApi<
    ApiResponse_DEPRECATED<StadspasBudgetTransaction[]>
  >(requestOptions, apiPristineResult([]));

  const isLoadingTransacties = transactionsApi.isLoading;

  useEffect(() => {
    if (stadspas?.urlTransactions) {
      fetchTransactions({ ...requestOptions, postpone: false });
    }
  }, [fetchTransactions, stadspas?.urlTransactions]);

  const transactions =
    stadspas?.budgets && transactionsApi.data.content
      ? transactionsApi.data.content
      : [];

  const hasTransactions = !!transactionsApi.data.content?.length;

  const showMultiBudgetTransactions =
    !!stadspas?.budgets.length && stadspas.budgets.length > 1 && !isPhoneScreen;

  return (
    <DetailPage>
      <PageHeading
        backLink={{
          to: AppRoutes.HLI,
          title: getThemaTitleWithAppState(appState),
        }}
        icon={<ThemaIcon />}
      >
        Overzicht stadspas{' '}
        {stadspas?.owner && ` van ${stadspas?.owner.firstname}`}
      </PageHeading>
      <Screen>
        <Grid>
          {stadspas ? (
            <Grid.Cell span="all">
              <Datalist rows={[NAME]} />
              <Paragraph className={styles.StadspasNummerInfo}>
                Hieronder staat het Stadspasnummer van uw actieve pas.
                <br /> Dit pasnummer staat ook op de achterkant van uw pas.
              </Paragraph>
              <Datalist rows={[NUMBER]} />
              {!!stadspas.budgets.length && <Datalist rows={[BALANCE]} />}
              <BlockStadspas stadspas={stadspas} />
            </Grid.Cell>
          ) : (
            <Grid.Cell span="all">
              {isLoadingStadspas && (
                <LoadingContent barConfig={loadingContentBarConfigDetails} />
              )}
              {(isErrorStadspas || (!isLoadingStadspas && noContent)) && (
                <ErrorAlert>
                  We kunnen op dit moment geen gegevens tonen.{' '}
                  <MaRouterLink href={AppRoutes.HLI}>
                    Naar het overzicht
                  </MaRouterLink>
                </ErrorAlert>
              )}
            </Grid.Cell>
          )}
          <>
            <Grid.Cell span="all">
              <Heading>Gekregen tegoed</Heading>
            </Grid.Cell>
            <Grid.Cell span="all">
              {isLoadingStadspas && (
                <LoadingContent barConfig={loadingContentBarConfigList} />
              )}
              {!isLoadingStadspas && !!stadspas?.budgets.length && (
                <TableV2<StadspasBudget>
                  className={styles.Table_budgets}
                  items={stadspas.budgets}
                  displayProps={displayPropsBudgets}
                />
              )}
              {!isLoadingStadspas && !stadspas?.budgets.length && (
                <Paragraph>U heeft (nog) geen tegoed gekregen.</Paragraph>
              )}
            </Grid.Cell>
            <Grid.Cell span="all">
              <Heading>Uw uitgaven</Heading>
            </Grid.Cell>
            <Grid.Cell span="all">
              {(isLoadingTransacties || isLoadingStadspas) && (
                <LoadingContent barConfig={loadingContentBarConfigList} />
              )}
              {!isLoadingStadspas && !isLoadingTransacties && (
                <Paragraph>
                  {hasTransactions ? (
                    <>
                      Hieronder ziet u bij welke winkels u het tegoed hebt
                      uitgegeven. Deze informatie kan een dag achterlopen. Maar
                      het bedrag dat u nog over heeft klopt altijd.
                    </>
                  ) : (
                    <>
                      U heeft nog geen uitgaven. Deze informatie kan een dag
                      achterlopen. Maar het bedrag dat u nog over heeft klopt
                      altijd.
                    </>
                  )}
                </Paragraph>
              )}
            </Grid.Cell>
            {!isLoadingTransacties && hasTransactions && (
              <>
                <Grid.Cell span="all">
                  <TableV2<StadspasBudgetTransaction>
                    className={
                      showMultiBudgetTransactions
                        ? styles.Table_transactions__withBudget
                        : styles.Table_transactions
                    }
                    items={transactions}
                    displayProps={
                      showMultiBudgetTransactions
                        ? displayPropsTransactiesWithBudget
                        : displayPropsTransacties
                    }
                  />
                </Grid.Cell>
              </>
            )}
          </>
        </Grid>
      </Screen>
    </DetailPage>
  );
}

function BlockStadspas({ stadspas }: { stadspas: StadspasFrontend }) {
  if (!stadspas.actief) {
    return <PassBlockedAlert />;
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showError, setShowError] = useState(false);

  const { error, isMutating, trigger: blokkeerStadspas } = useBlockStadspas();

  useEffect(() => {
    if (error && !isMutating && !showError) {
      setShowError(true);
    }
  }, [error, showError, isMutating]);

  return (
    <>
      {showError && (
        <Alert
          className="ams-mb--sm"
          heading="Fout bij het blokeren van de pas"
          severity="error"
        >
          Probeer het later nog eens. Als dit niet lukt bel dan naar{' '}
          {PHONENUMBERS.WerkEnInkomen}
        </Alert>
      )}
      {isMutating ? (
        <Alert severity="warning">
          <Paragraph>
            <Spinner /> <span>Bezig met het blokkeren van de pas...</span>
          </Paragraph>
        </Alert>
      ) : (
        <Button
          variant="secondary"
          onClick={() => {
            setIsModalOpen(true);
          }}
          data-testid="block-stadspas-button"
        >
          Blokeer deze Stadspas
        </Button>
      )}

      <Modal
        title="Weet u zeker dat u uw stadspas wilt blokkeren ?"
        className={styles.BlokkeerDialog}
        isOpen={isModalOpen}
        showCloseButton={false}
        actions={
          <ActionGroup>
            <Button
              type="submit"
              variant="primary"
              onClick={() => {
                setShowError(false);
                setIsModalOpen(false);
                if (stadspas.blockPassURL) {
                  blokkeerStadspas(stadspas.blockPassURL);
                }
              }}
            >
              Ja, blokkeer mijn pas
            </Button>
            <Button
              variant="tertiary"
              onClick={() => {
                setIsModalOpen(false);
              }}
            >
              Nee, blokkeer mijn pas niet
            </Button>
          </ActionGroup>
        }
      >
        <Paragraph className="ams-mb--sm">
          Is uw Stadspas gestolen of bent u deze kwijt? Blokkeer dan hier uw
          Stadspas. Zo zorgt u ervoor dat niemand de Stadspas en eventueel
          tegoed van uw kind uitgeeft.
        </Paragraph>
        <Paragraph className="ams-mb--sm">
          Wilt u een nieuwe pas aanvragen of wilt u liever telefonisch
          blokkeren? Bel dan meteen naar {PHONENUMBERS.WerkEnInkomen}. De nieuwe
          pas wordt dan binnen drie weken thuisgestuurd en is dan gelijk te
          gebruiken.
        </Paragraph>
      </Modal>
    </>
  );
}

function PassBlockedAlert() {
  return (
    <Alert
      heading="Deze pas is geblokkeerd, hoe vraag ik een nieuwe aan?"
      severity="warning"
      data-testid="stadspas-blocked-alert"
    >
      <Paragraph>
        Wilt u uw pas deblokkeren of wilt u een nieuwe pas aanvragen? Bel dan
        naar {PHONENUMBERS.WerkEnInkomen} of {PHONENUMBERS.CCA}.
      </Paragraph>
      <Paragraph>
        Het aanvragen van een nieuwe pas is gratis. De pas wordt binnen drie
        weken thuisgestuurd en is dan gelijk te gebruiken.
      </Paragraph>
      <Paragraph>
        Stond er nog tegoed op de Stadspas? Dan staat het tegoed dat over was
        ook op weer op de nieuwe pas.
      </Paragraph>
    </Alert>
  );
}
