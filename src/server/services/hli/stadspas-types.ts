import { LinkProps } from '../../../universal/types/App.types';

export interface StadspasTransactieSource {
  id: number;
  transactiedatum: string;
  bedrag: number;
  pashouder: { id: number; hoofd_pashouder_id: number };
  pas: {
    id: number;
    pasnummer: number;
    pasnummer_volledig: string;
    originele_pas: {
      id: number;
      pasnummer: number;
      pasnummer_volledig: string;
    };
  };
  budget: {
    id: number;
    code: string;
    naam: string;
    aanbieder: { id: number; naam: string };
  };
}

export interface StadspasTransactiesResponseSource {
  number_of_items: number;
  total_items: number;
  transacties: StadspasTransactieSource[];
}

export interface StadspasHouderPasSource {
  actief: boolean;
  pasnummer: number;
}

export interface StadspasHouderSource {
  initialen: string;
  achternaam: string;
  tussenvoegsel?: string;
  voornaam: string;
  passen: StadspasHouderPasSource[];
  volledige_naam?: string;
}

export interface StadspasPasHouderResponse extends StadspasHouderSource {
  sub_pashouders: StadspasHouderSource[];
}

export interface StadspasDetailBudgetSource {
  code: string;
  naam: string;
  omschrijving: string;
  expiry_date: string;
  budget_assigned: number;
  budget_balance: number;
}

export interface StadspasDetailSource {
  actief: boolean;
  balance_update_time: string;
  budgetten: StadspasDetailBudgetSource[];
  budgetten_actief: boolean;
  categorie: string;
  categorie_code: string;
  expiry_date: string;
  id: number;
  originele_pas: {
    categorie: string;
    categorie_code: string;
    id: number;
    pasnummer: number;
    pasnummer_volledig: string;
    passoort: { id: number; naam: string };
  };
  pasnummer: number;
  pasnummer_volledig: string;
  passoort: { id: number; naam: string };
}

// Transformed types
export interface StadspasBudget {
  title: string;
  description: string;
  code: string;
  budgetAssigned: number;
  budgetAssignedFormatted: string;
  budgetBalance: number;
  budgetBalanceFormatted: string;
  urlTransactions: string;
  transactionsKey: string;
  dateEnd: string;
  dateEndFormatted: string;
}

export interface StadspasOwner {
  initials: string;
  firstname: string;
  infix?: string;
  lastname: string;
}

export interface Stadspas {
  id: string;
  passNumber: string;
  passType: 'kind' | 'ouder';
  owner: StadspasOwner;
  dateEnd: string;
  dateEndFormatted: string;
  budgets: StadspasBudget[];
  balanceFormatted: string;
  urlTransactions: string;
  link?: LinkProps;
}

export interface StadspasTransaction {
  id: string;
  title: string;
  amount: number;
  amountFormatted: string;
  datePublished: string;
  datePublishedFormatted: string;
  budget: StadspasBudget['description'];
  budgetCode: StadspasBudget['code'];
}

export interface StadspasResponseData {
  stadspassen: Stadspas[];
  aanvragen: never[];
}

export type StadspasAdministratieNummer = string;
