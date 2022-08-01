import { Request } from 'express';
import { InvalidUsage } from './errors';
import {
  JSONAPIData,
  JSONAPILinks,
  JSONAPIResponse,
} from './openapi';

/**
 * Helper method to assert the presence of request arguments.
 *
 * @param paramsObj : An object to check (e.g. request.body)
 * @param argsList : The args that must be present (e.g. id)
 *
 * @throws {InvalidUsage}
 */
export function assertArgs(paramsObj: { [key: string]: any }, argsList: string[]) {
  argsList.forEach((arg) => {
    // eslint-disable-next-line no-prototype-builtins
    if (!paramsObj.hasOwnProperty(arg)) {
      throw new InvalidUsage(`Missing Arg: ${arg}`);
    }

    if (paramsObj[arg] === null || paramsObj[arg] === undefined) {
      throw new InvalidUsage(`Missing Arg: ${arg}`);
    }
  });
}

/**
 * Pulls offset-limit variables from a request and checks that they're
 * valid.
 *
 * @param req : An Express request object
 * @param pageSize : Number of items per page
 * @param limitToPageSize : Whether or not an error should be thrown
 *  if limit does not equal page size.
 * @returns {number[]}
 *
 * @throws {InvalidUsage}
 */
export function getOffsetLimit(
  req: Request,
  pageSize: number = 20,
  limitToPageSize: boolean = false,
): number[] {
  const offsetQuery = `${req.query.offset || 0}`;
  const limitQuery = `${req.query.limit || pageSize}`;

  const offset = parseInt(offsetQuery, 10);
  const limit = parseInt(limitQuery, 10);

  // First check that the passed parameters are integers
  if (
    Number.isNaN(offset)
    || Number.isNaN(limit)
    || `${offset}` !== offsetQuery
    || `${limit}` !== limitQuery
  ) {
    throw new InvalidUsage('Pagination params must be integers');
  }

  // Then check that offset and limit are sensible sizes w.r.t. one another.
  // i.e. That limit divides offset, and that they are positive, etc.
  if (limitToPageSize && limit !== pageSize) {
    throw new InvalidUsage(`Limit must be a multiple of ${pageSize}`);
  }
  if (offset < 0 || limit < 0) {
    throw new InvalidUsage('Offset and limit should be positive numbers');
  }
  if (offset % limit !== 0) {
    throw new InvalidUsage(`Offset should be a multiple of ${limit}`);
  }

  return [offset, limit];
}

/**
 * Given a base url and pagination info, it generates a set of
 * page link urls (self, prev, next, first, last, etc.)
 *
 * @param url : The base URL
 * @param offset : The current page offset
 * @param pageSize : The standard page size of the endpoint
 * @param count [o] : The total number of items.
 *
 * @returns {JSONAPILinks}
 */
export function makePaginationLinks(
  url: string,
  offset: number = 0,
  pageSize: number = 20,
  count: number | null = null,
): JSONAPILinks {
  const links: JSONAPILinks = {
    self: `${url}?offset=${offset}&limit=${pageSize}`,
  };

  if (offset !== 0) {
    links.prev = `${url}?offset=${offset - pageSize}&limit=${pageSize}`;
  }
  if (count) {
    if ((offset + pageSize) < count) {
      links.next = `${url}?offset=${offset + pageSize}&limit=${pageSize}`;
    }
    links.first = `${url}?offset=${0}&limit=${pageSize}`;
    const lastOffset = Math.floor(count / pageSize) * pageSize;
    links.last = `${url}?offset=${lastOffset}&limit=${pageSize}`;
  } else {
    links.next = `${url}?offset=${offset + pageSize}&limit=${pageSize}`;
  }

  return links;
}

export interface ResponseDataType {
  type: string,
  url: string,
}

