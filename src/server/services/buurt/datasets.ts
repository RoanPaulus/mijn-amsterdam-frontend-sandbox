import themeColors from '@amsterdam/asc-ui/lib/theme/default/colors';
import Supercluster from 'supercluster';
import {
  DatasetCategoryId,
  DatasetId,
  DatasetPropertyFilter,
  DatasetPropertyName,
  DatasetPropertyValue,
  FeatureType,
} from '../../../universal/config/buurt';
import { DataRequestConfig } from '../../config';
import {
  createFeaturePropertiesFromPropertyFilterConfig,
  getApiEmbeddedResponse,
  getPropertyFilters,
  transformDsoApiListResponse,
} from './helpers';

enum zIndexPane {
  PARKEERZONES = '650',
  BEDRIJVENINVESTERINGSZONES = '651',
  PARKEERZONES_UITZONDERING = '660',
  HARDLOOPROUTE = '670',
  SPORTPARK = '680',
  SPORTVELD = '690',
}

export type DatasetFeatureProperties = {
  id: string;
  datasetId: DatasetId;
  color?: string;
  zIndex?: zIndexPane;
  [propertyName: string /*DatasetPropertyName*/]: DatasetPropertyValue | any;
};

export type DatasetClusterFeatureProperties = DatasetFeatureProperties & {
  cluster?: boolean;
  point_count?: number;
};
export type MaFeature<
  G extends GeoJSON.Geometry = Exclude<
    GeoJSON.Geometry,
    GeoJSON.GeometryCollection
  >
> = GeoJSON.Feature<G, DatasetFeatureProperties>;
export type MaPointFeature = MaFeature<GeoJSON.Point>;
export type MaPolylineFeature = MaFeature<
  GeoJSON.MultiPolygon | GeoJSON.MultiLineString
>;
export type DatasetFeatures = MaFeature[];
export type MaSuperClusterFeature =
  | Supercluster.PointFeature<DatasetClusterFeatureProperties>
  | Supercluster.ClusterFeature<DatasetClusterFeatureProperties>;

export type DatasetResponse = {
  features: DatasetFeatures;
  filters?: DatasetPropertyFilter;
};

export const BUURT_CACHE_TTL_HOURS = 24;
export const BUURT_CACHE_TTL_1_DAY_IN_MINUTES = 24 * 60;
export const BUURT_CACHE_TTL_1_WEEK_IN_MINUTES =
  7 * BUURT_CACHE_TTL_1_DAY_IN_MINUTES;
export const ACCEPT_CRS_4326 = {
  'Accept-Crs': 'EPSG:4326', // Will return coordinates in [lng/lat] format
};
export const DEFAULT_API_REQUEST_TIMEOUT = 1000 * 60 * 3; // 3 mins

export interface DatasetConfig {
  datasetIds?: DatasetId[];
  listUrl?: string | ((config: DatasetConfig) => string);
  detailUrl?: string;
  transformList?: (
    datasetId: DatasetId,
    config: DatasetConfig,
    data: any
  ) => any;
  transformDetail?: (
    datasetId: DatasetId,
    config: DatasetConfig,
    data: any
  ) => any;
  requestConfig?: DataRequestConfig;
  cache?: boolean;
  cacheTimeMinutes?: number;
  featureType: FeatureType;
  zIndex?: zIndexPane;
  additionalStaticPropertyNames?: DatasetPropertyName[];
}

function dsoApiListUrl(dataset: string, pageSize: number = 1000) {
  const [datasetCategoryId, datasetId] = dataset.split('/');
  const apiUrl = `https://api.data.amsterdam.nl/v1/${datasetCategoryId}/${datasetId}/?_fields=id,geometry`;
  const pageSizeParam = `&page_size=${pageSize}`;

  return (datasetConfig: DatasetConfig) => {
    const propertyFilters = getPropertyFilters(datasetId);
    const propertyNames = propertyFilters ? Object.keys(propertyFilters) : [];

    if (datasetConfig.additionalStaticPropertyNames) {
      propertyNames.push(...datasetConfig.additionalStaticPropertyNames);
    }

    return (
      apiUrl +
      (propertyNames.length ? ',' + propertyNames.join(',') : '') +
      pageSizeParam
    );
  };
}

export const datasetEndpoints: Record<
  DatasetId | DatasetCategoryId,
  DatasetConfig
