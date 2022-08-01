import {
  Express,
  NextFunction,
  Request,
  Response,
} from 'express';
import validate from 'validator';
import { InvalidUsage, NotFound } from '../errors';
import {
  getOffsetLimit,
  jsonapiResponse,
  makePaginationLinks,
  assertArgs,
} from '../utils';
import { HelloWorldRepository } from '../db/repositories/HelloWorld';

const endpoint: string = '/hello_world';

export function register(app: Express) {
  /** GreetingResponse
   * @openapi
   * components:
   *  schemas:
   *    GreetingResponse:
   *      allOf:
   *        - $ref: '#/components/schemas/JSONAPIResponse'
   *        - type: object
   *          properties:
   *            data:
   *              type: object
   *              properties:
   *                attributes:
   *                  allOf:
   *                    - $ref: '#/components/schemas/BaseAttributes'
   *                    - type: object
   *                      properties:
   *                        name:
   *                          type: string
   *                        message:
   *                          type: string
   *            links:
   *              - $ref: '#/components/schemas/JSONAPILinks'
   *
  */

  /**
   * @openapi
   * /hello_world:
   *  get:
   *    summary: Hello World
   *    description: >
   *      Simple endpoint to return a message
   *    responses:
   *      200:
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                data:
   *                  type: object
   *                  properties:
   *                    message: string
   *                links:
   *                  $ref: '#/components/schemas/JSONAPILinks'
  */
  app.get(`${endpoint}/`, (req: Request, res: Response) => {
    const resp = {
      data: {
        message: 'Hello World!',
      },
      links: {
        self: req.url,
      },
    };

    res.json(resp);
  });

  /**
   * @openapi
   * /hello_world/internal_error:
   *  get:
   *    summary: Error Test
   *    description: >
   *      Simple endpoint to test that internal errors are sanitised
   *    responses:
   *      500:
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/JSONAPIErrorResponse'
  */
  app.get(
    `${endpoint}/internal_error`,
    (_req: Request, _res: Response, next: NextFunction) => {
      next(new Error('Internal error'));
    },
  );

  /**
   * @openapi
   * /hello_world/custom_error:
   *  get:
   *    summary: Error Test
   *    description: >
   *      Simple endpoint to test that custom errors are sanitised
   *    responses:
   *      4XX:
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/JSONAPIErrorResponse'
  */
  app.get(
    `${endpoint}/custom_error`,
    (_req: Request, _res: Response, next: NextFunction) => {
      next(new InvalidUsage('Invalid usage error'));
    },
  );

  /**
   * @openapi
   * /hello_world/greetings:
   *  get:
   *    summary: Greetings
   *    description: >
   *      List all saved greetings
   *    parameters:
   *      - in: query
   *        name: offset
   *        schema:
   *          type: integer
   *        required: false
   *      - in: query
   *        name: limit
   *        schema:
   *          type: integer
   *        required: false
   *    responses:
   *      200:
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                data:
   *                  type: array
   *                  items:
   *                    $ref: '#/components/schemas/GreetingResponse'
   *                links:
   *                  $ref: '#/components/schemas/JSONAPILinks'
   *      400:
   *        description: >
   *          Offset/limit args are bad
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/JSONAPIErrorResponse'
  */
  app.get(
    `${endpoint}/greetings`,
    async (req: Request, res: Response, next: NextFunction) => {
      let offset: number;
      let limit: number;

      try {
        [offset, limit] = getOffsetLimit(req);
      } catch (err) {
        return next(err);
      }

      const repo = new HelloWorldRepository();
      const greetings = await repo.getGreetings(offset, limit);

      const responseTypes = {
        root: {
          type: 'Greetings',
          url: req.url,
        },
      };

      const response = {
        data: greetings.map((g) => jsonapiResponse(g, responseTypes)),
        links: makePaginationLinks(req.url, offset, limit),
      };

      return res.json(response);
    },
  );

  /**
   * @openapi
   * /hello_world/greetings:
   *  post:
   *    summary: Greetings
   *    description: >
   *      Create a new greeeting
   *    requestBody:
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              name:
   *                type: string
   *            required:
   *              - name
   *    responses:
   *      200:
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/GreetingResponse'
   *      404:
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/JSONAPIErrorResponse'
  */
  app.post(
    `${endpoint}/greetings`,
    async (req: Request, res: Response, next: NextFunction) => {
      assertArgs(req.body, ['name']);
      const { name } = req.body;
      if (!validate.isLength(name, { min: 1, max: 50 })) {
        return next(new InvalidUsage('Name should be between 1-50 characters.'));
      }

      const responseTypes = {
        root: {
          type: 'Greetings',
          url: req.baseUrl,
        },
      };

      const repo = new HelloWorldRepository();
      const greeting = await repo.addGreeting(name, `Hello ${name}!`);
      const response = jsonapiResponse(greeting, responseTypes);

      return res.json(response);
    },
  );

  /**
   * @openapi
   * /hello_world/greetings/{greetingId}:
   *  get:
   *    summary: Greetings
   *    description: >
   *      Get a specific greeting
   *    parameters:
   *      - in: path
   *        name: greetingId
   *        schema:
   *          type: string
   *        required: true
   *    responses:
   *      200:
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/GreetingResponse'
  */
  app.get(
    `${endpoint}/greetings/:greetingId`,
    async (req: Request, res: Response, next: NextFunction) => {
      const { greetingId } = req.params;

      if (!validate.isUUID(greetingId)) {
        return next(new InvalidUsage('greetingId must be a valid uuid'));
      }

      const repo = new HelloWorldRepository();
      const greeting = await repo.getGreeting(greetingId);

      if (!greeting) {
        return next(new NotFound('Greeting does not exist'));
      }

      const responseTypes = {
        root: {
          type: 'Greetings',
          url: req.url,
        },
      };

      const response = jsonapiResponse(greeting || {}, responseTypes);

      return res.json(response);
    },
  );
}
