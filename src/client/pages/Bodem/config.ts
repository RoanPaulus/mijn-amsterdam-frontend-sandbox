import { LoodMeting } from '../../../server/services/bodem/types';
import { dateSort } from '../../../universal/helpers/date';

export const displayPropsAanvragen = {
  adres: 'Adres',
  datumAanvraag: 'Aangevraagd',
  status: 'Status',
};

export const listPageParamKind = {
  inProgress: 'lopende-aanvragen',
  completed: 'afgehandelde-aanvragen',
};

export const tableConfig = {
  [listPageParamKind.inProgress]: {
    title: 'Lopende aanvragen',
    filter: (bodemAanvraag: LoodMeting) => !bodemAanvraag.datumAfgehandeld,
    sort: dateSort('dateRequest', 'desc'),
    displayProps: displayPropsAanvragen,
  },
  [listPageParamKind.completed]: {
    title: 'Afgehandelde aanvragen',
    filter: (bodemAanvraag: LoodMeting) => bodemAanvraag.datumAfgehandeld,
    sort: dateSort('dateRequest', 'desc'),
    displayProps: displayPropsAanvragen,
  },
};