> = {
  afvalcontainers: {
    listUrl:
      'https://api.data.amsterdam.nl/v1/wfs/huishoudelijkafval/?SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAMES=container&OUTPUTFORMAT=geojson&SRSNAME=urn:ogc:def:crs:EPSG::4326&FILTER=%3CFilter%3E%3CAnd%3E%3CPropertyIsEqualTo%3E%3CPropertyName%3Estatus%3C/PropertyName%3E%3CLiteral%3E1%3C/Literal%3E%3C/PropertyIsEqualTo%3E%3COr%3E%3CPropertyIsEqualTo%3E%3CPropertyName%3Eeigenaar_id%3C/PropertyName%3E%3CLiteral%3E110%3C/Literal%3E%3C/PropertyIsEqualTo%3E%3CPropertyIsEqualTo%3E%3CPropertyName%3Eeigenaar_id%3C/PropertyName%3E%3CLiteral%3E16%3C/Literal%3E%3C/PropertyIsEqualTo%3E%3CPropertyIsEqualTo%3E%3CPropertyName%3Eeigenaar_id%3C/PropertyName%3E%3CLiteral%3E111%3C/Literal%3E%3C/PropertyIsEqualTo%3E%3CPropertyIsEqualTo%3E%3CPropertyName%3Eeigenaar_id%3C/PropertyName%3E%3CLiteral%3E112%3C/Literal%3E%3C/PropertyIsEqualTo%3E%3CPropertyIsEqualTo%3E%3CPropertyName%3Eeigenaar_id%3C/PropertyName%3E%3CLiteral%3E67%3C/Literal%3E%3C/PropertyIsEqualTo%3E%3CPropertyIsEqualTo%3E%3CPropertyName%3Eeigenaar_id%3C/PropertyName%3E%3CLiteral%3E181%3C/Literal%3E%3C/PropertyIsEqualTo%3E%3CPropertyIsEqualTo%3E%3CPropertyName%3Eeigenaar_id%3C/PropertyName%3E%3CLiteral%3E113%3C/Literal%3E%3C/PropertyIsEqualTo%3E%3C/Or%3E%3C/And%3E%3C/Filter%3E',
    detailUrl: 'https://api.data.amsterdam.nl/v1/huishoudelijkafval/container/',
    transformList: transformAfvalcontainersResponse,
    featureType: 'Point',
    cacheTimeMinutes: BUURT_CACHE_TTL_1_WEEK_IN_MINUTES,
  },
  evenementen: {
    listUrl: dsoApiListUrl('evenementen/evenementen'),
    detailUrl: 'https://api.data.amsterdam.nl/v1/evenementen/evenementen/',
    transformList: transformEvenementen,
    featureType: 'Point',
    cacheTimeMinutes: BUURT_CACHE_TTL_1_DAY_IN_MINUTES,
  },
  bekendmakingen: {
    listUrl: dsoApiListUrl('bekendmakingen/bekendmakingen', 10000),
    detailUrl:
      'https://api.data.amsterdam.nl/v1/bekendmakingen/bekendmakingen/',
    transformList: transformDsoApiListResponse,
    featureType: 'Point',
    cacheTimeMinutes: BUURT_CACHE_TTL_1_DAY_IN_MINUTES,
  },
  parkeerzones: {
    listUrl: dsoApiListUrl('parkeerzones/parkeerzones'),
    detailUrl: 'https://api.data.amsterdam.nl/v1/parkeerzones/parkeerzones/',
    transformList: transformParkeerzoneCoords,
    featureType: 'MultiPolygon',
    zIndex: zIndexPane.PARKEERZONES,
    additionalStaticPropertyNames: ['gebiedskleurcode'],
    cacheTimeMinutes: BUURT_CACHE_TTL_1_WEEK_IN_MINUTES,
  },
  parkeerzones_uitzondering: {
    listUrl: dsoApiListUrl('parkeerzones/parkeerzones_uitzondering'),
    detailUrl:
      'https://api.data.amsterdam.nl/v1/parkeerzones/parkeerzones_uitzondering/',
    transformList: transformParkeerzoneCoords,
    featureType: 'MultiPolygon',
    zIndex: zIndexPane.PARKEERZONES_UITZONDERING,
    cacheTimeMinutes: BUURT_CACHE_TTL_1_WEEK_IN_MINUTES,
  },
  zwembad: {
    listUrl: dsoApiListUrl('sport/zwembad'),
    detailUrl: 'https://api.data.amsterdam.nl/v1/sport/zwembad/',
    transformList: transformDsoApiListResponse,
    featureType: 'Point',
    cacheTimeMinutes: BUURT_CACHE_TTL_1_WEEK_IN_MINUTES,
  },
  sportpark: {
    listUrl: dsoApiListUrl('sport/sportpark'),
    detailUrl: 'https://api.data.amsterdam.nl/v1/sport/sportpark/',
    transformList: transformDsoApiListResponse,
    featureType: 'MultiPolygon',
    zIndex: zIndexPane.SPORTPARK,
    cacheTimeMinutes: BUURT_CACHE_TTL_1_WEEK_IN_MINUTES,
  },
  sportveld: {
    listUrl: dsoApiListUrl('sport/sportveld'),
    detailUrl: 'https://api.data.amsterdam.nl/v1/sport/sportveld/',
    transformList: transformDsoApiListResponse,
    featureType: 'MultiPolygon',
    zIndex: zIndexPane.SPORTVELD,
    cacheTimeMinutes: BUURT_CACHE_TTL_1_WEEK_IN_MINUTES,
  },
  gymsportzaal: {
    listUrl: dsoApiListUrl('sport/gymsportzaal'),
    detailUrl: 'https://api.data.amsterdam.nl/v1/sport/gymsportzaal/',
    transformList: transformDsoApiListResponse,
    featureType: 'Point',
    cacheTimeMinutes: BUURT_CACHE_TTL_1_WEEK_IN_MINUTES,
  },
  sporthal: {
    listUrl: dsoApiListUrl('sport/sporthal'),
    detailUrl: 'https://api.data.amsterdam.nl/v1/sport/sporthal/',
    transformList: transformDsoApiListResponse,
    featureType: 'Point',
    cacheTimeMinutes: BUURT_CACHE_TTL_1_WEEK_IN_MINUTES,
  },
  sportaanbieder: {
    listUrl: dsoApiListUrl('sport/sportaanbieder', 2000),
    detailUrl: 'https://api.data.amsterdam.nl/v1/sport/sportaanbieder/',
    transformList: transformDsoApiListResponse,
    featureType: 'Point',
    cacheTimeMinutes: BUURT_CACHE_TTL_1_WEEK_IN_MINUTES,
  },
  openbaresportplek: {
    listUrl: dsoApiListUrl('sport/openbaresportplek'),
    detailUrl: 'https://api.data.amsterdam.nl/v1/sport/openbaresportplek/',
    transformList: transformDsoApiListResponse,
    featureType: 'Point',
    cacheTimeMinutes: BUURT_CACHE_TTL_1_WEEK_IN_MINUTES,
  },
  hardlooproute: {
    listUrl: dsoApiListUrl('sport/hardlooproute'),
    detailUrl: 'https://api.data.amsterdam.nl/v1/sport/hardlooproute/',
    transformList: transformDsoApiListResponse,
    featureType: 'MultiLineString',
    zIndex: zIndexPane.HARDLOOPROUTE,
    cacheTimeMinutes: BUURT_CACHE_TTL_1_WEEK_IN_MINUTES,
  },
  bedrijveninvesteringszones: {
    listUrl: dsoApiListUrl(
      'bedrijveninvesteringszones/bedrijveninvesteringszones'
    ),
    detailUrl:
      'https://api.data.amsterdam.nl/v1/bedrijveninvesteringszones/bedrijveninvesteringszones/',
    transformList: transformDsoApiListResponse,
    featureType: 'MultiPolygon',
    zIndex: zIndexPane.BEDRIJVENINVESTERINGSZONES,
    cacheTimeMinutes: BUURT_CACHE_TTL_1_WEEK_IN_MINUTES,
  },
};

