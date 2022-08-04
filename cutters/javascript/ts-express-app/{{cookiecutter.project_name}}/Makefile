export PROJECT_NAME={{cookiecutter.project_name}}
export PROJECT_ROOT=$(shell pwd)
export APP_DOCKER_IMG=$(PROJECT_NAME)-node-dev-env

export DB_CONTAINER_NAME=$(PROJECT_NAME)__db
export APP_CONTAINER_NAME=$(PROJECT_NAME)__app


.PHONY: start stop build install node-dev-shell node-dev-shell-image
	lint test clean

install:
	make node-dev-shell-image
	docker run -it --rm \
		-v $(PROJECT_ROOT):/app \
		$(APP_DOCKER_IMG) npm install

start:
	docker-compose up -d
	docker exec -it $(APP_CONTAINER_NAME) /bin/bash -c "\
		npm run db:upgrade && \
		/bin/bash" || make stop
	make stop

stop:
	docker-compose down

clean:
	rm -rf dist

build: clean
	docker run -it --rm \
		-v $(PROJECT_ROOT):/app \
		$(APP_DOCKER_IMG) npm run build

lint:
	docker run -it --rm \
		-v $(PROJECT_ROOT):/app \
		$(APP_DOCKER_IMG) npm run lint:fix

test:
	docker-compose up -d
	docker exec -it $(APP_CONTAINER_NAME) /bin/bash -c "\
		npm run lint && \
		npm run db:upgrade && \
		npm run test && \
		npm run test:coverage" || make stop
	make stop

uninstall:
	docker rmi -f $(APP_DOCKER_IMG)

# ---------------------------------------------

node-dev-shell:
	docker run -it --rm \
		-p 8000:8000 \
		-v $(PROJECT_ROOT):/app \
		-h node-dev-shell \
		--name $(APP_DOCKER_IMG) \
		$(APP_DOCKER_IMG) /bin/bash

# ---------------------------------------------

node-dev-shell-image:
	docker build --tag $(APP_DOCKER_IMG) --target dev .