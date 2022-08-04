import os

DB_HOST = 'db'

POSTGRES_USER = os.getenv('POSTGRES_USER', 'user')
POSTGRES_PASSWORD = os.getenv('POSTGRES_PASSWORD', 'password')
POSTGRES_DB = os.getenv('POSTGRES_DB', 'postgres')

POSTGRES_URL = f'postgresql+asyncpg://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{DB_HOST}/{POSTGRES_DB}'
