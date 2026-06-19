"""empty message

Revision ID: 4e72a041ebe4
Revises: 1448c842806d
Create Date: 2026-06-19 11:16:36.651725

"""
from alembic import op
import sqlalchemy as sa


revision = '4e72a041ebe4'
down_revision = '1448c842806d'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('accessibility_reviews', schema=None, recreate='always') as batch_op:
        batch_op.add_column(sa.Column('last_modified_by_id', sa.Integer(), nullable=True))
        batch_op.drop_column('user_id')
        batch_op.create_index('ix_accessibility_reviews_osm_id_unique', ['osm_id'], unique=True)
        batch_op.create_foreign_key('fk_accessibility_reviews_last_modified_by', 'users', ['last_modified_by_id'], ['id'])


def downgrade():
    with op.batch_alter_table('accessibility_reviews', schema=None, recreate='always') as batch_op:
        batch_op.add_column(sa.Column('user_id', sa.Integer(), nullable=True))
        batch_op.drop_column('last_modified_by_id')
        batch_op.drop_index('ix_accessibility_reviews_osm_id_unique')
        batch_op.drop_constraint('fk_accessibility_reviews_last_modified_by', type_='foreignkey')