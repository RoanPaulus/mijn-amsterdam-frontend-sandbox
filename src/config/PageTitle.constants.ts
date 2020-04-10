import { ChapterTitles } from './Chapter.constants';
import { AppRoutes } from './Routing.constants';

export const PageTitleMain = 'Mijn Amsterdam';

// Used in <html><head><title>{PageTitle}</title></head>
export const PageTitles = {
  [AppRoutes.ROOT]: 'Home | Dashboard',
  [AppRoutes.BURGERZAKEN]: ChapterTitles.BURGERZAKEN,
  [AppRoutes.BELASTINGEN]: ChapterTitles.BELASTINGEN,
  [AppRoutes.ZORG]: `${ChapterTitles.ZORG} overzicht`,
  [AppRoutes['ZORG/VOORZIENINGEN']]: `Voorziening | ${ChapterTitles.ZORG}`,
  [AppRoutes.INKOMEN]: `${ChapterTitles.INKOMEN} | overzicht`,
  [AppRoutes['INKOMEN/BIJSTANDSUITKERING']]: `Bijstandsuitkering`,
  [AppRoutes['INKOMEN/STADSPAS']]: `Stadspas | ${ChapterTitles.INKOMEN}`,
  [AppRoutes[
    'INKOMEN/BIJZONDERE_BIJSTAND'
  ]]: `Bijzondere bijstand | ${ChapterTitles.INKOMEN}`,
  [AppRoutes.MIJN_GEGEVENS]: `Profiel`,
  [AppRoutes.MIJN_BUURT]: `Mijn buurt`,
  [AppRoutes.PROCLAIMER]: `Proclaimer`,
  [AppRoutes.MIJN_TIPS]: `Mijn Tips | overzicht`,
  [AppRoutes.UPDATES]: `${ChapterTitles.UPDATES} | overzicht`,
  [AppRoutes.AFVAL]: `${ChapterTitles.AFVAL} rond uw adres`,
};
