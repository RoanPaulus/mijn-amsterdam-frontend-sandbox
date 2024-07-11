import { Grid, Paragraph, Screen } from '@amsterdam/design-system-react';
import { ReactNode, useMemo } from 'react';
import { generatePath, useHistory, useParams } from 'react-router-dom';
import {
  ErrorAlert,
  LoadingContent,
  OverviewPage,
  PageHeading,
  ThemaIcon,
} from '..';
import { Thema } from '../../../universal/config/thema';
import { PaginationV2 } from '../Pagination/PaginationV2';
import { TableV2 } from '../Table/TableV2';

const DEFAULT_PAGE_SIZE = 10;

interface ListPagePaginatedProps {
  appRoute: string;
  appRouteBack: string;
  appRouteParams?: Record<string, string> | null;
  backLinkTitle?: string;
  displayProps: Record<string, string> | null;
  isError: boolean;
  isLoading: boolean;
  items: object[];
  title: string;
  body?: ReactNode;
  thema?: Thema;
  errorText?: string;
  noItemsText?: string;
  pageSize?: number;
}

export function ListPagePaginated({
  appRoute,
  appRouteBack,
  appRouteParams = null,
  backLinkTitle = 'Overzicht',
  body,
  thema,
  displayProps,
  errorText = 'We kunnen op dit moment niet alle gegevens tonen.',
  noItemsText = 'U heeft (nog) geen gegevens op deze pagina.',
  isError,
  isLoading,
  items,
  pageSize = DEFAULT_PAGE_SIZE,
  title,
}: ListPagePaginatedProps) {
  const history = useHistory();

  const { page = '1' } = useParams<{
    page?: string;
  }>();

  const currentPage = (() => {
    if (!page) {
      return 1;
    }
    return parseInt(page, 10);
  })();

  const itemsPaginated = useMemo(() => {
    const startIndex = currentPage - 1;
    const start = startIndex * pageSize;
    const end = start + pageSize;
    return items.slice(start, end);
  }, [currentPage, items, pageSize]);

  const total = items.length;

  return (
    <OverviewPage>
      <PageHeading
        icon={<ThemaIcon thema={thema} />}
        backLink={{ to: appRouteBack, title: backLinkTitle }}
      >
        {title}
      </PageHeading>
      <Screen>
        <Grid>
          {!!body && <Grid.Cell span="all">{body}</Grid.Cell>}
          {isError && (
            <Grid.Cell span="all">
              <ErrorAlert>{errorText}</ErrorAlert>
            </Grid.Cell>
          )}
          <Grid.Cell span="all">
            {isLoading && (
              <LoadingContent
                barConfig={[
                  ['100%', '2rem', '2rem'],
                  ['100%', '2rem', '2rem'],
                  ['100%', '2rem', '2rem'],
                ]}
              />
            )}
            {!isError && (
              <>
                {!isLoading && !itemsPaginated.length && !!noItemsText && (
                  <Grid.Cell span="all">
                    <Paragraph>{noItemsText}</Paragraph>
                  </Grid.Cell>
                )}
                {!isLoading && !!itemsPaginated.length && (
                  <TableV2 items={itemsPaginated} displayProps={displayProps} />
                )}
                {items.length > pageSize && (
                  <PaginationV2
                    totalCount={total}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageClick={(page: number) => {
                      history.push(
                        generatePath(appRoute, {
                          ...appRouteParams,
                          page,
                        })
                      );
                    }}
                  />
                )}
              </>
            )}
          </Grid.Cell>
        </Grid>
      </Screen>
    </OverviewPage>
  );
}
