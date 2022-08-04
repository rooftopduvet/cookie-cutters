"""Simple routes for test purposes.

This module adds routes to the app for testing basic functionality
such as simple GET requests, error pages, and simple DB accesses.
"""

from sanic.blueprints import Blueprint
from sanic.response import json
from sanic.exceptions import NotFound
from sanic_openapi import openapi
import {{cookiecutter.module_name}}.exceptions as expns
from {{cookiecutter.module_name}}.utils import (
    get_offset_limit,
    make_pagination_links,
    jsonapi_response,
    ResponseDataType)
from {{cookiecutter.module_name}} import validate
import {{cookiecutter.module_name}}.db.repositories.greetings as greet_repo
from {{cookiecutter.module_name}}.log import app_logger
from {{cookiecutter.module_name}}.openapi import (
    jsonapi_item,
    jsonapi_list,
    JSONAPIErrorResponse,
)

# --------------------
# Models & Utils
# --------------------


class HelloWorldAttributes:
    message: str


class GreetingAttributes:
    name: str
    message: str


class NewGreetingBody:
    name: str


def make_greeting_msg(name: str):
    return f'Hello {name}!'

# --------------------
# Routes
# --------------------


blueprint = Blueprint('hello_world', '/hello_world')

# --------------------
# Simple functionality
# --------------------


@blueprint.route('/', methods=['GET'])
@openapi.summary('Show a simple greeting')
@openapi.description('Simple endpoint to test that things are working.')
@openapi.response(
    200,
    {"application/json": jsonapi_item(HelloWorldAttributes)},
)
async def hello_world(request):
    data = {'message': make_greeting_msg('World')}
    return json({'data': data})


@blueprint.route('/internal_error', methods=['GET'])
@openapi.summary('Internal error test')
@openapi.description("""Raises an internal error to
    make sure it is being correctly sanitised.""")
@openapi.response(
    500,
    {"application/json": JSONAPIErrorResponse},
)
async def internal_error(request):
    raise Exception('test')


@blueprint.route('/query_error', methods=['GET'])
@openapi.summary('Handled error test')
@openapi.description("""Raises a custom error to make sure it
    is being correctly sanitised.""")
@openapi.response(
    500,
    {"application/json": JSONAPIErrorResponse},
)
async def query_error(request):
    raise expns.QueryException('test')

# --------------------------------------
# Functionality involving DB interations
# --------------------------------------


@blueprint.route('/greetings', methods=['GET'])
@openapi.summary('List greetings')
@openapi.description("""Lists all greetings that have occurred""")
@openapi.response(
    200,
    {"application/json": jsonapi_list(GreetingAttributes)},
)
@openapi.parameter('offset', int, 'query')
@openapi.parameter('limit', int, 'query')
async def list_greetings(request):
    offset, limit = get_offset_limit(request)
    async with request.app.ctx.db.connect() as conn:
        try:
            items = await greet_repo.get_greetings(conn, offset, limit)
        except Exception as exp:
            app_logger.exception(exp)
            raise expns.DBException('Error fetching greetings.')

    url = request.url_for('hello_world.list_greetings')
    links = make_pagination_links(url, offset, limit)
    response_types = {
        'root': ResponseDataType('greetings', url)
    }
    response_items = [
        jsonapi_response(item, response_types) for item in items
    ]

    response = {
        'links': links,
        'data': response_items
    }
    return json(response)


@blueprint.route('/greetings', methods=['POST'])
@openapi.summary('Create greeting')
@openapi.description("""Creates a new greeting and saves it""")
@openapi.body({"application/json": NewGreetingBody})
@openapi.response(
    200,
    {"application/json": jsonapi_item(GreetingAttributes)},
)
async def new_greeting(request):
    name = request.json.get('name')
    if name is None:
        raise expns.BodyException('"name" arg not set')

    async with request.app.ctx.db.connect() as conn:
        try:
            greeting = await greet_repo.add_greeting(
                conn, name, make_greeting_msg(name))
        except Exception as exp:
            app_logger.exception(exp)
            raise expns.DBException('Error creating greeting.')

    url = request.url_for('hello_world.new_greeting')
    response_types = {
        'root': ResponseDataType('greetings', url)
    }
    return json(jsonapi_response(greeting, response_types))


@blueprint.route('/greetings/<greeting_id>', methods=['GET'])
@openapi.summary('Get greeting')
@openapi.description("""Get a specific greeting from earlier""")
@openapi.parameter('greeting_id', str, 'path')
@openapi.response(
    200,
    {"application/json": jsonapi_item(GreetingAttributes)},
)
@openapi.response(
    404,
    {"application/json": JSONAPIErrorResponse},
)
async def get_greeting(request, greeting_id):
    validate.validate_uuid(greeting_id, expns.URLException)
    print('ID:', greeting_id)
    async with request.app.ctx.db.connect() as conn:
        try:
            greeting = await greet_repo.get_greeting(conn, greeting_id)
        except Exception as exp:
            app_logger.exception(exp)
            raise expns.DBException('Error fetching greeting.')

    if greeting is None:
        raise NotFound(f'Greeting "{greeting_id}" does not exist')

    url = request.url_for('hello_world.list_greetings')
    response_types = {
        'root': ResponseDataType('greetings', url)
    }
    return json(jsonapi_response(greeting, response_types))
