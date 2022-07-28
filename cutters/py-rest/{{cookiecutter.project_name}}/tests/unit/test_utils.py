import pytest
from collections import namedtuple
import {{cookiecutter.module_name}}.exceptions as expns

from {{cookiecutter.module_name}} import utils


class TestGetOffsetLimit:
    """Tests for get_offset_limit."""

    @pytest.mark.parametrize('offset, limit', [
        (0.0, 1),
        (1, 0.0),
        ('0.0', '1'),
        ('1', '0.0'),
    ])
    def test_rejects_floats(self, offset, limit):
        """Raises 400 error if floats are passed
        eitherer explicitly or as strings.
        """
        MockReq = namedtuple('MockReq', ['args'])
        req = MockReq({'offset': offset, 'limit': limit})
        with pytest.raises(expns.QueryException):
            utils.get_offset_limit(req, limit_to_page_size=False)

    def test_limit_must_divide_limit(self):
        """Raises 400 error if offset is not a multiple of limit.
        """
        MockReq = namedtuple('MockReq', ['args'])
        req = MockReq({'offset': 12, 'limit': 10})
        with pytest.raises(expns.QueryException):
            utils.get_offset_limit(req, limit_to_page_size=False)

    @pytest.mark.parametrize('offset, limit', [
        (20, 13),
        (15, 40),
    ])
    def test_page_size_restrictions(self, offset, limit):
        """Raises 400 error if either offset or limit are
        not multiples of page_size, when the option is set.
        """
        MockReq = namedtuple('MockReq', ['args'])
        req = MockReq({'offset': offset, 'limit': limit})
        with pytest.raises(expns.QueryException):
            utils.get_offset_limit(req, page_size=20, limit_to_page_size=True)

    @pytest.mark.parametrize('offset, limit', [
        (40, 20),
        ('40', '20'),
    ])
    def test_correct_inputs(self, offset, limit):
        """Behaves as expected with correct inputs."""
        MockReq = namedtuple('MockReq', ['args'])
        req = MockReq({'offset': offset, 'limit': limit})
        res = utils.get_offset_limit(req, limit_to_page_size=False)
        assert res[0] == 40
        assert res[1] == 20

    @pytest.mark.parametrize('offset, limit', [
        (40, 20),
        ('40', '20'),
    ])
    def test_correct_inputs_w_page_restrictions(self, offset, limit):
        """Behaves as expected with correct inputs with
        page_size restriction.
        """
        MockReq = namedtuple('MockReq', ['args'])
        req = MockReq({'offset': offset, 'limit': limit})
        res = utils.get_offset_limit(req, page_size=10, limit_to_page_size=True)
        assert res[0] == 40
        assert res[1] == 20


class TestMakePaginationLinks:
    """Tests for make_pagination_links."""

    def test_without_count(self):
        """Only self, prev, and next pages should appear when no count
        is specified.
        """
        links = utils.make_pagination_links('test.com', 40, page_size=20)
        assert 'first' not in links
        assert 'last' not in links
        assert links['self'] == 'test.com?offset=40&limit=20'
        assert links['prev'] == 'test.com?offset=20&limit=20'
        assert links['next'] == 'test.com?offset=60&limit=20'

    def test_first_page(self):
        """First page should have no prev page."""
        links = utils.make_pagination_links('test.com', 0, page_size=20)
        assert 'prev' not in links

    def test_last_page(self):
        """Last page should have no next page."""
        links = utils.make_pagination_links(
            'test.com', 20, page_size=20, count=22)
        assert 'next' not in links

    def test_with_count(self):
        """First and last pages should appear count is specified."""
        links = utils.make_pagination_links(
            'test.com', 20, page_size=20, count=64)
        assert links['first'] == 'test.com?offset=0&limit=20'
        assert links['last'] == 'test.com?offset=60&limit=20'


