#!/bin/bash
set -e

echo "Building Momentum Backend..."
docker build -f backend/Dockerfile -t momentum-backend:latest .

echo "Building Momentum Frontend..."
docker build -f frontend/Dockerfile -t momentum-frontend:latest .

echo "Building Momentum Installer..."
docker build -t momentum-installer:latest ./installer

echo "All images built successfully!"
echo "You can now run the installer using:"
echo "docker run -it --rm \\"
echo "  --volume /var/run/docker.sock:/var/run/docker.sock \\"
echo "  --volume \"\$(pwd)/momentum-app\":/app \\"
echo "  -e POSTGRES_PASSWORD=secret \\"
echo "  -e JWT_SECRET=secret \\"
echo "  momentum-installer:latest"
