#!/bin/bash

DOCKER_COMPOSE_DIR="$(pwd)"
DOCKER_RUN_DIR="$(pwd)/frontend"
DOCKERFILE_DIR="$DOCKER_RUN_DIR"

echo
echo "~~~ Start of Dockers ~~~"
echo


echo "Lancement du Docker-Compose (BackEnd)"
echo
if [ -d "$DOCKER_COMPOSE_DIR" ]; then
    cd "$DOCKER_COMPOSE_DIR" || exit
    docker-compose up -d
else
    echo "[ERREUR] Dossier BackEnd uncorrect"
fi

echo

echo "Starting Docker-Run (FrontEnd)"
echo
if [ -f "$DOCKERFILE_DIR/Dockerfile" ]; then
    cd "$DOCKERFILE_DIR" || exit
    docker build -t serveurhtml .
    docker run --rm -d -p 9000:80 -v "$(pwd)":/usr/share/nginx/html:ro serveurhtml
else
    echo "[ERREUR] Dockerfile is not here"
    exit 1
fi

echo
echo "~~ Every Dockers are SetUp ~~"
read -p "..."
