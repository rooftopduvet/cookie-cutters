PKG_NAME={{cookiecutter.project_name}}
DOCKER_IMG={{cookiecutter.author_id}}/$(PKG_NAME)

.PHONY: install dev-shell lint test docs uninstall

install:
	docker build -t $(DOCKER_IMG) .

dev-shell:
	docker run --rm -it \
		-v $(shell pwd):/app \
		$(DOCKER_IMG) /bin/bash

lint:
	docker run --rm -it \
		-v $(shell pwd):/app \
		$(DOCKER_IMG) /bin/bash -c "poetry run autopep8 ."

test:
	docker run --rm -it \
		-v $(shell pwd):/app \
		$(DOCKER_IMG) /bin/bash -c \
			"poetry run pytest \
			--cov-report=xml \
			--cov=$(PKG_NAME) tests/"

docs:
	docker run --rm -it \
		-v $(shell pwd):/app \
		$(DOCKER_IMG) /bin/bash -c \
			"poetry run sphinx-build -b html docs/source docs/build"

uninstall:
	docker rmi -f $(DOCKER_IMG)