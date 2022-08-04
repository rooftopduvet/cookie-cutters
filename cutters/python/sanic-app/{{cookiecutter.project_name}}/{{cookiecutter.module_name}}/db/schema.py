import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID
import uuid

# -----------------------------------
# Generators for standard fields etc.
# -----------------------------------


def id_column():
    id_column = sa.Column(
        'id',
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4)
    return id_column


def timestamp_column(name: str, autoupdate=False):
    autoupdate_kwargs = {}
    if autoupdate:
        autoupdate_kwargs = {'onupdate': sa.func.now()}

    ts_column = sa.Column(
        name,
        sa.DateTime,
        nullable=False,
        default=sa.func.now(),
        **autoupdate_kwargs)
    return ts_column


def standard_colums():
    """Standard columns that all tables should implement.

    Makes a list of SQLAlchemy columns that should be standard
    for all tables in the DB.

    Returns:
        A list of S.A. column templates.
    """
    std_cols = [
        id_column(),
        timestamp_column('created_at', autoupdate=False),
        timestamp_column('updated_at', autoupdate=True),
    ]
    return std_cols


# ---------------
# Database Schema
# ---------------

metadata = sa.MetaData()

greetings = sa.Table(
    'greetings',
    metadata,
    *standard_colums(),
    sa.Column('name', sa.String(50), nullable=False),
    sa.Column('message', sa.String(50), nullable=False),
)

tables = [
    greetings,
]
