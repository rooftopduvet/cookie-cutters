{{cookiecutter.project_name}}
---------------------

.. list-table::
   :widths: 50 70
   :header-rows: 1

   * - Author
     - Description
   * - {{cookiecutter.author}}
     - Code for {{cookiecutter.project_name}}

Installing & Running Tests
**************************

The dependancy management system for this codebase is
`Poetry <https://python-poetry.org/>`_ however, as a service API,
the codebase is set up to run in docker, so most of the time you need
not worry about Poetry. The following :code:`make` commands are provided
for easy installation and running.

.. code-block:: bash

    make install        // Builds the dev container
    make start-dev      // Starts the dev container
    make lint           // Runs the linter within the dev container
    make test           // Runs pytest within the dev container
    make uninstall      // Uninstalls the dev container (using 'docker rmi')

The :code:`make start-dev` command runs `docker-compose <https://docs.docker.com/compose/>`_
to boot up the server and a database, and then places you inside the server container
where you can run commands for development.

If you need to add/remove any additional packages you can do so from within that dev environment
by running :code:`poetry add/remove`. (However, note that Poetry will only update the project
and lock files. To persist the changes on your system you will then need to run :code:`make install`
again from outside the shell.


API
***

The REST API is documented by OpenAPI, and is available at `/swagger </swagger>`_ when
the app is running.

Codebase documentation is generated by `Sphinx <https://www.sphinx-doc.org/>`_ as
an `HTML site in the docs folder <docs/build/html/index.html>`_