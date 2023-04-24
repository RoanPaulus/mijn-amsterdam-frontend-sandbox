import { Chapter, Chapters } from '../../universal/config';
import { SVGComponent } from '../../universal/types';
import {
  IconAlert,
  IconAVG,
  IconBelastingen,
  IconBurgerZaken,
  IconErfpacht,
  IconGarbage,
  IconHomeCommercial,
  IconInkomen,
  IconMijnGegevens,
  IconMilieuzone,
  IconMyNotifications,
  IconSiaMeldingen,
  IconStadspas,
  IconTips,
  IconVergunningen,
  IconZorg,
  IconToeristischeVerhuur,
  IconKrefia,
  IconSubsidie,
  IconSearch,
  IconWior,
  IconParkeren,
  IconKlachten,
  IconHoreca,
} from '../assets/icons';

export const ChapterIcons: Record<Chapter, SVGComponent> = {
  [Chapters.AFVAL]: IconGarbage,
  [Chapters.AVG]: IconAVG,
  [Chapters.BELASTINGEN]: IconBelastingen,
  [Chapters.BURGERZAKEN]: IconBurgerZaken,
  [Chapters.BUURT]: IconWior,
  [Chapters.INKOMEN]: IconInkomen,
  [Chapters.STADSPAS]: IconStadspas,
  [Chapters.BRP]: IconMijnGegevens,
  [Chapters.MILIEUZONE]: IconMilieuzone,
  [Chapters.SIA]: IconSiaMeldingen,
  [Chapters.NOTIFICATIONS]: IconMyNotifications,
  [Chapters.ROOT]: IconBurgerZaken,
  [Chapters.TIPS]: IconTips,
  [Chapters.ERFPACHT]: IconErfpacht,
  [Chapters.SUBSIDIE]: IconSubsidie,
  [Chapters.ZORG]: IconZorg,
  [Chapters.VERGUNNINGEN]: IconVergunningen,
  [Chapters.KVK]: IconHomeCommercial,
  [Chapters.TOERISTISCHE_VERHUUR]: IconToeristischeVerhuur,
  [Chapters.KREFIA]: IconKrefia,
  ALERT: IconAlert,
  [Chapters.SEARCH]: IconSearch,
  [Chapters.PARKEREN]: IconParkeren,
  [Chapters.KLACHTEN]: IconKlachten,
  [Chapters.HORECA]: IconHoreca,
};
