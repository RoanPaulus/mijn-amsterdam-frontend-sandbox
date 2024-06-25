import { useCallback } from 'react';
import Linkd from '../../components/Button/Button';
import { ExternalUrls } from '../../config/app';
import StatusDetail, { StatusSourceItem } from '../StatusDetail/StatusDetail';
import {
  Grid,
  Link,
  LinkList,
  Paragraph,
} from '@amsterdam/design-system-react';

export const MAX_STEP_COUNT_WPI_REQUEST = 4;

export default function InkomenDetailUitkering() {
  const pageContent = useCallback(
    (isLoading: boolean, inkomenItem: StatusSourceItem) => {
      return (
        <>
          <Grid.Cell span="all">
            <Paragraph>
              Hieronder ziet u de status van uw aanvraag voor een
              bijstandsuitkering. Het duurt maximaal 3 werkdagen voordat uw
              documenten over de bijstandsuitkering in Mijn Amsterdam staan.
            </Paragraph>
          </Grid.Cell>
          <Grid.Cell span="all">
            <LinkList>
              <LinkList.Link
                rel="noreferrer"
                href={ExternalUrls.WPI_BIJSTANDSUITKERING}
              >
                Meer informatie over de bijstandsuitkering
              </LinkList.Link>
            </LinkList>
          </Grid.Cell>
        </>
      );
    },
    []
  );

  return (
    <StatusDetail
      thema="INKOMEN"
      stateKey="WPI_AANVRAGEN"
      pageContent={pageContent}
      maxStepCount={(hasDecision) =>
        !hasDecision ? MAX_STEP_COUNT_WPI_REQUEST : undefined
      }
      documentPathForTracking={(document) =>
        `/downloads/inkomen/bijstandsuitkering/${document.title.replace(
          /\\n/,
          ''
        )}`
      }
    />
  );
}
