import { Persoon } from '../types';

export function getFullName(persoon: Persoon) {
  return persoon
    ? (
        persoon.opgemaakteNaam ||
        `${persoon.voornamen} ${
          persoon.voorvoegselGeslachtsnaam
            ? persoon.voorvoegselGeslachtsnaam + ' '
            : ''
        }${persoon.geslachtsnaam}`
      ).trim()
    : '';
}

export function getFullAddress(adres: {
  straatnaam: string | null;
  huisnummer: string | null;
  huisnummertoevoeging: string | null;
  huisletter: string | null;
}) {
  return adres
    ? `${adres.straatnaam} ${adres.huisnummer || ''} ${adres.huisletter ||
        ''} ${adres.huisnummertoevoeging || ''}`.trim()
    : 'unknown address';
}

export function getBagSearchAddress(adres: {
  straatnaam: string | null;
  huisnummer: string | null;
}) {
  return adres
    ? `${adres.straatnaam} ${adres.huisnummer || ''}`.trim()
    : 'unknown address';
}

export function isMokum(
  brpContent: { mokum?: boolean; persoon?: { mokum: boolean } } | null
) {
  return !!brpContent?.persoon?.mokum || !!brpContent?.mokum;
}
