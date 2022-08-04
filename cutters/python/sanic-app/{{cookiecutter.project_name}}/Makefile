export PKG_NAME={{cookiecutter.project_name}}
export APP_DIR=$(shell pwd)
export APP_DOCKER_IMG={{cookiecutter.author_id}}/$(PKG_NAME)

export DB_CONTAINER_NAME=$(PKG_NAME)__db
export APP_CONTAINER_NAME=$(PKG_NAME)__app

.PHONY: install dev-shell lint test-unit
	test-integration test docs uninstall start-dev
	clean_coverage

install:
	docker build -t $(APP_DOCKER_IMG) .

start-dev:
	docker-compose up -d
	docker exec -it $(APP_CONTAINER_NAME) /bin/bash -c "\
		./scripts/run_migrations.sh && \
		/bin/bash" || make stop-dev
	make stop-dev

stop-dev:
	docker-compose down

dev-shell:
	docker run --rm -it \
		-v $(shell pwd):/app \
		$(APP_DOCKER_IMG) /bin/bash

lint:
	docker run --rm -it \
		-v $(shell pwd):/app \
		$(APP_DOCKER_IMG) ./scripts/lint.sh

test-unit: clean_coverage
	docker run --rm -it \
		-v $(shell pwd):/app \
		$(APP_DOCKER_IMG) ./scripts/test_unit.sh

test-integration:
	docker-compose up -d
	docker exec -it $(APP_CONTAINER_NAME) /bin/bash -c "\
		./scripts/run_migrations.sh && \
		./scripts/test_integration.sh" || make stop-dev
	make stop-dev

test: test-unit test-integration

clean_coverage:
	rm -rf .coverage.* htmlcov

docs:
	docker run --rm -it \
		-v $(shell pwd):/app \
		$(APP_DOCKER_IMG) /bin/bash -c \
			"poetry run sphinx-build -b html docs/source docs/build"

uninstall:
	docker rmi -f $(APP_DOCKER_IMG)