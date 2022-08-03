# {{cookiecutter.app_name}}

This repo contains code for {{cookiecutter.app_name}}.

## Installing

I develop and build this code from within a Docker container running within a Unix environment (Linux/MacOS/Windows-Ubuntu-Sub-System/etc), so you'll need Docker installed to continue. Once you have Docker, running the following `Make` commands will handle the rest:

```bash
make install
make uninstall
```

## Running

To run the app use the command

```bash
make start
```

which will start a docker dev container, map the working dirctory into that container, and then
expose the app on port `8080`.

Once running, you can connect to a new terminal within the dev container by using

```bash
make node-dev-shell-connect
```

Within that dev shell you can run the usual npm commands etc.

## Testing etc.

The following commands are available for running locally, or within a CI environment:

```bash
make lint
make test-unit
make coverage
```

However, if you wish to enter the dev-container and run commands with `npm` you can use the following:

```bash
make node-dev-shell
```