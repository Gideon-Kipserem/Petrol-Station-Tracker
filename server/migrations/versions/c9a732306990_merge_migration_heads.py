"""Merge migration heads

Revision ID: c9a732306990
Revises: 7d9249f08bf0, b244d699a449
Create Date: 2025-09-24 00:45:41.842989

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c9a732306990'
down_revision = ('7d9249f08bf0', 'b244d699a449')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