class TestJsonapiResponse:
    """Tests for jsonapi_response"""

    def test_no_id(self):
        """All data being passed as root to this method
        should hae an id.
        """
        with pytest.raises(Exception) as exception:
            utils.jsonapi_response({}, {})

    def test_only_id(self):
        """Empty data_dict should return just
            { 'data': { 'id': <id> } }.
        """
        res = utils.jsonapi_response({'id': 'a'}, {})
        assert 'links' not in res
        assert len(res['data']) == 1
        assert res['data']['id'] == 'a'

    def test_root_data_type(self):
        """If data_types['root'] is defined, there should be a
        self link, and a type item in the data.
        """
        data_types = {
            'root': utils.ResponseDataType('tests', '/tests')
        }
        res = utils.jsonapi_response({'id': 'a'}, data_types)
        assert len(res['links']) == 1
        assert res['links']['self'] == '/tests/a'
        assert res['data']['type'] == 'tests'

    def test_primitive_attributes(self):
        """Attributes which are neither list or dict should
        be copied as is.
        """
        data_types = {
            'root': utils.ResponseDataType('tests', '/tests')
        }
        data = {
            'id': 'a',
            'name': 'bob',
            'age': 20,
        }
        res = utils.jsonapi_response(data, data_types)
        assert len(res['data']['attributes']) == 2
        assert res['data']['attributes']['name'] == 'bob'
        assert res['data']['attributes']['age'] == 20

    def test_list_attribute_no_data_type(self):
        """List attributes will be copied as is if they
        are not specified in the data-types section.

        'As is' means that no nested data will be transformed
        too.
        """
        data_types = {
            'root': utils.ResponseDataType('tests', '/tests'),
            'nested': utils.ResponseDataType('nested', '/nested'),
        }
        data = {
            'id': 'a',
            'list': [
                {
                    'id': 'b',
                    'nested': {'id': 'c'}
                },
            ],
        }
        res = utils.jsonapi_response(data, data_types)
        assert len(res['data']['attributes']) == 1
        assert 'data' not in res['data']['attributes']['list'][0]
        res_list = res['data']['attributes']['list']
        assert 'nested' in res_list[0]
        assert 'data' not in res_list[0]['nested']
        assert 'relationships' not in res['data']

    def test_list_attributes_processed_recursively(self):
        """List attributes should be processed recursively
        as 'relationships' if they have their data type is
        specified.
        """
        data_types = {
            'root': utils.ResponseDataType('tests', '/tests'),
            'list': utils.ResponseDataType('nested', '/nested'),
        }
        data = {
            'id': 'a',
            'list': [
                {
                    'id': 'b',
                    'name': 'alice',
                },
            ],
        }
        res = utils.jsonapi_response(data, data_types)
        assert 'attributes' not in res['data']
        assert len(res['data']['relationships']) == 1
        assert 'list' in res['data']['relationships']
        res_list = res['data']['relationships']['list']
        assert len(res_list['links']) == 1
        assert res_list['links']['self'] == '/nested'
        assert len(res_list['data']) == 1
        res_list_0 = res_list['data'][0]
        assert len(res_list_0['links']) == 1
        assert res_list_0['links']['self'] == '/nested/b'
        assert res_list_0['data']['id'] == 'b'
        assert res_list_0['data']['type'] == 'nested'
        assert len(res_list_0['data']['attributes']) == 1
        assert res_list_0['data']['attributes']['name'] == 'alice'

    def test_dict_attribute_no_data_type(self):
        """Dict attributes will be copied as is if they
        are not specified in the data-types section.

        'As is' means that no nested data will be transformed
        too.
        """
        data_types = {
            'root': utils.ResponseDataType('tests', '/tests'),
            'nested': utils.ResponseDataType('nested', '/nested'),
        }
        data = {
            'id': 'a',
            'dict': {
                'id': 'b',
                'nested': {'id': 'c'},
            },
        }
        res = utils.jsonapi_response(data, data_types)
        assert len(res['data']['attributes']) == 1
        res_dict = res['data']['attributes']['dict']
        assert 'data' not in res_dict
        assert 'nested' in res_dict
        assert 'data' not in res_dict['nested']
        assert 'relationships' not in res['data']

    def test_dict_attributes_processed_recursively(self):
        """Dict attributes should be processed recursively
        as 'relationships' if they have their data type is
        specified.
        """
        data_types = {
            'root': utils.ResponseDataType('tests', '/tests'),
            'dict': utils.ResponseDataType('nested', '/nested'),
        }
        data = {
            'id': 'a',
            'dict': {
                'id': 'b',
                'name': 'alice',
            },
        }
        res = utils.jsonapi_response(data, data_types)
        assert 'attributes' not in res['data']
        assert len(res['data']['relationships']) == 1
        assert 'dict' in res['data']['relationships']
        res_dict = res['data']['relationships']['dict']
        assert len(res_dict['links']) == 1
        assert res_dict['links']['self'] == '/nested/b'
        assert res_dict['data']['id'] == 'b'
        assert res_dict['data']['type'] == 'nested'
        assert len(res_dict['data']['attributes']) == 1
        assert res_dict['data']['attributes']['name'] == 'alice'
