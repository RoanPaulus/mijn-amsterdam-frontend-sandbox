import { Grid, Link, Paragraph } from '@amsterdam/design-system-react';
import { useParams } from 'react-router-dom';

import styles from './ToeristischeVerhuurDetail.module.scss';
import { useToeristischeVerhuurThemaData } from './useToeristischeVerhuur.hook';
import { ToeristischeVerhuurVergunning } from '../../../server/services/toeristische-verhuur/toeristische-verhuur-types';
import { Datalist, Row, RowSet } from '../../components/Datalist/Datalist';
import DocumentListV2 from '../../components/DocumentList/DocumentListV2';
import { LocationModal } from '../../components/LocationModal/LocationModal';
import ThemaDetailPagina from '../ThemaPagina/ThemaDetailPagina';

function DocumentInfo() {
  return (
    <Paragraph>
      Ziet u niet het juiste document? Stuur een mail naar:{' '}
      <Link href="mailto:bedandbreakfast@amsterdam.nl" rel="noreferrer">
        bedandbreakfast@amsterdam.nl
      </Link>{' '}
      om uw document op te vragen.
    </Paragraph>
  );
}

interface VerhuurDocumentListProps {
  vergunning: ToeristischeVerhuurVergunning;
}

function VerhuurDocumentList({ vergunning }: VerhuurDocumentListProps) {
  return (
    <>
      <DocumentListV2
        documents={vergunning.documents}
        columns={['', '']}
        className="ams-mb--sm"
      />
      <DocumentInfo />
    </>
  );
}

type DetailPageContentProps = {
  vergunning: ToeristischeVerhuurVergunning;
};

function DetailPageContent({ vergunning }: DetailPageContentProps) {
  const rows: Array<Row | RowSet> = [
    {
      label: 'Gemeentelijk zaaknummer',
      content: vergunning.zaaknummer,
    },
    {
      rows: [
        {
          label: 'Vanaf',
          content: vergunning.dateStartFormatted,
          className: styles.VanTot_Col1,
        },
        {
          label: 'Tot',
          content: vergunning.dateEndFormatted,
          className: styles.VanTot_Col2,
        },
      ],
      isVisible: vergunning.result === 'Verleend',
    },
    {
      label: 'Adres',
      content: (
        <>
          <span className={styles.Address}>{vergunning.adres}</span>
          <LocationModal address={vergunning.adres} />
        </>
      ),
    },
    {
      label: 'Resultaat',
      content: vergunning.result,
      isVisible: !!vergunning.result,
    },
  ];

  const isVakantieVerhuur = vergunning.title === 'Vergunning vakantieverhuur';

  return (
    <>
      {isVakantieVerhuur && (
        <Grid.Cell span="all">
          <Paragraph>
            Vakantieverhuur kunt u melden en annuleren via{' '}
            <Link
              rel="noreferrer"
              href="https://www.toeristischeverhuur.nl/portaal/login"
              variant="inline"
            >
              toeristischeverhuur.nl
            </Link>
            .
          </Paragraph>
        </Grid.Cell>
      )}
      {!!rows.length && (
        <Grid.Cell span="all">
          <Datalist rows={rows} />
        </Grid.Cell>
      )}

      <Grid.Cell span={8}>
        <Datalist
          rows={[
            {
              label: 'Document',
              content: <VerhuurDocumentList vergunning={vergunning} />,
            },
          ]}
        />
      </Grid.Cell>
    </>
  );
}

export function ToeristischeVerhuurDetail() {
  const { vergunningen, isError, isLoading, title, routes } =
    useToeristischeVerhuurThemaData();
  const { id } = useParams<{ id: string }>();
  const vergunning = vergunningen?.find((item) => item.id === id) ?? null;

  return (
    <ThemaDetailPagina<ToeristischeVerhuurVergunning>
      title={vergunning?.title ?? 'Vergunning toeristische verhuur'}
      zaak={vergunning}
      isError={isError}
      isLoading={isLoading}
      pageContentTop={
        vergunning && <DetailPageContent vergunning={vergunning} />
      }
      backLink={{
        title: title,
        to: routes.themaPage,
      }}
      documentPathForTracking={(document) =>
        `/downloads/toeristische-verhuur/vergunning/${vergunning?.title}/${document.title.split(/\n/)[0]}`
      }
    />
  );
}
