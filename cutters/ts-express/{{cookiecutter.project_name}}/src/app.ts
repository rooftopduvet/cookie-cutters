import 'reflect-metadata';

import express, {
  Express, NextFunction, Request, Response,
} from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import * as bodyParser from 'body-parser';
import { logger, loggerMiddleware } from './log';
import { RequestError } from './errors';

import { register as registerHelloWorld } from './routes/helloWorld';

const openapiOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '{{cookiecutter.project_name}}',
      version: '0.1.0',
    },
  },
  apis: [
    './src/openapi.ts',
    './src/routes/*.ts',
  ],
};
const openapiSpec = swaggerJsdoc(openapiOptions);

export const app: Express = express();

app.use(helmet({
  referrerPolicy: { policy: 'no-referrer' },
}));

app.use(bodyParser.json());

app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(openapiSpec, { explorer: true }),
);

registerHelloWorld(app);

/**
 * ------------------------------------------------
 * Not Found
 * ------------------------------------------------
*/

app.use((req: Request, res: Response) => {
  res.status(404);
  res.json({
    errors: [
      {
        status: 404,
        title: 'Not Found',
      },
    ],
  });
});

/**
 * ------------------------------------------------
 * Error handling & Logs
 * ------------------------------------------------
*/

app.use(loggerMiddleware);

// eslint-disable-next-line no-unused-vars
app.use((err: RequestError, req: Request, res: Response, _next: NextFunction) => {
  // First log the error
  logger.error(`${err.status || 500} ${req.method} ${req.originalUrl} - ${err.message}`);

  if (err.title) {
    // If there's a title then this error has been intercepted so
    // we handle it differently.
    res.status(err.status);
    res.json({
      errors: [
        {
          status: err.status,
          title: err.title,
          detail: err.message,
        },
      ],
    });
  } else {
    // This error has come from elsewhere, so it needs sanitising.
    res.status(500);
    res.json({
      errors: [
        {
          status: 500,
          title: 'Server Error',
          detail: 'See error log for details',
        },
      ],
    });
  }
});
