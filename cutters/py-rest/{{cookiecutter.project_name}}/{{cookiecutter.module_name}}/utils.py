import re
from collections import namedtuple
import {{cookiecutter.module_name}}.exceptions as expns


def get_offset_limit(request, page_size: int = 20,
                     limit_to_page_size: bool = True) -> tuple[int, int]:
    """Simple method to extract offset-limit args.

    Raises:
        SanicException: A 400 error is raised if
            - either offset/limit are not positive integers
            - offset is not a multiple of limit
            - offset/limit are not multiples of page_size
            (if limit_to_page_size=True)
    """
    offset = request.args.get('offset', 0)
    limit = request.args.get('limit', page_size)

    parse_exception = expns.QueryException(
        'Pagination arguments must be natural numbers')

    for arg in [offset, limit]:
        # First parse the arg and make sure it has integer form.
        # (We do this rather than just returning int(arg) because the
        # query string should be valid in the first place, so that urls in
        # the REST response match the requested address - which is important
        # for caching).
        _arg = arg
        if isinstance(_arg, str):
            if not re.match(r'^[0-9]+$', _arg):
                raise parse_exception
            else:
                _arg = int(arg)
        elif not isinstance(_arg, int):
            raise parse_exception

        # Then do the validations
        if _arg < 0:
            raise parse_exception

        if limit_to_page_size and _arg % page_size != 0:
            raise expns.QueryException(
                f'Pagination args must be a multiple of {page_size}')

    offset = int(offset)
    limit = int(limit)
    if offset % limit != 0:
        raise expns.QueryException(
            'Offset must be a multiple of limit.')

    return offset, limit


def make_pagination_links(url, offset: int = 0, page_size: int = 20,
                          count: int = None) -> dict[str]:
    """Makes pagination links for a jsonapi response.

    Notes:
        This method assumes that offset is a natural multiple of
        page_size, so that the smallest offset is 0.
    """
    links = {
        'self': f'{url}?offset={offset}&limit={page_size}'
    }

    if offset != 0:
        links['prev'] = f'{url}?offset={offset - page_size}&limit={page_size}'
    if count is not None:
        if (offset + page_size) < count:
            links['next'] = f'{url}?offset={offset + page_size}&limit={page_size}'
        links['first'] = f'{url}?offset=0&limit={page_size}'
        last_offset = int(count / page_size) * page_size
        links['last'] = f'{url}?offset={last_offset}&limit={page_size}'
    else:
        links['next'] = f'{url}?offset={offset + page_size}&limit={page_size}'

    return links


ResponseDataType = namedtuple('ResponseDataType', ['type', 'collection_url'])


def jsonapi_response(data: dict,
                     data_types: dict[ResponseDataType]) -> dict:
    """Takes a (nested) dictionary and turns it into a jsonapi response.

    Args:
        data:
            The dict to transform into a response
        data_types:
            A dict of ResponseDataType explaining how nested objects
            can be transformed, and links generated.
            The root type should be listed as 'root'.
    Returns:
        A jsonapi response

    Notes:
        The function runs recursively on nested dicts and arrays. If
        the function encounters a nested dict whose key is not listed
        in 'data_types', or if the dict does not have an id, then
        the recursion will stop, and all further nested objects will
        be returned as is.

    Examples:
        Given data like so:
        {
            'id': 123,
            'name': 'Alice',
            'color': { 'r': 10, 'g':, 10, 'b':, 10 },
            'town': {
                'id': 456,
                'name': 'Funville',
                'prefecture': 'Shinyland',
            },
            'pets': [
                { 'id': 678, 'species': 'dog' },
                { 'id': 789, 'species': 'cat' },
            ]
        }

        And with the following data_types:
        {
            root: ResponseDataType('people', 'example.com/people'),
            town: ResponseDataType('towns', 'example.com/towns'),
            pets: ResponseDataType('pets', 'example.com/pets'),
        }

        We would get the following response:
        {
            'links': {
                'self': 'example.com/people/123',
            },
            'data': {
                'id': 123,
                'type': 'people',
                'attributes': {
                    'name': 'Alice',
                    'color': { 'r': 10, 'g':, 10, 'b':, 10 },
                },
                'relationships': {
                    'town': {
                        'links': {
                            'self': 'example.com/towns/456',
                        },
                        'data': {
                            'id': 456,
                            'type': 'towns',
                            'attributes': {
                                'name': 'Funville',
                                'prefecture': 'Shinyland',
                            }
                        }
                    },
                    'pets': {
                        'links': {
                            'self': 'example.com/pets',
                        },
                        'data': [...]
                    }
                }
            }
        }
    """
    resp = {'data': {}}

    id = data.get('id')
    data_type = data_types.get('root')
    if id is not None:
        id = str(id)
        resp['data']['id'] = id
    else:
        # This is not a SanicExeption. Code should not be merged
        # into production that causes this problem.
        raise Exception("All API entities should have IDs")
    if data_type is not None:
        resp['data']['type'] = data_type.type
        resp['links'] = {}
        resp['links']['self'] = f'{data_type.collection_url}/{id}'

    # First we triage the data dict items into
    # their respective lists.
    attributes = {}
    singular_relationships = {}
    list_relationships = {}
    for item_key, item_val in data.items():
        if item_key == 'id':
            continue
        elif isinstance(item_val, dict):
            if item_key not in data_types:
                attributes[item_key] = item_val
            else:
                singular_relationships[item_key] = item_val
        elif isinstance(item_val, list):
            if (len(item_val) == 0 or
                    item_key not in data_types):
                attributes[item_key] = item_val
            else:
                list_relationships[item_key] = item_val
        elif not (isinstance(item_val, int) or
                  isinstance(item_val, float) or
                  isinstance(item_val, bool)):
            attributes[item_key] = str(item_val)
        else:
            attributes[item_key] = item_val

    # Then we add each item type into the response, running
    # the function recursively on nested elements.
    if len(attributes) > 0:
        resp['data']['attributes'] = attributes
    if (len(singular_relationships) > 0 or
            len(list_relationships) > 0):
        resp['data']['relationships'] = {}
    for rel_key, rel_val in singular_relationships.items():
        data_types['root'] = data_types[rel_key]
        resp['data']['relationships'][rel_key] = jsonapi_response(rel_val, data_types)
    for rel_key, rel_vals in list_relationships.items():
        data_types['root'] = data_types[rel_key]
        list_rel = {
            'links': {
                'self': data_types[rel_key].collection_url,
            },
            'data': [
                jsonapi_response(rel_val, data_types)
                for rel_val in rel_vals
            ]
        }
        resp['data']['relationships'][rel_key] = list_rel

    return resp
