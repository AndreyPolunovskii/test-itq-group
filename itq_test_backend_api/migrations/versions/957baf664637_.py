"""empty message

Revision ID: 957baf664637
Revises: fa106f4cadfe
Create Date: 2020-01-19 00:03:03.390809

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '957baf664637'
down_revision = 'fa106f4cadfe'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('weather',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('city_name', sa.String(length=120), nullable=True),
    sa.Column('city_id', sa.Integer(), nullable=True),
    sa.Column('country_code', sa.String(length=30), nullable=True),
    sa.Column('dt', sa.DateTime(), nullable=True),
    sa.Column('pres', sa.Float(), nullable=True),
    sa.Column('temp', sa.Float(), nullable=True),
    sa.Column('rh', sa.Integer(), nullable=True),
    sa.Column('wind_spd', sa.Float(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.drop_index('ix_user_email', table_name='user')
    op.drop_index('ix_user_nickname', table_name='user')
    op.drop_table('user')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('nickname', sa.VARCHAR(length=64), autoincrement=False, nullable=True),
    sa.Column('email', sa.VARCHAR(length=120), autoincrement=False, nullable=True),
    sa.Column('role', sa.SMALLINT(), autoincrement=False, nullable=True),
    sa.PrimaryKeyConstraint('id', name='user_pkey')
    )
    op.create_index('ix_user_nickname', 'user', ['nickname'], unique=True)
    op.create_index('ix_user_email', 'user', ['email'], unique=True)
    op.drop_table('weather')
    # ### end Alembic commands ###
