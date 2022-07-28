#!/bin/bash
DOWNGRADE_TO=${1:-"-1"}
poetry run alembic downgrade ${DOWNGRADE_TO}