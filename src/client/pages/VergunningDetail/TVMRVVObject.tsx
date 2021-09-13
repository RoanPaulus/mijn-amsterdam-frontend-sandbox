import { TVMRVVObject as TVMRVVObjectType } from '../../../server/services';
import { defaultDateFormat } from '../../../universal/helpers';
import InfoDetail, {
  InfoDetailGroup,
} from '../../components/InfoDetail/InfoDetail';
import { Location } from './Location';

export function TVMRVVObject({ vergunning }: { vergunning: TVMRVVObjectType }) {
  return (
    <>
      <InfoDetail label="Kenmerk" value={vergunning?.identifier || '-'} />
      <InfoDetail label="Soort vergunning" value={vergunning.caseType || '-'} />
      <InfoDetail label="Omschrijving" value={vergunning?.description || '-'} />
      {!!vergunning.location && <Location location={vergunning.location} />}
      <InfoDetailGroup>
        <InfoDetail
          label="Vanaf"
          value={
            (vergunning?.dateStart
              ? defaultDateFormat(vergunning.dateStart)
              : '-') +
            (vergunning?.timeStart ? ` - ${vergunning.timeStart} uur` : '')
          }
        />
        <InfoDetail
          label="Tot en met"
          value={
            (vergunning?.dateEnd
              ? defaultDateFormat(vergunning.dateEnd)
              : '-') +
            (vergunning?.timeEnd ? ` - ${vergunning.timeEnd} uur` : '')
          }
        />
      </InfoDetailGroup>
      {!!vergunning?.decision && (
        <InfoDetail label="Resultaat" value={vergunning.decision} />
      )}
    </>
  );
}
