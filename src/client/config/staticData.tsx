import { Themas } from '../../universal/config/thema';
import { MyNotification } from '../../universal/types';
import { ExternalUrls } from './app';

export const WelcomeNotification: MyNotification = {
  id: 'welcome01',
  thema: Themas.NOTIFICATIONS,
  datePublished: new Date(2022, 0, 20).toISOString(),
  title: 'Welkom op Mijn Amsterdam!',
  hideDatePublished: true,
  description: `
      <p>
        De persoonlijke digitale pagina voor burgers
        en ondernemers bij de gemeente Amsterdam. Hier ziet u op 1 centrale
        plek:
      </p>
      <ul>
        <li>welke gegevens de gemeente van u heeft vastgelegd. </li>
        <li>welke producten en diensten U heeft bij de gemeente Amsterdam. </li>
        <li>
          wat de status is en hoe u het kunt doorgeven als er iets niet klopt.
        </li>
      </ul>
      <p>
      Mijn Amsterdam wordt nog steeds verder ontwikkeld. Er komt steeds meer informatie bij.
      </p>

    `,
  customLink: {
    callback: () => {
      const usabilla = (window as any).usabilla_live;
      if (usabilla) {
        usabilla('click');
      } else {
        window.location.href = ExternalUrls.CONTACT_FORM;
      }
    },
    title: 'Laat ons weten wat u ervan vindt',
  },
};
