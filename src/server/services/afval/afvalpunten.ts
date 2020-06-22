import scrapeIt from 'scrape-it';
import {
  apiSuccesResult,
  getApproximateDistance,
} from '../../../universal/helpers';
import memoryCache from 'memory-cache';
import { sanitizeCmsContent } from '../index';
import { GarbageCenter } from '../../../universal/types/afval';
import { sortAlpha } from '../../../universal/helpers/utils';

export const cache = new memoryCache.Cache<string, any>();
const AFVALPUNT_CACHE_TTL = 24 * 60 * 60 * 1000; // 1 day

interface ScrapedOpeningsTijden {
  openingstijden: { content: string };
}

type ScrapedGeoLocation = Pick<GarbageCenter, 'title' | 'url' | 'latlng'>;

type ScrapedDetailInfo = Pick<GarbageCenter, 'address' | 'phone' | 'email'> & {
  openingHours: string;
};

interface ScrapedDetailInfoTable {
  label: string;
  value: string;
  url?: string;
}

type ScrapedGeoAndDetail = ScrapedGeoLocation & ScrapedDetailInfo;

const tableLabelTranslation: Record<string, string> = {
  openingstijden: 'openingHours',
  adres: 'address',
  telefoon: 'phone',
};

async function scrapeDetailInfo(item: ScrapedGeoLocation) {
  const cacheKey = 'afvalpunten-detail-info-' + item.title;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return cachedData as ScrapedGeoAndDetail;
  }

  const scrapeResult = await scrapeIt<{
    items: ScrapedDetailInfoTable[];
  }>(item.url, {
    items: {
      listItem: 'tr',
      data: {
        label: 'th',
        value: {
          selector: 'td',
          how: (d: any) => {
            const p = d.find('p');
            if (p.length) {
              return p.html();
            }
            return d.text();
          },
        },
        url: {
          selector: 'a',
          attr: 'href',
        },
      },
    },
  });

  /**
   * Filter out unwanted data, transform data into nicely shaped object
   */
  const tableData = scrapeResult.data.items
    .filter(item => item.label !== 'Website')
    .reduce((acc, { label, value, url }) => {
      const labelTransformed = label.toLowerCase().replace(/[^a-z]/gi, '');
      const labelFinal =
        tableLabelTranslation[labelTransformed] || labelTransformed;
      return {
        ...acc,
        [labelFinal]: label === 'Openingstijden' ? url : value,
      };
    }, {} as ScrapedDetailInfo);
  /**
   * Combine data from previous pages
   */
  const itemCombined: ScrapedGeoAndDetail = {
    title: item.title,
    latlng: item.latlng,
    url: item.url,
    ...tableData,
  };

  cache.put(cacheKey, itemCombined, AFVALPUNT_CACHE_TTL);

  return itemCombined;
}

async function scrapeOpeningstijden(url: string) {
  const cacheKey = 'afvalpunten-openingstijden';
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return cachedData as string;
  }

  const scrapeResult = await scrapeIt<ScrapedOpeningsTijden>(url, {
    openingstijden: {
      selector: '#zone_content > .grid-case-blok',
      eq: 2,
      data: {
        content: {
          selector: '.iprox-rich-content',
          how: 'html',
        },
      },
    },
  });

  const openingstijdenSanitized = sanitizeCmsContent(
    scrapeResult.data.openingstijden.content
  );

  cache.put(cacheKey, openingstijdenSanitized, AFVALPUNT_CACHE_TTL);

  return openingstijdenSanitized;
}

async function scrapeAfvalpuntGeoLocations() {
  const cacheKey = 'afvalpunten-geolcations';
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return cachedData as ScrapedGeoLocation[];
  }
  /**
   * First get the title, latlon and url for this Afvalpunt
   */
  const scrapeResult = await scrapeIt<{ items: ScrapedGeoLocation[] }>(
    'https://www.amsterdam.nl/adressengids/zoeken/?zoeken=true&Zoe_kenmerk_0_Clt_values=2727',
    {
      items: {
        listItem: '.pt-artikel',
        data: {
          title: '.link a',
          url: {
            selector: '.link a',
            attr: 'href',
          },
          latlng: {
            selector: '',
            attr: 'data-latlon',
            convert: data => {
              const [lng, lat] = data
                .split(' ')
                .map((l: string) => parseFloat(l));
              return {
                lat,
                lng,
              };
            },
          },
        },
      },
    }
  );

  cache.put(cacheKey, scrapeResult.data.items, AFVALPUNT_CACHE_TTL);

  return scrapeResult.data.items;
}

export async function scrapeGarbageCenterData(center: LatLngObject | null) {
  const afvalpuntGeoLocations = await scrapeAfvalpuntGeoLocations();

  const detailedItems = await Promise.all(
    afvalpuntGeoLocations.map(item => {
      return scrapeDetailInfo(item);
    })
  );

  const openingHours = await scrapeOpeningstijden(
    detailedItems[0].openingHours
  );

  const detailedItemsWithOpeningHours = detailedItems.map(detailedItem => {
    return Object.assign(detailedItem, { openingHours });
  });

  const garbageCenterData: GarbageCenter[] = detailedItemsWithOpeningHours.map(
    item => {
      return {
        ...item,
        distance: center ? getApproximateDistance(center, item.latlng) : 0,
      };
    }
  );

  return apiSuccesResult({
    centers: garbageCenterData.sort(sortAlpha('distance')),
    openingHours,
  });
}