function createCustomFractieOmschrijving(featureProps: any) {
  if (featureProps.serienummer?.trim().startsWith('Kerstboom')) {
    return 'Kerstboom inzamellocatie';
  }
  return 'Overig';
}

function transformAfvalcontainersResponse(
  datasetId: DatasetId,
  config: DatasetConfig,
  responseData: any
) {
  const features = responseData?.features
    ? responseData?.features
    : getApiEmbeddedResponse(datasetId, responseData);
  return transformDsoApiListResponse(datasetId, config, {
    features: features.map((feature: any) => {
      const fractie_omschrijving =
        feature.properties.fractie_omschrijving ||
        createCustomFractieOmschrijving(feature.properties);

      return {
        ...feature,
        fractie_omschrijving,
      };
    }),
  });
}

function transformEvenementen(
  datasetId: DatasetId,
  config: DatasetConfig,
  responseData: any
) {
  const results = getApiEmbeddedResponse(datasetId, responseData);
  const collection: DatasetFeatures = [];
  if (results && results.length) {
    for (const feature of results) {
      if (feature?.geometry?.coordinates) {
        collection.push({
          type: 'Feature',
          geometry: feature.geometry,
          properties: createFeaturePropertiesFromPropertyFilterConfig(
            datasetId,
            {
              id: feature.id,
              datasetId,
            },
            feature
          ),
        });
      }
    }
  }
  return collection;
}

function transformParkeerzoneCoords(
  datasetId: DatasetId,
  config: DatasetConfig,
  responseData: any
) {
  const results =
    responseData?.features || getApiEmbeddedResponse(datasetId, responseData);
  const collection: DatasetFeatures = [];

  if (results && results.length) {
    for (const feature of results) {
      const featureTransformed: MaPolylineFeature = {
        type: 'Feature',
        geometry: feature.geometry,
        properties: createFeaturePropertiesFromPropertyFilterConfig(
          datasetId,
          {
            id: feature.id,
            datasetId,
          },
          feature
        ),
      };

      // Change gebiedsnaam for grouping purposes
      featureTransformed.properties.gebiedsnaam =
        featureTransformed.properties.gebiedsnaam?.split(' ')[0] || 'Amsterdam';

      const colors: Record<string, string> = {
        oost: themeColors.supplement.lightblue,
        west: themeColors.supplement.purple,
        noord: themeColors.support.focus,
        zuid: themeColors.supplement.orange,
        zuidoost: themeColors.supplement.lightgreen,
        'nieuw-west': themeColors.supplement.yellow,
        haven: themeColors.supplement.pink,
        centrum: themeColors.support.valid,
      };

      // Add custom color code
      featureTransformed.properties.color =
        colors[featureTransformed.properties.gebiedsnaam.toLowerCase()] ||
        'red';

      collection.push(featureTransformed);
    }
  }
  return collection;
}
