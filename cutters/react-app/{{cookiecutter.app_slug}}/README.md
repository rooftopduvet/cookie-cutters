# {{cookiecutter.app_name}}

This repo contains the code for {{cookiecutter.app_name}}.

## Installing and Running

I develop and build this code from within a Docker container running within a Unix environment (Linux/MacOS/Windows-Ubuntu-Sub-System/etc), so you'll need Docker installed to continue. Once you have Docker, running the following `Make` commands will handle the rest:

```
// Installing:
make install

// Running:
make start
```

## Developing

The following commands are available external to the dev-container:

```
make lint
make test-unit
make coverage
```

However, if you wish to enter the dev-container and run commands with `npm` you can use the following:

```
make node-dev-shell
```