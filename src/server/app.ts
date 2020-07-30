import * as Sentry from '@sentry/node';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express, {
  ErrorRequestHandler,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';
import { ENV, getOtapEnvItem } from '../universal/config/env';
import { apiErrorResult } from '../universal/helpers';
import { BFF_BASE_PATH, BFF_PORT } from './config';
import {
  clearSession,
  exitEarly,
  secureValidation,
  sessionID,
} from './helpers/app';
import { routerCommercial } from './router-commercial';
import { routerCommon } from './router-common';
import { routerPrivate } from './router-private';

const isDebug = ENV === 'development';

const options: Sentry.NodeOptions = {
  dsn: getOtapEnvItem('bffSentryDsn'),
  environment: ENV,
  debug: isDebug,
};
Sentry.init(options);

const app = express();

app.set('trust proxy', true);
app.use(Sentry.Handlers.requestHandler() as RequestHandler);

app.use(cors());
app.use(bodyParser.json({ limit: '1mb' }));
app.use(compression());

// Basic security measure
app.use(exitEarly);
app.use(secureValidation);

// Generate session id
app.use(sessionID);

// Mount the routers at the base path
app.use(BFF_BASE_PATH, routerCommon);
// Private profiles
app.use(BFF_BASE_PATH, routerPrivate);
// Commercial profiles
app.use(BFF_BASE_PATH + '/commercial', routerCommercial);

// Destroy the session as soon as the api requests are all processed
app.use(clearSession);

app.use(Sentry.Handlers.errorHandler() as ErrorRequestHandler);

// Optional fallthrough error handler
app.use(function onError(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  // @ts-ignore
  const responseData = apiErrorResult(err.toString(), null, res.sentry);
  res.status(500).json(responseData);
});

app.use((req: Request, res: Response) => {
  res.end();
});

app.listen(BFF_PORT, () => {
  console.info(
    `Mijn Amsterdam BFF api listening on ${BFF_PORT}... [debug: ${isDebug}]`
  );
});
