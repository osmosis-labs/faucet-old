FROM python:3.10.1-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update \
    # dependencies for building Python packages
    && apt-get install -y build-essential

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY main.py main.py
COPY static static
COPY templates templates
COPY config config
COPY utils utils

ENV MNEMONIC ""

ENV PORT 8080
ENV GUNICORN_WORKERS 1
ENV GUNICORN_THREADS 8

# Deploying to Production
# https://flask.palletsprojects.com/en/2.2.x/deploying/

# gunicorn
CMD gunicorn main:app --bind :$PORT --workers $GUNICORN_WORKERS --threads $GUNICORN_THREADS
