import { Request, Response } from 'express';
import { AuthProfileAndToken, getAuth } from '../../helpers/app';
import { fetchDocument } from '../zorgned/zorgned-service';
import { fetchStadspasBudgetTransactionsWithVerify } from './stadspas';
import { StadspasBudget } from './stadspas-types';

export async function handleFetchTransactionsRequest(
  req: Request<{ transactionsKeyEncrypted: string }>,
  res: Response
) {
  const authProfileAndToken = await getAuth(req);

  const response = await fetchStadspasBudgetTransactionsWithVerify(
    res.locals.requestID,
    req.params.transactionsKeyEncrypted,
    req.query.budgetCode as StadspasBudget['code'],
    authProfileAndToken.profile.sid
  );

  if (response.status === 'ERROR') {
    res.status(typeof response.code === 'number' ? response.code : 500);
  }

  return res.send(response);
}

export async function fetchZorgnedAVDocument(
  requestID: requestID,
  authProfileAndToken: AuthProfileAndToken,
  documentId: string
) {
  const response = fetchDocument(
    requestID,
    authProfileAndToken,
    'ZORGNED_AV',
    documentId
  );
  return response;
}
