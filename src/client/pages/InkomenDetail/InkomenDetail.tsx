import { useParams } from 'react-router-dom';
import { AppRoutes, ChapterTitles } from '../../../universal/config';
import { isError, isLoading } from '../../../universal/helpers';
import {
  Alert,
  ChapterIcon,
  DetailPage,
  LinkdInline,
  LoadingContent,
  PageContent,
  PageHeading,
  StatusLine,
} from '../../components';
import { useAppStateGetter } from '../../hooks/useAppState';
import AlertDocumentDownloadsDisabled from '../Inkomen/AlertDocumentDownloadsDisabled';
import styles from './InkomenDetail.module.scss';

export const MAX_STEP_COUNT_FOCUS_REUEST = 4;

export default function InkomenDetail() {
  const { FOCUS_AANVRAGEN } = useAppStateGetter();

  const { id } = useParams<{ id: string }>();
  const focusItem = FOCUS_AANVRAGEN.content?.find((item) => item.id === id);
  const noContent = !isLoading(FOCUS_AANVRAGEN) && !focusItem;
  const hasDecision =
    focusItem && focusItem.steps.some((step) => step.status === 'Besluit');
  let title = 'Onbekend item';

  if (focusItem) {
    title = focusItem.title;
  }

  return (
    <DetailPage>
      <PageHeading
        icon={<ChapterIcon />}
        backLink={{ to: AppRoutes.INKOMEN, title: ChapterTitles.INKOMEN }}
        isLoading={isLoading(FOCUS_AANVRAGEN)}
      >
        {title}
      </PageHeading>
      <PageContent className={styles.DetailPageContent}>
        {(isError(FOCUS_AANVRAGEN) || noContent) && (
          <Alert type="warning">
            <p>
              We kunnen op dit moment geen gegevens tonen.{' '}
              <LinkdInline href={AppRoutes.INKOMEN}>
                Naar het overzicht
              </LinkdInline>
            </p>
          </Alert>
        )}
        <AlertDocumentDownloadsDisabled />
        {isLoading(FOCUS_AANVRAGEN) && <LoadingContent />}
      </PageContent>
      {!!focusItem && !!focusItem.steps && (
        <StatusLine
          trackCategory={`Inkomen / ${focusItem.title}`}
          items={focusItem.steps}
          showToggleMore={true}
          maxStepCount={!hasDecision ? MAX_STEP_COUNT_FOCUS_REUEST : undefined}
          id={id}
        />
      )}
    </DetailPage>
  );
}
