import { WerkzaamhedenEnVervoerOpStraat } from '../../../server/services';
import { InfoDetail } from '../../components';
import { Location } from './Location';

export function WVOS({
  vergunning,
}: {
  vergunning: WerkzaamhedenEnVervoerOpStraat;
}) {
  const isAfgehandeld = vergunning.processed;

  return (
    <>
      <InfoDetail label="Kenmerk" value={vergunning.identifier} />

      {!!vergunning.location && <Location location={vergunning.location} />}

      <InfoDetail
        label="Werkzaamheden"
        valueWrapperElement="div"
        value={
          <ul>
            {(vergunning.vezip || vergunning.rvv || vergunning.eRvv) && (
              <li>
                Rijden of een voertuig neerzetten waar dat normaal niet mag
              </li>
            )}
            {vergunning.object && <li>Object(en) neerzetten</li>}
            {(vergunning.parkingspace || vergunning.eParkingspace) && (
              <li>Parkeervakken reserveren</li>
            )}
            {vergunning.block && <li>Een straat afzetten</li>}
            {vergunning.night && <li>Werkzaamheden verrichten in de nacht</li>}
            {vergunning.bicycleRack && (
              <li>
                Fietsen en/of fietsenrekken weg laten halen voor werkzaamheden
              </li>
            )}
            {vergunning.filming && <li>Filmen</li>}
          </ul>
        }
      />

      {isAfgehandeld && (
        <InfoDetail label="Resultaat" value={vergunning.decision} />
      )}
    </>
  );
}
