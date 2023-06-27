import { generatePath, useParams } from 'react-router-dom';
import { AppRoutes, ChapterTitles } from '../../../universal/config';
import { isError, isLoading } from '../../../universal/helpers';
import {
  Alert,
  ChapterIcon,
  DetailPage,
  InfoDetail,
  PageContent,
  PageHeading,
} from '../../components';
import { useAppStateGetter } from '../../hooks';
import AVGStatusLines from './AVGStatusLines';

const AVGDetail = () => {
  const { AVG } = useAppStateGetter();
  const { id } = useParams<{ id: string }>();

  const verzoek = AVG.content?.verzoeken?.find((verzoek) => verzoek.id === id);

  const noContent = !isLoading(AVG) && !verzoek;

  return (
    <DetailPage>
      <PageHeading
        icon={<ChapterIcon />}
        backLink={{
          to: generatePath(AppRoutes.AVG, {
            page: 1,
          }),
          title: ChapterTitles.AVG,
        }}
        isLoading={isLoading(AVG)}
      >
        AVG verzoek
      </PageHeading>

      <PageContent>
        {isError(AVG) || noContent ? (
          <Alert type="warning">
            <p>We kunnen op dit moment geen gegevens tonen.</p>
          </Alert>
        ) : (
          <>
            <InfoDetail label="Nummer" value={verzoek?.id || '-'} />
            <InfoDetail label="Type verzoek" value={verzoek?.type || '-'} />
            <InfoDetail
              label="Onderwerp(en)"
              value={verzoek?.onderwerp || '-'}
            />
            <InfoDetail
              label="Toelichting"
              value={verzoek?.toelichting || '-'}
            />
            {verzoek?.resultaat && (
              <InfoDetail label="Resultaat" value={verzoek.resultaat} />
            )}
          </>
        )}
      </PageContent>
      {verzoek && <AVGStatusLines request={verzoek} />}
    </DetailPage>
  );
};

export default AVGDetail;
