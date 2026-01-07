#!/bin/bash

DOCKER_COMPOSE_DIR="$(dirname "$0")"
DOCKER_RUN_DIR="$(dirname "$0")/FrontEnd"

echo
echo "~~~ Shut-Down every Docker ~~~"
echo

# Shutting down BackEnd Docker
if [ -d "$DOCKER_COMPOSE_DIR" ]; then
    cd "$DOCKER_COMPOSE_DIR" || exit
    docker-compose down -v 
else
    echo "[INFO] Dossier BackEnd introuvable : $DOCKER_COMPOSE_DIR"
fi

# Shutting down FrontEnd Docker (serveurhtml)
echo
echo "Arrêt des conteneurs basés sur l'image 'serveurhtml'..."
docker ps -q --filter "ancestor=serveurhtml" | while read -r container_id; do
    if [ -n "$container_id" ]; then
        docker stop "$container_id"
    fi
done

echo
echo "~~~ All docker are Shut-down ~~~"
read -p "..."
