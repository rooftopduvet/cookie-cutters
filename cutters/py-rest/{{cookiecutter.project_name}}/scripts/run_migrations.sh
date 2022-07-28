#!/bin/bash
WAIT_FOR=5
echo "Waiting ${WAIT_FOR} seconds for db to initialize..."
sleep ${WAIT_FOR}
echo "Running migrations"
poetry run alembic upgrade head