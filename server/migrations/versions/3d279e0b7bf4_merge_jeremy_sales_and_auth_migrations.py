"""merge jeremy sales and auth migrations

Revision ID: 3d279e0b7bf4
Revises: 5478a5afde93, abcc8fc7ee64
Create Date: 2025-09-24 16:05:51.279412

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3d279e0b7bf4'
down_revision = ('5478a5afde93', 'abcc8fc7ee64')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
