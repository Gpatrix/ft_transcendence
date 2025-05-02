compose_file = ./srcs/docker-compose.yml

all: build up

dev: build_dev up_dev

debug:
	docker compose -f $(compose_file) build --progress=plain  --no-cache > docker.debug

build:
	docker compose -f $(compose_file) build

up:
	docker compose -f $(compose_file) up

stop:
	docker compose -f $(compose_file) stop

clean down:
	docker compose -f $(compose_file) down

fclean purge:
	docker compose -f $(compose_file) down --volumes
	docker system prune --all --force --volumes
	docker volume prune -a -f

re: down all

.PHONY: build up stop down re purge fclean clean debug