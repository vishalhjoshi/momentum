FROM docker:cli

# Install dependencies
RUN apk add --no-cache bash gettext

# Copy assets
COPY installer/install.sh /usr/local/bin/install
COPY installer/docker-compose.yml /usr/src/code/docker-compose.yml

# Make script executable
RUN chmod +x /usr/local/bin/install

ENTRYPOINT ["install"]
