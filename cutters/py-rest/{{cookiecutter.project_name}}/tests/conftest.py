import asyncio
import pytest
import pytest_asyncio
from sqlalchemy.ext.asyncio import create_async_engine
import {{cookiecutter.module_name}}.db.env as dbenv
import {{cookiecutter.module_name}}.db.schema as dbschema
from {{cookiecutter.module_name}}.app import app


class Helpers:
    """Fixture for test utils etc.
    """
    pass


@pytest.fixture
def helpers():
    return Helpers


@pytest.fixture(scope="session")
def event_loop():
    policy = asyncio.get_event_loop_policy()
    loop = policy.new_event_loop()
    yield loop
    loop.close()


async def reset_db(engine):
    for table in dbschema.tables:
        async with engine.connect() as conn:
            await conn.execute(table.delete())
            await conn.commit()


@pytest_asyncio.fixture(scope='module')
async def async_db():
    """Fixture for setting up a db connection.

    Do not use directly. Use 'fresh_db' and 'continued_db'
    fixtures instead.
    """
    db_url = dbenv.POSTGRES_URL
    engine = create_async_engine(db_url)
    app.ctx.db = engine
    yield engine
    await reset_db(engine)
    await engine.dispose()


@pytest_asyncio.fixture(scope='function')
async def fresh_db(async_db):
    """Use when you want to reset the db."""
    await reset_db(async_db)
    yield async_db


@pytest.fixture(scope='function')
def continued_db(async_db):
    """Use when you want to continue the db state between adjacent
    tests.
    """
    yield async_db


@pytest.fixture(scope='module')
def rest_api():
    return app.asgi_client