/**
 * function: jsonapiResponse
 *
 * Takes a (nested) dictionary and turns it into a jsonapi response.
 *
 * @param data : The dict to transform into a response
 * @param data_types : A dict of ResponseDataType explaining how nested objects
 *  can be transformed, and links generated.
 *  The root type should be listed as 'root'.
 *
 * @returns : A jsonapi response
 *
 * Notes:
 *   The function runs recursively on nested dicts and arrays.If
 *   the function encounters a nested dict whose key is not listed
 *   in 'data_types', or if the dict does not have an id, then
 *   the recursion will stop, and all further nested objects will
 *   be returned as is.
 *
 *   Examples:
 *     Given data like so:
 *       {
 *         'id': 123,
 *           'name': 'Alice',
 *             'color': { 'r': 10, 'g':, 10, 'b':, 10 },
 *         'town': {
 *           'id': 456,
 *             'name': 'Funville',
 *               'prefecture': 'Shinyland',
 *               },
 *         'pets': [
 *           { 'id': 678, 'species': 'dog' },
 *           { 'id': 789, 'species': 'cat' },
 *         ]
 *       }
 *
 *     And with the following data_types:
 *       {
 *         root: ResponseDataType('people', 'example.com/people'),
 *           town: ResponseDataType('towns', 'example.com/towns'),
 *             pets: ResponseDataType('pets', 'example.com/pets'),
 *       }
 *
 *     We would get the following response:
 *       {
 *         'links': {
 *           'self': 'example.com/people/123',
 *               },
 *         'data': {
 *           'id': 123,
 *             'type': 'people',
 *               'attributes': {
 *             'name': 'Alice',
 *               'color': { 'r': 10, 'g':, 10, 'b':, 10 },
 *           },
 *           'relationships': {
 *             'town': {
 *               'links': {
 *                 'self': 'example.com/towns/456',
 *                           },
 *               'data': {
 *                 'id': 456,
 *                   'type': 'towns',
 *                     'attributes': {
 *                   'name': 'Funville',
 *                     'prefecture': 'Shinyland',
 *                               }
 *               }
 *             },
 *             'pets': {
 *               'links': {
 *                 'self': 'example.com/pets',
 *                           },
 *               'data': [...]
 *             }
 *           }
 *         }
 *       }
*/
export function jsonapiResponse(
  data: { [name: string]: any },
  dataTypes: { [name: string]: ResponseDataType },
): JSONAPIResponse {
  if (!data.id) {
    throw new Error('All API Response Entities should have IDs');
  }
  const id = `${data.id}`;
  const dataType: ResponseDataType = dataTypes.root;

  const responseData: JSONAPIData = {
    id,
    type: dataType.type,
    attributes: {},
  };

  const response: JSONAPIResponse = {
    data: responseData,
    links: {
      self: `${dataType.url}/${id}`,
    },
  };

  // First we triage the data dict items into
  // their respective lists.
  const attributes: { [name: string]: any } = {};
  const singularRelationships: { [name: string]: any } = {};
  const listRelationships: { [name: string]: any } = {};

  Object.keys(data).forEach((key) => {
    if (key === 'id') {
      return;
    }

    if (data[key] === undefined || data[key] === null) {
      return;
    }

    if (Array.isArray(data[key])) {
      if (data[key].length === 0 || !dataTypes[key]) {
        attributes[key] = data[key];
      } else {
        listRelationships[key] = data[key];
      }
    } else if (typeof data[key] === 'object') {
      if (!dataTypes[key]) {
        attributes[key] = data[key];
      } else {
        singularRelationships[key] = data[key];
      }
    } else if (!(typeof data[key] === 'number' || typeof data[key] === 'boolean')) {
      attributes[key] = data[key].toString();
    } else {
      attributes[key] = data[key];
    }
  });

  // Then we add each item type into the response, running
  // the function recursively on nested elements.
  if (Object.keys(attributes).length > 0) {
    responseData.attributes = attributes;
  }

  Object.keys(singularRelationships).forEach((key) => {
    const nextDataTypes: { [name: string]: ResponseDataType } = {
      ...dataTypes,
      root: dataTypes[key],
    };
    responseData.relationships = {
      ...responseData.relationships,
      [key]: (
        jsonapiResponse(singularRelationships[key], nextDataTypes)
      ),
    };
  });

  Object.keys(listRelationships).forEach((key) => {
    const nextDataTypes: { [name: string]: ResponseDataType } = {
      ...dataTypes,
      root: dataTypes[key],
    };
    const listResponses = (
      listRelationships[key].map((ldata: any) => (
        jsonapiResponse(ldata, nextDataTypes)
      ))
    );

    responseData.relationships = {
      ...responseData.relationships,
      [key]: {
        data: listResponses,
        links: {
          self: dataTypes[key].url,
        },
      },
    };
  });

  return response;
}
