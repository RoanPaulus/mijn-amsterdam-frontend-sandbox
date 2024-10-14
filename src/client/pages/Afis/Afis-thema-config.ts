import { ReactNode } from 'react';

import { generatePath } from 'react-router-dom';

import {
  AfisFacturenByStateResponse,
  AfisFacturenResponse,
  AfisFactuur,
  AfisFactuurState,
} from '../../../server/services/afis/afis-types';
import { AppRoutes } from '../../../universal/config/routes';
import { ZaakDetail } from '../../../universal/types';
import { DisplayProps } from '../../components/Table/TableV2';
import { MAX_TABLE_ROWS_ON_THEMA_PAGINA } from '../../config/app';

// Themapagina
const MAX_TABLE_ROWS_ON_THEMA_PAGINA_OPEN = 5;
const MAX_TABLE_ROWS_ON_THEMA_PAGINA_TRANSFERRED =
  MAX_TABLE_ROWS_ON_THEMA_PAGINA;
const MAX_TABLE_ROWS_ON_THEMA_PAGINA_CLOSED = MAX_TABLE_ROWS_ON_THEMA_PAGINA;

const displayPropsFacturenOpen: DisplayProps<AfisFactuurFrontend> = {
  afzender: 'Afzender',
  factuurNummerEl: 'Factuurnummer',
  statusDescription: 'Status',
  paymentDueDateFormatted: 'Vervaldatum',
};

const displayPropsFacturenAfgehandeld: DisplayProps<AfisFactuurFrontend> = {
  afzender: 'Afzender',
  factuurNummerEl: 'Factuurnummer',
  statusDescription: 'Status',
};

const displayPropsFacturenOvergedragen: DisplayProps<AfisFactuurFrontend> = {
  afzender: 'Afzender',
  factuurNummerEl: 'Factuurnummer',
  statusDescription: 'Status',
};

export const listPageTitle: Record<AfisFactuurState, string> = {
  open: 'Openstaande facturen',
  afgehandeld: 'Afgehandelde facturen',
  overgedragen: 'Overgedragen facturen',
};

export type AfisEmandateStub = ZaakDetail & Record<string, string>;

export type AfisFactuurFrontend = AfisFactuur & {
  factuurNummerEl: ReactNode;
};

export type AfisFacturenResponseFrontend = AfisFacturenResponse & {
  facturen: AfisFactuurFrontend[];
};

export type AfisFacturenByStateFrontend = {
  [key in keyof AfisFacturenByStateResponse]: AfisFacturenResponseFrontend;
};

type AfisFacturenTableConfig = {
  title: string;
  subTitle?: string;
  displayProps: DisplayProps<AfisFactuurFrontend>;
  maxItems: number;
  listPageLinkLabel: string;
  listPageRoute: string;
};

type AfisFacturenTableConfigByState = Record<
  AfisFactuurState,
  AfisFacturenTableConfig
>;

export const facturenTableConfig: AfisFacturenTableConfigByState = {
  open: {
    title: listPageTitle.open,
    displayProps: displayPropsFacturenOpen,
    maxItems: MAX_TABLE_ROWS_ON_THEMA_PAGINA_OPEN,
    listPageLinkLabel: 'Alle openstaande facturen',
    listPageRoute: generatePath(AppRoutes['AFIS/FACTUREN'], {
      state: 'open',
    }),
  },
  afgehandeld: {
    title: listPageTitle.afgehandeld,
    displayProps: displayPropsFacturenAfgehandeld,
    maxItems: MAX_TABLE_ROWS_ON_THEMA_PAGINA_CLOSED,
    listPageLinkLabel: 'Alle afgehandelde facturen',
    listPageRoute: generatePath(AppRoutes['AFIS/FACTUREN'], {
      state: 'afgehandeld',
    }),
  },
  overgedragen: {
    title: listPageTitle.overgedragen,
    displayProps: displayPropsFacturenOvergedragen,
    maxItems: MAX_TABLE_ROWS_ON_THEMA_PAGINA_TRANSFERRED,
    listPageLinkLabel: 'Alle overgedragen facturen',
    listPageRoute: generatePath(AppRoutes['AFIS/FACTUREN'], {
      state: 'overgedragen',
    }),
  },
} as const;

// Betaalvoorkeuren
const displayPropsEmandates: DisplayProps<AfisEmandateStub> = {
  name: 'Naam',
};

export const businessPartnerDetailsLabels = {
  fullName: 'Debiteurnaam',
  businessPartnerId: 'Debiteurnummer',
  email: 'E-mailadres factuur',
  phone: 'Telefoonnummer',
};

export const eMandateTableConfig = {
  active: {
    title: `Actieve automatische incasso's`,
    filter: (emandate: AfisEmandateStub) => emandate.isActive,
    displayProps: displayPropsEmandates,
  },
  inactive: {
    title: `Niet actieve automatische incasso's`,
    filter: (emandate: AfisEmandateStub) => !emandate.isActive,
    displayProps: displayPropsEmandates,
  },
} as const;

export const routes = {
  listPageFacturen: AppRoutes['AFIS/FACTUREN'],
  betaalVoorkeuren: AppRoutes['AFIS/BETAALVOORKEUREN'],
  themaPage: AppRoutes.AFIS,
} as const;
