import { defaultDateFormat } from '../../../../universal/helpers/date';
import { ZorgnedStatusLineItemTransformerConfig } from '../../zorgned/zorgned-config-and-types';

export const BESLUIT: ZorgnedStatusLineItemTransformerConfig = {
  status: 'Besluit',
  datePublished: (regeling) => regeling.datumBesluit,
  isChecked: (stepIndex, regeling) => true,
  isActive: (stepIndex, regeling) =>
    regeling.isActueel === true || regeling.resultaat === 'afgewezen',
  description: (regeling) =>
    `<p>
        ${
          regeling.resultaat === 'toegewezen'
            ? `U heeft recht op ${regeling.titel} per ${regeling.datumIngangGeldigheid ? defaultDateFormat(regeling.datumIngangGeldigheid) : ''}`
            : `U heeft geen recht op ${regeling.titel}`
        }.
        </p>
        <p>
          In de brief leest u ook hoe u bezwaar kunt maken of een klacht kan
          indienen.
        </p>
      `,
};

export const EINDE_RECHT: ZorgnedStatusLineItemTransformerConfig = {
  status: 'Einde recht',
  isVisible: (i, regeling) => regeling.resultaat === 'toegewezen',
  datePublished: (regeling) => regeling.datumEindeGeldigheid ?? '',
  isChecked: (stepIndex, regeling) => regeling.isActueel === false,
  isActive: (stepIndex, regeling) => regeling.isActueel === false,
  description: (regeling) =>
    `
        <p>
          ${
            regeling.isActueel
              ? `Uw recht op ${regeling.titel} stopt per ${regeling.datumEindeGeldigheid ? defaultDateFormat(regeling.datumEindeGeldigheid) : ''}.`
              : `Uw recht op ${regeling.titel} is beëindigd ${
                  regeling.datumEindeGeldigheid
                    ? `per ${defaultDateFormat(regeling.datumEindeGeldigheid)}`
                    : ''
                }`
          }
        </p>
      `,
};
