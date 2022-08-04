# cookie-cutters

This repository contains a number of template projects and code
snippets, which you can use to bootstrap projects.

Each project is set up with 'best-practice' patterns, libraries, and
documentation, along with example modules and tests (including end-to-end),
making it as easy as possible to get started writing code, and to have
working examples of tests etc. within easy reach.

## Installing

To use this repository you will need to have a `unix` environment with `python` installed, and then you will need to run:

```python
python3 -m pip install cookiecutter
```

[Cookiecutter](https://cookiecutter.readthedocs.io/en/stable/) is the tool
used to copy each project and initialize the wildcards that you will provide
(things like 'project name' etc.).

Once you have them installed, you will then need to add the [scripts](scripts) folder
to your path:

```bash
echo 'PATH=${PATH}:<this_repo>/scripts' >> ~/.bash_profile
source ~/.bash_profile
```

## Running

Once installed, you can run the code with

```bash
ckct
```

which will offer you a selection of projects and parameters.