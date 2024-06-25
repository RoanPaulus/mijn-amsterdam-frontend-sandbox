import StatusDetail from '../StatusDetail/StatusDetail';

export const MAX_STEP_COUNT_WPI_REQUEST = 4;

export default function StadspasAanvraagDetail() {
  return (
    <StatusDetail
      thema="STADSPAS"
      stateKey="STADSPAS"
      getItems={(stadspasContent) => {
        if (stadspasContent !== null && 'aanvragen' in stadspasContent) {
          return stadspasContent.aanvragen;
        }
        return [];
      }}
      maxStepCount={(hasDecision) =>
        !hasDecision ? MAX_STEP_COUNT_WPI_REQUEST : undefined
      }
      documentPathForTracking={(document) =>
        `/downloads/stadspas/${document.title}`
      }
    />
  );
}
