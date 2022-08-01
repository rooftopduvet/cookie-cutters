# {{cookiecutter.project_name}}

`{{cookiecutter.project_name}}` is a REST-API.

## Installing

This code is developed and built this code from within a Docker container running within a Unix environment (Linux/MacOS/Windows-Ubuntu-Sub-System/etc), so you'll need Docker installed to continue. Once you have Docker, running the following `Make` commands will handle the rest:

```bash
// Installing:
make install

// Uninstalling:
make uninstall
```

## Running

You can start the app in dev-mode with

```bash
make start
```

which will launch a database and the app (at port `8000`) using (docker-compose)[https://docs.docker.com/compose/]. The app will automatically stop, and clean itself up when you hit `ctrl-c`.

Once running, the app will also expose an `openapi` endpoint at `/docs`, with which
you can send test queries.

## Developing

The following commands are available external to the dev-container:

```
make lint
make test
```

However, if you wish to enter the dev-container and run commands with `npm` you can use the following:

```
make node-dev-shell
```