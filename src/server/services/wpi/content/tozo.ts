import {
  defaultDateFormat,
  defaultDateTimeFormat,
} from '../../../../universal/helpers';
import { productName } from '../helpers';
import { WpiRequestStatusLabels } from '../wpi-types';

const aanvraagLabels: WpiRequestStatusLabels = {
  notification: {
    title: (requestProcess, statusStep) =>
      `Wij hebben uw aanvraag ${requestProcess.about} ontvangen`,
    description: (requestProcess, statusStep) =>
      `Wij hebben uw aanvraag ${
        requestProcess.title
      } ontvangen op ${defaultDateTimeFormat(statusStep!.datePublished)}`,
  },
  description: (requestProcess, statusStep) =>
    `<p>
        Wij hebben uw aanvraag ${requestProcess.about} ontvangen.
      </p>`,
};

const voorschotLabels: WpiRequestStatusLabels = {
  notification: {
    title: (requestProcess, statusStep) => {
      return `${requestProcess.about}: Wij hebben een voorschot betaald`;
    },
    description: (requestProcess, statusStep) =>
      `Wij hebben een voorschot naar uw rekening overgemaakt.`,
  },
  description: (requestProcess, statusStep) =>
    `<p>
          Wij hebben een voorschot naar uw rekening overgemaakt. Kijk voor de
          voorwaarden in de brief.
        </p>`,
};

const herstelTermijnLabels: WpiRequestStatusLabels = {
  notification: {
    title: (requestProcess, statusStep) =>
      `${requestProcess.about}: Meer informatie nodig`,
    description: (requestProcess, statusStep) =>
      `Wij hebben meer informatie en tijd nodig om uw aanvraag te behandelen.`,
  },
  description: (requestProcess, statusStep) =>
    `<p>
        Wij hebben meer informatie en tijd nodig om uw aanvraag te behandelen.
        Bekijk de brief voor meer details.
      </p>`,
};

const inkomstenVerklaringLabels: WpiRequestStatusLabels = {
  notification: {
    title: (requestProcess, statusStep) =>
      `${requestProcess.about}: Wij hebben een wijziging van uw inkomsten ontvangen`,
    description: (requestProcess, statusStep) =>
      `Wij hebben een wijziging van uw inkomsten voor ${
        requestProcess.title
      } ontvangen op ${defaultDateTimeFormat(statusStep!.datePublished)}`,
  },
  description: (requestProcess, statusStep) =>
    `
    <p>Wij hebben een wijziging van uw inkomsten voor ${
      requestProcess.title
    } ontvangen op ${defaultDateTimeFormat(statusStep!.datePublished)}</p>
    <p>De wijziging wordt zo snel mogelijk verwerkt. Als u een nabetaling krijgt dan ziet u dat op uw uitkeringsspecificatie. Als u moet terugbetalen dan ontvangt u daarover een besluit per post.</p>`,
};

const terugvorderingLabels: WpiRequestStatusLabels = {
  notification: {
    title: (requestProcess, statusStep) =>
      `${requestProcess.about}: U moet (een deel van) uw uitkering terugbetalen.`,
    description: (requestProcess, statusStep) =>
      `U moet (een deel van) uw ${productName(
        requestProcess,
        statusStep,
        false
      )} terugbetalen. (besluit: ${defaultDateFormat(
        statusStep!.datePublished
      )}).`,
  },
  description: (requestProcess, statusStep) =>
    `<p>
    U moet (een deel van) uw ${productName(
      requestProcess,
      statusStep,
      false
    )} terugbetalen.
    Bekijk de brief voor meer details.
    </p>
    <p><a rel="external noopener noreferrer" href="https://www.amsterdam.nl/werk-inkomen/pak-je-kans/">Meer regelingen van de gemeente Amsterdam</a></p>`,
};

const intrekkenLabels: WpiRequestStatusLabels = {
  notification: {
    title: (requestProcess) => `${requestProcess.about}: Aanvraag ingetrokken`,
    description: (requestProcess) =>
      `U hebt uw ${requestProcess.about} aanvraag ingetrokken.`,
  },
  description: (requestProcess) =>
    `<p>U hebt uw ${requestProcess.about} aanvraag ingetrokken. Bekijk de brief voor meer details.</p><p><a rel="external noopener noreferrer" href="https://www.amsterdam.nl/werk-inkomen/pak-je-kans/">Meer regelingen van de gemeente Amsterdam</a></p>`,
};

const besluitLabels: WpiRequestStatusLabels = {
  notification: {
    title: (requestProcess, statusStep) => {
      switch (statusStep?.decision) {
        case 'toekenning':
          return `${requestProcess.about}: Uw aanvraag is toegekend`;

        case 'afwijzing':
          return `${requestProcess.about}: Uw aanvraag is afgewezen`;

        case 'buitenBehandeling':
          return `${requestProcess.about}: Wij behandelen uw aanvraag niet meer`;

        default:
        case 'vrijeBeschikking':
          return `${requestProcess.about}: Besluit aanvraag`;
      }
    },
    description: (requestProcess, statusStep) => {
      switch (statusStep?.decision) {
        case 'toekenning':
          return `U hebt recht op ${productName(
            requestProcess,
            statusStep
          )} (besluit: ${defaultDateFormat(statusStep!.datePublished)}).`;

        case 'afwijzing':
          return `U hebt geen recht op ${productName(
            requestProcess,
            statusStep
          )} (besluit: ${defaultDateFormat(statusStep!.datePublished)}).`;

        case 'buitenBehandeling':
          return `Bekijk de brief voor meer details.`;

        default:
        case 'vrijeBeschikking':
          return `Wij hebben een besluit genomen over uw ${requestProcess.about} aanvraag.`;
      }
    },
  },
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
          ? "<p>Wilt u een wijziging in uw inkomen doorgeven? <a rel='external noopener noreferrer' class='inline' href='https://www.amsterdam.nl/ondernemen/ondersteuning/tozo/wijzigingen-doorgeven/'>Kijk dan bij 'Wijziging of inkomsten doorgeven'</a></p>"
          : ''
      }<p><a rel="external noopener noreferrer" href="https://www.amsterdam.nl/werk-inkomen/pak-je-kans/">Meer regelingen van de gemeente Amsterdam</a></p>`;

      case 'afwijzing':
        return `<p>
        U hebt geen recht op ${productName(
          requestProcess,
          statusStep
        )}. Bekijk de brief voor meer details.
      </p><p><a rel="external noopener noreferrer" href="https://www.amsterdam.nl/werk-inkomen/pak-je-kans/">Meer regelingen van de gemeente Amsterdam</a></p>`;

      case 'buitenBehandeling':
        return `<p>Wij behandelen uw aanvraag voor ${requestProcess.about} niet meer. Bekijk de brief voor meer details.</p><p><a rel="external noopener noreferrer" href="https://www.amsterdam.nl/werk-inkomen/pak-je-kans/">Meer regelingen van de gemeente Amsterdam</a></p>`;

      default:
      case 'vrijeBeschikking':
        return `<p>Wij hebben een besluit genomen over uw ${requestProcess.about} aanvraag. Bekijk de brief voor meer details.</p>`;
    }
  },
};

export const requestProcess = {
  aanvraag: aanvraagLabels,
  voorschot: voorschotLabels,
  herstelTermijn: herstelTermijnLabels,
  inkomstenwijziging: inkomstenVerklaringLabels,
  terugvorderingsbesluit: terugvorderingLabels,
  besluit: besluitLabels,
  intrekking: intrekkenLabels,
};
