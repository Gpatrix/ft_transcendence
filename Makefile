compose_file_prod = ./srcs/docker-compose.prod.yml
compose_file_dev  = ./srcs/docker-compose.dev.yml

all: build up

dev: build_dev up_dev

build:
	docker compose -f $(compose_file_prod) build

up:
	docker compose -f $(compose_file_prod) up

build_dev:
	docker compose -f $(compose_file_dev) build

up_dev:
	docker compose -f $(compose_file_dev) up

stop:
	docker compose -f $(compose_file_prod) stop
	docker compose -f $(compose_file_dev) stop

clean down stop:
	docker compose -f $(compose_file_prod) down
	docker compose -f $(compose_file_dev) down

fclean purge: stop
	docker compose -f $(compose_file_prod) down --volumes
	docker compose -f $(compose_file_dev) down --volumes
	docker system prune --all --force --volumes

re: stop down all

re_dev: stop build_dev up_dev

.PHONY: build up stop down re purge fclean clean debug re_dev build_dev up_dev