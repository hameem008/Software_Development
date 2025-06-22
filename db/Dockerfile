FROM postgres:15

# Copy only the initial schema setup script
COPY 1-init.sql /docker-entrypoint-initdb.d/1-init.sql
COPY entrypoint.sh /entrypoint.sh

# Make sure the entrypoint script is executable
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
