import { defaultDateTimeFormat } from '../../../../universal/helpers';
import { documentDownloadName, productName } from '../helpers';
import { WpiRequestStatusLabels } from '../wpi-types';
import { requestProcess as tozoRequestProcess } from './tozo';

const aanvraagLabels: WpiRequestStatusLabels = {
  notification: {
    title: (requestProcess, statusStep) =>
      `Wij hebben uw aanvraag ${
        statusStep.about || requestProcess.about
      } ontvangen`,
    description: (requestProcess, statusStep) =>
      `Wij hebben uw aanvraag ${
        requestProcess.title
      } ontvangen op ${defaultDateTimeFormat(statusStep!.datePublished)}`,
  },
  description: (requestProcess, statusStep) =>
    `<p>Wij hebben uw aanvraag ${
      statusStep.about || requestProcess.about
    } ontvangen. Het kan zijn dat er meer informatie en tijd nodig is om uw aanvraag te behandelen. Bekijk de aanvraag voor meer details.</p>`,
};

const beslisTermijnLabels: WpiRequestStatusLabels = {
  notification: {
    title: (requestProcess, statusStep) =>
      `${statusStep.about || requestProcess.about}: Meer tijd nodig`,
    description: (requestProcess) =>
      `Wij hebben meer tijd nodig om uw aanvraag te behandelen.`,
  },
  description: (requestProcess) =>
    `<p>Wij hebben meer tijd nodig om uw aanvraag te behandelen. Bekijk de brief voor meer details.</p>`,
};

const akteLabels: WpiRequestStatusLabels = {
  notification: {
    title: (requestProcess, statusStep) =>
      `${
        statusStep.about || requestProcess.about
      }: Onderteken de akte voor bedrijfskapitaal`,
    description: (requestProcess) =>
      `Wij kunnen de lening voor bedrijfskapitaal uitbetalen als u de akte voor bedrijfskapitaal hebt ondertekend.`,
  },
  description: (requestProcess) =>
    `<p>Wij kunnen de lening voor bedrijfskapitaal uitbetalen als u de akte voor bedrijfskapitaal hebt ondertekend. Bekijk de brief voor meer details.</p>`,
};

const briefAdviesRapportLabels: WpiRequestStatusLabels = {
  notification: {
    title: (requestProcess, statusStep) =>
      `${statusStep.about || requestProcess.about}: Meer informatie nodig`,
    description: () =>
      `Wij hebben meer informatie en tijd nodig om uw aanvraag te behandelen.`,
  },
  description: () =>
    `<p>
        Wij hebben meer informatie en tijd nodig om uw aanvraag te behandelen.
        Bekijk de brief voor meer details.
      </p>`,
};

const besluitLabels: WpiRequestStatusLabels = {
  notification: tozoRequestProcess.besluit.notification,
  description: (requestProcess, statusStep) => {
    switch (statusStep?.decision) {
      case 'toekenning':
        return `<p>
        U hebt recht op ${productName(
          requestProcess,
          statusStep
        )}. Bekijk de brief voor meer details.
      </p>
      ${
        statusStep.productSpecific !== 'lening'
          ? "<p>Wilt u een wijziging in uw inkomen doorgeven? <a rel='external noopener noreferrer' class='inline' href='https://www.amsterdam.nl/ondernemen/ondersteuning/bijstand-zelfstandigen/wijzigingen-doorgeven/'>Kijk dan bij 'Wijziging of inkomsten doorgeven'</a></p>"
          : ''
      }<p><a rel="external noopener noreferrer" href="https://www.amsterdam.nl/werk-inkomen/pak-je-kans/">Meer regelingen van de gemeente Amsterdam</a></p>`;

      case 'toekenningVoorlopig':
        return `<p>
          U hebt recht op ${productName(
            requestProcess,
            statusStep
          )}. Kijk voor de voorwaarden in de brief.
        </p><p><a rel="external noopener noreferrer" href="https://www.amsterdam.nl/werk-inkomen/pak-je-kans/">Meer regelingen van de gemeente Amsterdam</a></p>`;

      case 'beschikking':
        return '<p>Wij hebben uw Bbz uitkering definitief berekend. Bekijk het besluit om te zien of u de uitkering mag houden of (voor een deel) moet terugbetalen.</p><p><a rel="external noopener noreferrer" href="https://www.amsterdam.nl/werk-inkomen/pak-je-kans/">Meer regelingen van de gemeente Amsterdam</a></p>';

      default:
        return tozoRequestProcess.besluit.description(
          requestProcess,
          statusStep
        );
    }
  },
};

const correctiemail: WpiRequestStatusLabels = {
  notification: {
    title: (requestProcess, statusStep) =>
      `${
        statusStep.about || requestProcess.about
      }: Wij hebben u een mail gestuurd`,
    description: () => `Wij hebben u gemaild over uw Bbz uitkering.`,
    link: (requestProcess, statusStep) => {
      const [document] = statusStep!.documents!;
      return {
        to: `${process.env.BFF_OIDC_BASE_URL || ''}/api/v1/relay${
          document.url
        }`,
        title: 'Bekijk de mail',
        download: documentDownloadName({
          datePublished: requestProcess.datePublished,
          title: 'Bbz-brief',
        }),
      };
    },
  },
  description: () =>
    `<p>Wij hebben u een mail gestuurd. Bekijk de mail voor meer details.</p>`,
};

const informatieOntvangen: WpiRequestStatusLabels = {
  notification: {
    title: (requestProcess, statusStep) =>
      `${
        statusStep.about || requestProcess.about
      }: Wij hebben uw formulier 'Bbz: informatie doorgeven' ontvangen`,
    description: (requestProcess, statusStep) =>
      `Wij hebben uw formulier 'Bbz: informatie doorgeven' ontvangen op ${defaultDateTimeFormat(
        statusStep.datePublished
      )}.`,
    link: (requestProcess, statusStep) => {
      const [document] = statusStep!.documents!;
      return {
        to: `${process.env.BFF_OIDC_BASE_URL || ''}/api/v1/relay${
          document.url
        }`,
        title: 'Bekijk uw formulier',
        download: documentDownloadName({
          datePublished: requestProcess.datePublished,
          title: 'Bbz-informatie-doorgeven-formulier',
        }),
      };
    },
  },
  description: (requestProcess, statusStep) =>
    `<p>Wij hebben uw formulier 'Bbz: informatie doorgeven' ontvangen op ${defaultDateTimeFormat(
      statusStep.datePublished
    )}. Het kan zijn dat er meer informatie en tijd nodig is om uw Bbz-uitkering definitief te kunnen berekenen. Bekijk het formulier voor meer details.</p>` +
    '<p>Wij maken een definitieve berekening van uw Bbz-uitkering en sturen u een besluit. We proberen dit binnen 3 maanden te doen. Het kan langer duren doordat het nog erg druk is op onze afdeling.</p>',
};

export const requestProcess = {
  aanvraag: aanvraagLabels,
  voorschot: tozoRequestProcess.voorschot,
  herstelTermijn: tozoRequestProcess.herstelTermijn,
  inkomstenwijziging: tozoRequestProcess.inkomstenwijziging,
  terugvorderingsbesluit: tozoRequestProcess.terugvorderingsbesluit,
  besluit: besluitLabels,
  intrekking: tozoRequestProcess.intrekking,
  briefAdviesRapport: briefAdviesRapportLabels,
  briefAkteBedrijfskapitaal: akteLabels,
  beslisTermijn: beslisTermijnLabels,
  correctiemail,
  informatieOntvangen,
};
