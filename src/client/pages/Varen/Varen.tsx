import { isError, isLoading } from '../../../universal/helpers/api';
import { addLinkElementToProperty } from '../../components/Table/TableV2';
import { ThemaTitles } from '../../config/thema';
import { useAppStateGetter } from '../../hooks/useAppState';
import { linkListItems } from '../Afis/Afis-thema-config';
import ThemaPagina from '../ThemaPagina/ThemaPagina';
import ThemaPaginaTable from '../ThemaPagina/ThemaPaginaTable';
import { tableConfig } from './config';
import { VarenFrontend } from '../../../server/services/varen/config-and-types';
import { LinkProps } from '../../../universal/types/App.types';
import { Grid, Paragraph } from '@amsterdam/design-system-react';

export default function Varen() {
  const { items, tableConfig, isLoading, isError } = useVarenThemaData();

  const linkListItems: LinkProps[] = [
    {
      to: 'https://www.amsterdam.nl/verkeer-vervoer/varen-amsterdam/varen-beroepsvaart/#:~:text=De%20passagiersvaart%20in%20Amsterdam%20is,stad%20willen%20we%20graag%20behouden.',
      title: 'Meer informatie over passagiers- en beroepsvaart',
    },
  ];

  const buttonItems: LinkProps[] = [
    {
      to: 'https://formulieren.acc.amsterdam.nl/TriplEforms/DirectRegelen/formulier/nl-NL/evAmsterdam/VARExploitatievergunningAanvragen.aspx',
      title: 'Exploitatievergunning aanvragen',
    },
  ];

  const pageContentTop = (
    <Paragraph>
      De passagiersvaart in Amsterdam is erg populair bij bezoekers.
      Rondvaartboten en salonboten zijn een vorm van passagiersvaart. Ook
      gehuurde boten, met of zonder schipper, vallen onder de passagiersvaart.
    </Paragraph>
  );

  const registratieReder = items.find(
    (item) => item.caseType === 'Varen registratie reder'
  );
  if (!registratieReder) {
    return <></>; // TODO: Default page
  }

  // TODO: Use existing component or create reusable detailView component
  const displayPropsReder = ['email', 'company'];
  const aanvragerGegevens = (
    <Grid.Cell span="all">
      <Grid>
        {Object.entries(registratieReder)
          .filter(([key]) => displayPropsReder.includes(key))
          .map(([key, value]) => (
            <Grid key={key}>
              <Grid.Cell start={1} span={12}>
                <b>{key}</b>
              </Grid.Cell>
              <Grid.Cell start={1} span={12}>
                {value}
              </Grid.Cell>
            </Grid>
          ))}
      </Grid>
    </Grid.Cell>
  );

  const tables = Object.entries(tableConfig).map(
    ([kind, { title, displayProps, filter, sort }]) => {
      return (
        <ThemaPaginaTable<VarenFrontend>
          key={kind}
          title={title}
          zaken={items.filter(filter).sort(sort)}
          displayProps={displayProps}
          textNoContent={`U heeft geen ${title.toLowerCase()}`}
        />
      );
    }
  );

  const pageContentMain = (
    <>
      {aanvragerGegevens} {tables}
    </>
  );

  return (
    <ThemaPagina
      title={ThemaTitles.VAREN}
      isLoading={isLoading}
      isError={isError}
      pageContentTop={pageContentTop}
      pageContentMain={pageContentMain}
      isPartialError={false}
      linkListItems={linkListItems}
      buttonItems={buttonItems}
    />
  );
}

// TODO: Move to own file
export function useVarenThemaData() {
  const { VAREN } = useAppStateGetter();

  const items = addLinkElementToProperty<VarenFrontend>(
    VAREN.content ?? [],
    'identifier',
    true
  );

  return {
    tableConfig,
    isLoading: isLoading(VAREN),
    isError: isError(VAREN),
    items,
    linkListItems,
  };
}
