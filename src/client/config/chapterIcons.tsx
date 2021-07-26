import { Chapter, Chapters } from '../../universal/config';
import { SVGComponent } from '../../universal/types';
import {
  IconAlert,
  IconBelastingen,
  IconBurgerZaken,
  IconErfpacht,
  IconGarbage,
  IconHomeCommercial,
  IconInkomen,
  IconMijnGegevens,
  IconMilieuzone,
  IconMyNotifications,
  IconStadspas,
  IconTips,
  IconVergunningen,
  IconZorg,
  IconToeristischeVerhuur,
} from '../assets/icons';

export const ChapterIcons: Record<Chapter, SVGComponent> = {
  [Chapters.AFVAL]: IconGarbage,
  [Chapters.BELASTINGEN]: IconBelastingen,
  [Chapters.BURGERZAKEN]: IconBurgerZaken,
  [Chapters.BUURT]: IconBurgerZaken,
  [Chapters.INKOMEN]: IconInkomen,
  [Chapters.STADSPAS]: IconStadspas,
  [Chapters.BRP]: IconMijnGegevens,
  [Chapters.MILIEUZONE]: IconMilieuzone,
  [Chapters.NOTIFICATIONS]: IconMyNotifications,
  [Chapters.ROOT]: IconBurgerZaken,
  [Chapters.TIPS]: IconTips,
  [Chapters.ERFPACHT]: IconErfpacht,
  [Chapters.ZORG]: IconZorg,
  [Chapters.VERGUNNINGEN]: IconVergunningen,
  [Chapters.KVK]: IconHomeCommercial,
  [Chapters.TOERISTISCHE_VERHUUR]: IconToeristischeVerhuur,
  ALERT: IconAlert,
};
