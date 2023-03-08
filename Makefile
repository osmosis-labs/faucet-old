# Run Flask

dev:
	flask run --reload --debugger --host 0.0.0.0 --port 8080

run:
	flask run --host 0.0.0.0 --port 8080

# Docker

start:
	docker-compose up

startd:
	docker-compose up -d 

stop:
	docker-compose down

build:
	docker-compose build
