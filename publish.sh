#!/bin/bash
set -e

if [ -z "$1" ]; then
    echo "Usage: ./publish.sh <docker-hub-username> [version]"
    echo "Example: ./publish.sh myuser 1.0.0"
    exit 1
fi

USERNAME=$1
VERSION=${2:-latest}

echo "Step 1: Rebuilding images to ensure latest configuration..."
./build-images.sh

echo "Step 2: Tagging and Pushing Backend..."
docker tag momentum-backend:latest $USERNAME/momentum-backend:$VERSION
docker push $USERNAME/momentum-backend:$VERSION

echo "Step 3: Tagging and Pushing Frontend..."
docker tag momentum-frontend:latest $USERNAME/momentum-frontend:$VERSION
docker push $USERNAME/momentum-frontend:$VERSION

echo "Step 4: Tagging and Pushing Installer..."
docker tag momentum-installer:latest $USERNAME/momentum-installer:$VERSION
docker push $USERNAME/momentum-installer:$VERSION

echo "--------------------------------------------------------"
echo "✅ Success! Images published to Docker Hub."
echo "--------------------------------------------------------"
echo "To run your app on any server, use:"
echo ""
echo "docker run -it --rm \\"
echo "  --volume /var/run/docker.sock:/var/run/docker.sock \\"
echo "  --volume \"\$(pwd)/momentum-app\":/app \\"
echo "  -e POSTGRES_PASSWORD=secret \\"
echo "  -e JWT_SECRET=secret \\"
echo "  -e DOCKER_REGISTRY_PREFIX=$USERNAME/ \\"
echo "  $USERNAME/momentum-installer:$VERSION install"
echo "--------------------------------------------------------"
