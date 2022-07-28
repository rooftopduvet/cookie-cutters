from {{cookiecutter.module_name}}.db import schema
from sqlalchemy import literal_column


async def get_greetings(conn, offset: int = 0, limit: int = 20) -> list[dict]:
    """List all greetings that have occurred."""
    stmt = schema.greetings.select()
    stmt = stmt.offset(offset).limit(limit)
    res = await conn.execute(stmt)
    return [dict(r) for r in res.all()]


async def get_greeting(conn, id: str) -> dict:
    """Get a specific greeting"""
    stmt = schema.greetings.select()
    stmt = stmt.where(schema.greetings.c.id == str(id))
    stmt = stmt.limit(1)
    res = await conn.execute(stmt)
    res = res.first()
    if res is not None:
        return dict(res)


async def add_greeting(conn, name: str, greeting: str) -> dict:
    """Add a new greeting"""
    stmt = schema.greetings.insert()
    stmt = stmt.returning(literal_column('*'))
    data = {
        'name': name,
        'message': greeting,
    }
    res = await conn.execute(stmt, data)
    await conn.commit()
    res = res.first()
    if res is not None:
        return dict(res)
