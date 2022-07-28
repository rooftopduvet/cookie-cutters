FROM python:3.9-slim-buster

SHELL ["/bin/bash", "-c"]

RUN apt-get update
RUN apt-get install -y curl

# Install poetry
RUN curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/install-poetry.py | python -
RUN echo PATH=$PATH:~/.local/bin >> ~/.bashrc
ENV PATH="${PATH}:~/.local/bin"

# Configure poetry to not use virtual envs (as we are using docker)
RUN poetry config virtualenvs.create false

# Create app directory and install dependencies
RUN mkdir /app
WORKDIR /app
RUN echo PYTHONPATH=$PYTHONPATH:/app >> ~/.bashrc
ENV PYTHONPATH="${PYTHONPATH}:/app"

COPY pyproject.toml pyproject.toml
COPY poetry.lock poetry.lock

RUN poetry install --no-root --no-interaction --no-ansi