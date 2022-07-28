#!/bin/bash
poetry run pytest \
    --cov-report=html \
    --cov-append \
    --cov={{cookiecutter.module_name}} \
    tests/integration