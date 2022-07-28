"""empty message

Revision ID: bba199ab9e7e
Revises:
Create Date: 2022-07-27 03:34:04.780150

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'bba199ab9e7e'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('greetings',
                    sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
                    sa.Column('created_at', sa.DateTime(), nullable=False),
                    sa.Column('updated_at', sa.DateTime(), nullable=False),
                    sa.Column('name', sa.String(length=50), nullable=False),
                    sa.Column('message', sa.String(length=50), nullable=False),
                    sa.PrimaryKeyConstraint('id')
                    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('greetings')
    # ### end Alembic commands ###
