import os
from sanic import Sanic
from sanic.response import json
from {{cookiecutter.module_name}}.db import env as dbenv
from sqlalchemy.ext.asyncio import create_async_engine
from sanic_openapi import openapi, openapi3_blueprint
from textwrap import dedent
from {{cookiecutter.module_name}}.exceptions import CustomException
from {{cookiecutter.module_name}}.log import app_logger
from {{cookiecutter.module_name}}.blueprints.hello_world import blueprint as hello_world

DEBUG_ENV = 'development'
IS_DEBUG = os.getenv('PYTHON_ENV', DEBUG_ENV) is DEBUG_ENV

app = Sanic('{{cookiecutter.project_name}}')
app.blueprint(openapi3_blueprint)

# -------------------------------------------
# API Docs setup (docs can be found at /docs)
# -------------------------------------------

app.config.API_VERSION = '0.1.0'
app.config.API_TITLE = 'API Title'
app.config.API_DESCRIPTION = dedent(
    """
    # Info
    Put API description here.

    **MARKDOWN** is supported.
    """
)

# app.ext.openapi.add_security_scheme(
#     "token",
#     "http",
#     scheme="bearer",
#     bearer_format="JWT",
# )

# -------------------------------------------
# Exception Handlers
# -------------------------------------------


@app.exception(CustomException)
async def intercepted_exceptions(request, exception):
    resp = {
        'errors': [
            {
                'status': exception.status_code,
                'title': exception.title,
                'detail': str(exception),
            }
        ]
    }
    return json(resp, status=exception.status_code)


@app.exception(Exception)
async def exception_handler(request, exception):
    # Exceptions coming here mean that we've failed to catch them.
    # So we log them, and then return a sanitised message to the
    # original requestor.
    status = 500
    title = 'Server Error'
    detail = 'See log for details'
    if hasattr(exception, 'status_code'):
        status = exception.status_code
        if status < 500:
            detail = exception.message

    app_logger.exception(exception)
    resp = {
        'errors': [
            {
                'status': status,
                'title': title,
                'detail': detail,
            }
        ]
    }
    return json(resp, status=status)

# -------------------------------------------
# Add all routes
# -------------------------------------------

# App routes are split into sub-modules for easier consumption
app.blueprint(hello_world)

if __name__ == "__main__":
    app.ctx.db = create_async_engine(dbenv.POSTGRES_URL)
    app.run(host='0.0.0.0', port=8000, access_log=False, debug=IS_DEBUG)
