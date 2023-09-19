import { generatePath, useParams } from 'react-router-dom';
import type { Klacht } from '../../../server/services/klachten/types';
import { AppRoutes, ChapterTitles } from '../../../universal/config';
import {
  defaultDateFormat,
  isError,
  isLoading,
} from '../../../universal/helpers';
import {
  Alert,
  ChapterIcon,
  DetailPage,
  InfoDetail,
  PageContent,
  PageHeading,
} from '../../components';
import { useAppStateGetter } from '../../hooks';
import { KLACHTEN_PAGE_SIZE } from '../Klachten/Klachten';

export default function KlachtenDetail() {
  const { KLACHTEN } = useAppStateGetter();
  const { id } = useParams<{ id: string }>();

  const klachtIndex = (KLACHTEN.content?.klachten || []).findIndex(
    (klacht: Klacht) => klacht.id === id
  );

  const klacht = KLACHTEN.content?.klachten[klachtIndex];

  const noContent = !isLoading(KLACHTEN) && !klacht;

  return (
    <DetailPage>
      <PageHeading
        icon={<ChapterIcon />}
        backLink={{
          to: generatePath(AppRoutes.KLACHTEN, {
            page:
              klachtIndex > 0
                ? Math.ceil((klachtIndex + 1) / KLACHTEN_PAGE_SIZE)
                : 1,
          }),
          title: ChapterTitles.KLACHTEN,
        }}
        isLoading={isLoading(KLACHTEN)}
      >
        {klacht?.onderwerp || 'Klacht'}
      </PageHeading>

      <PageContent>
        {isError(KLACHTEN) || noContent ? (
          <Alert type="warning">
            <p>We kunnen op dit moment geen gegevens tonen.</p>
          </Alert>
        ) : (
          <>
            <InfoDetail
              label="Nummer van uw klacht"
              value={klacht?.id || '-'}
            />
            <InfoDetail
              label="Ontvangen op"
              value={
                klacht?.ontvangstDatum
                  ? defaultDateFormat(klacht?.ontvangstDatum)
                  : '-'
              }
            />
            <InfoDetail
              label="Wat is de klacht?"
              value={klacht?.omschrijving}
            />
            {klacht?.locatie && (
              <InfoDetail
                label="Wat is de locatie waar de klacht is ontstaan?"
                value={klacht?.locatie}
              />
            )}
            {klacht?.gewensteOplossing && (
              <InfoDetail
                label="Wat wilt u dat de gemeente gaat doen naar aanleiding van uw klacht?"
                value={klacht?.gewensteOplossing}
              />
            )}
          </>
        )}
      </PageContent>
    </DetailPage>
  );
}
