compos_file = ./srcs/docker-compose.yml

all: build up


debug:
	docker compose -f $(compos_file) build --progress=plain  --no-cache > docker.debug


build:
	docker compose -f $(compos_file) build

up:
	docker compose -f $(compos_file) up

stop:
	docker compose -f $(compos_file) stop

clean down: 
	docker compose -f $(compos_file) down

fclean purge: down
	docker system prune --all --force --volumes
	docker volume prune -a -f

re: down all

.PHONY: build up stop down re purge fclean clean debug