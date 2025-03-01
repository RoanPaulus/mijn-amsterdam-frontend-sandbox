import { Request, Response } from 'express';

import { decosZaakTransformers } from './decos-zaken';
import { fetchVergunningV2 } from './vergunningen';
import { apiSuccessResult } from '../../../universal/helpers/api';
import { getAuth } from '../../auth/auth-helpers';
import { BffEndpoints } from '../../routing/bff-routes';
import {
  generateFullApiUrlBFF,
  sendUnauthorized,
} from '../../routing/route-helpers';
import {
  fetchDecosZaakFromSource,
  fetchDecosZakenFromSource,
} from '../decos/decos-service';
import { DecosZaakSource } from '../decos/decos-types';

export async function fetchVergunningDetail(req: Request, res: Response) {
  const authProfileAndToken = getAuth(req);
  if (authProfileAndToken) {
    const response = await fetchVergunningV2(
      res.locals.requestID,
      authProfileAndToken,
      req.params.id
    );

    return res.send(response);
  }
  return sendUnauthorized(res);
}

export async function fetchZakenFromSource(
  req: Request<{ id?: string }>,
  res: Response
) {
  const authProfileAndToken = getAuth(req);

  if (!authProfileAndToken) {
    return sendUnauthorized(res);
  }

  if (req.params.id) {
    const zaakResponse = await fetchDecosZaakFromSource(
      res.locals.requestID,
      req.params.id,
      true
    );
    if (zaakResponse.status === 'OK' && req.query.merge === 'true') {
      const zaak = zaakResponse.content as DecosZaakSource & {
        properties: Array<{
          field: string;
          value: unknown;
          description: string;
        }>;
      };
      const zaakMerged: Record<string, unknown> = {};
      for (const { field, description, value } of zaak.properties) {
        zaakMerged[`${field}_${description}`] = value;
      }
      return res.send(apiSuccessResult(zaakMerged));
    }
    return zaakResponse;
  }

  const zakenResponseData = await fetchDecosZakenFromSource(
    res.locals.requestID,
    authProfileAndToken,
    decosZaakTransformers
  );

  if (zakenResponseData.status === 'OK') {
    const links = [];
    for (const zaak of zakenResponseData.content) {
      const url = generateFullApiUrlBFF(
        BffEndpoints.VERGUNNINGENv2_ZAKEN_SOURCE,
        {
          id: zaak.key,
        }
      );
      links.push(`${url}`);
    }
    return res.send(apiSuccessResult(links));
  }
  return res.send(zakenResponseData);
}
