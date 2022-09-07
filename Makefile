build:
	docker-compose build 

up:
	docker-compose up 

upd:
	docker-compose up -d

down:
	docker-compose down

rebuild:
	docker-compose up --build --force-recreate --no-deps -d frontend backend