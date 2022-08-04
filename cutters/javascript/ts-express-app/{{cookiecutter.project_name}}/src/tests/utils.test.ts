/* eslint-disable no-prototype-builtins */
import {
  getOffsetLimit,
  jsonapiResponse,
  makePaginationLinks,
  assertArgs,
  ResponseDataType,
} from '../utils';
import {
  JSONAPIData,
  JSONAPIResponse,
} from '../openapi';
import { InvalidUsage } from '../errors';

describe('assertArgs', () => {
  it('throws errors when args are missing', () => {
    expect(() => assertArgs({}, ['name'])).toThrow(InvalidUsage);
  });

  it('throws errors when args are defined but null', () => {
    expect(() => assertArgs({ name: null }, ['name'])).toThrow(InvalidUsage);
    expect(() => assertArgs({ name: undefined }, ['name'])).toThrow(InvalidUsage);
  });

  it('does not throw when args are present', () => {
    expect(() => assertArgs({ name: 'test' }, ['name'])).not.toThrow();
  });
});

describe('getOffsetLimit', () => {
  it('does not raise any errors for default args', () => {
    const req = { query: {} } as any;
    expect(() => getOffsetLimit(req)).not.toThrowError(InvalidUsage);
    const [offset, limit] = getOffsetLimit(req);
    expect(offset).toBe(0);
    expect(limit).toBe(20);
  });

  [
    { offset: 0.1, limit: 1 },
    { offset: 1, limit: 0.1 },
    { offset: '0.0', limit: '1' },
    { offset: '1', limit: '0.0' },
  ].forEach(({ offset, limit }) => {
    it(`raises an error if floats are passed in: ${offset} ${limit}`, () => {
      const req = { query: { offset, limit } } as any;
      expect(() => getOffsetLimit(req)).toThrowError(InvalidUsage);
    });
  });

  it('raises an error if offset is not divisible by limit', () => {
    const req = { query: { offset: 2, limit: 10 } } as any;
    expect(() => getOffsetLimit(req)).toThrowError(InvalidUsage);
  });

  it('raises an error if params are not divisible by pageSize', () => {
    const req = { query: { offset: 20, limit: 40 } } as any;
    expect(() => getOffsetLimit(req, 10, true)).toThrowError(InvalidUsage);
  });

  [
    { offset: -20, limit: 20 },
    { offset: 10, limit: -10 },
  ].forEach(({ offset, limit }) => {
    it(`raises an error if negative numbers are givven: ${offset} ${limit}`, () => {
      const req = { query: { offset, limit } } as any;
      expect(() => getOffsetLimit(req)).toThrowError(InvalidUsage);
    });
  });

  it('behaves as expected with correct inputs', () => {
    const req = { query: { offset: 40, limit: 20 } } as any;
    const [offset, limit] = getOffsetLimit(req);
    expect(offset).toBe(40);
    expect(limit).toBe(20);
  });

  it('behaves as expected with pageSize restrictions', () => {
    const req = { query: { offset: 40, limit: 10 } } as any;
    const [offset, limit] = getOffsetLimit(req, 10, true);
    expect(offset).toBe(40);
    expect(limit).toBe(10);
  });
});

describe('makePaginationLinks', () => {
  it(`makes only self, prev, and next pages should appear
    when no count is specified.`, () => {
    const links = makePaginationLinks('test.com', 40, 20);
    expect(links.first).toBeUndefined();
    expect(links.last).toBeUndefined();
    expect(links.self).toBe('test.com?offset=40&limit=20');
    expect(links.prev).toBe('test.com?offset=20&limit=20');
    expect(links.next).toBe('test.com?offset=60&limit=20');
  });

  it('makes no prev page when offset is 0', () => {
    const links = makePaginationLinks('test.com', 0, 20);
    expect(links.prev).toBeUndefined();
  });

  it('makes no next page when count is within range of offset', () => {
    const links = makePaginationLinks('test.com', 20, 20, 24);
    expect(links.next).toBeUndefined();
  });

  it('only renders first and last pages if count is specified', () => {
    const links = makePaginationLinks('test.com', 20, 20, 24);
    expect(links.first).toBe('test.com?offset=0&limit=20');
    expect(links.last).toBe('test.com?offset=20&limit=20');
  });
});

describe('jsonapiResponse', () => {
  const rootType: ResponseDataType = {
    type: 'test',
    url: '/test',
  };

  it('throws an error if id isn\'t in the data given', () => {
    const dataTypes = { root: rootType };
    expect(() => jsonapiResponse({}, dataTypes)).toThrow();
  });

  it('throws an error if "root" isn\'t in the dataTypes', () => {
    expect(() => jsonapiResponse({ id: '123' }, {})).toThrow();
  });

  it('returns a valid self link and data type', () => {
    const resp = jsonapiResponse({ id: '123' }, { root: rootType });
    expect(resp.links.self).toBe('/test/123');

    const respData = resp.data as JSONAPIData;
    expect(respData.id).toBe('123');
    expect(respData.type).toBe('test');
  });

  it(`copies primitive attributes as is when they're not
    marked as a data type`, () => {
    const data = {
      id: '123',
      string: 'test',
      array: ['test'],
      obj: { id: 'test' },
      number: 123,
      boolean: true,
    };

    const resp = jsonapiResponse(data, { root: rootType });
    const respData = resp.data as JSONAPIData;

    expect(respData.attributes.id).toBeUndefined();
    expect(respData.attributes.string).toBe('test');
    expect(respData.attributes.array).toEqual(['test']);
    expect(respData.attributes.obj).toEqual({ id: 'test' });
    expect(respData.attributes.number).toBe(123);
    expect(respData.attributes.boolean).toBe(true);
  });

  it('does not copy undefined or null values', () => {
    const data = {
      id: '123',
      name: 'bob',
      null: null,
      undefined,
    };

    const resp = jsonapiResponse(data, { root: rootType });
    const respData = resp.data as JSONAPIData;

    expect(respData.attributes.id).toBeUndefined();
    expect(respData.attributes.hasOwnProperty('null')).toBeFalsy();
    expect(respData.attributes.hasOwnProperty('undefined')).toBeFalsy();
  });

  it('processes nested objects recursively', () => {
    const data = {
      id: '123',
      nested: {
        id: '234',
      },
    };

    const dataTypes = {
      root: rootType,
      nested: {
        type: 'nested',
        url: '/nested',
      },
    };

    const resp = jsonapiResponse(data, dataTypes);
    const respData = resp.data as JSONAPIData;
    const rels = respData.relationships || {};

    expect(rels.nested.links.self).toBe('/nested/234');
  });

  it('processes nested arrays recursively', () => {
    const data = {
      id: '123',
      nested: [
        {
          id: '234',
        },
      ],
    };

    const dataTypes = {
      root: rootType,
      nested: {
        type: 'nested',
        url: '/nested',
      },
    };

    const resp = jsonapiResponse(data, dataTypes);
    const respData = resp.data as JSONAPIData;
    const rels = respData.relationships || {};

    expect(rels.nested.links.self).toBe('/nested');
    expect(Array.isArray(rels.nested.data)).toBeTruthy();

    const nestedData = rels.nested.data as JSONAPIResponse[];
    expect(nestedData[0].links.self).toBe('/nested/234');
  });
});
