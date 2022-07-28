import pytest
import {{cookiecutter.module_name}}.exceptions as expns
import uuid
import json


@pytest.mark.asyncio
async def test_hello_world(rest_api):
    """Simplest test for functionality."""
    _, resp = await rest_api.get('/hello_world')
    assert resp.status_code == 200
    assert resp.json['data']['message'] == 'Hello World!'


@pytest.mark.asyncio
async def test_not_found(rest_api):
    """Missing endpoints should return 404."""
    _, resp = await rest_api.get('/not_found')
    assert resp.status_code == 404
    resp_data = resp.json['errors'][0]
    assert resp_data['status'] == 404


class TestErrors:
    @pytest.mark.asyncio
    async def test_internal_error(self, rest_api, mocker):
        """Ensure that internal errors are sanitised.

        The original error message should be passed to the error log.
        """
        log_mock = mocker.patch('{{cookiecutter.module_name}}.log.app_logger.exception')
        _, resp = await rest_api.get('/hello_world/internal_error')

        log_mock.assert_called()
        logged_exception = log_mock.call_args[0][0]
        assert isinstance(logged_exception, Exception)
        assert str(logged_exception) == 'test'

        assert resp.status_code == 500
        resp_data = resp.json['errors'][0]
        assert 'test' not in resp_data['detail']

    @pytest.mark.asyncio
    async def test_query_error(self, rest_api):
        """Ensure that query errors are communicated to the requestor
        as expected.
        """
        _, resp = await rest_api.get('/hello_world/query_error')
        assert resp.status_code == 400
        resp_data = resp.json['errors'][0]

        qe = expns.QueryException('query error')
        assert resp_data['title'] == qe.title
        assert resp_data['detail'] == 'test'


@pytest.fixture(scope='module')
def db_results():
    results = {}
    return results


class TestGreetings:
    @pytest.mark.asyncio
    async def test_empty_table(self, rest_api, fresh_db):
        """Before anything greetings have been created
        the list endpoint should return a standard empty
        response.
        """
        _, resp = await rest_api.get('/hello_world/greetings')
        assert resp.status_code == 200
        body = resp.json
        assert isinstance(body['data'], list)
        assert len(body['data']) == 0
        self_link = '/hello_world/greetings?offset=0&limit=20'
        assert self_link in body['links']['self']

    @pytest.mark.asyncio
    async def test_nonexisting_greeting(self, rest_api, continued_db):
        """Non-Existent greetings should return a 404
        """
        id = uuid.uuid4()
        _, resp = await rest_api.get(f'/hello_world/greetings/{id}')
        assert resp.status_code == 404

    @pytest.mark.asyncio
    async def test_new_greeting(self, rest_api, continued_db, db_results):
        """It should be possible to POST a new greeting"""
        body = {'name': 'Bob'}
        _, resp = await rest_api.post(
            '/hello_world/greetings',
            content=json.dumps(body),
            headers={
                'content_type': 'application/json',
            }
        )
        assert resp.status_code == 200
        resp_data = resp.json['data']
        new_id = resp_data['id']
        db_results['test_new_greeting'] = {}
        db_results['test_new_greeting']['id'] = new_id
        assert resp_data['type'] == 'greetings'
        assert resp_data['attributes']['name'] == 'Bob'
        assert resp_data['attributes']['message'] == 'Hello Bob!'
        assert f'/hello_world/greetings/{new_id}' in resp.json['links']['self']

    @pytest.mark.asyncio
    async def test_get_greeting(self, rest_api, continued_db, db_results):
        """Test that we can get the greeting we just created"""
        new_id = db_results['test_new_greeting']['id']
        _, resp = await rest_api.get(
            f'/hello_world/greetings/{new_id}')
        assert resp.status_code == 200
        resp_data = resp.json['data']
        assert resp_data['type'] == 'greetings'
        assert resp_data['attributes']['name'] == 'Bob'
        assert resp_data['attributes']['message'] == 'Hello Bob!'
        assert f'/hello_world/greetings/{new_id}' in resp.json['links']['self']

    @pytest.mark.asyncio
    async def test_list_created_greetings(self, rest_api,
                                          continued_db, db_results):
        """Test that listing greetings gives us the one we created"""
        new_id = db_results['test_new_greeting']['id']
        _, resp = await rest_api.get('/hello_world/greetings')
        assert resp.status_code == 200
        resp_data = resp.json['data']
        assert len(resp_data) == 1
        assert resp_data[0]['data']['id'] == new_id
