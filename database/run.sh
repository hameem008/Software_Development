# ~/MediLine/database$ docker-compose down -v; docker-compose up --build
docker-compose down -v
docker-compose up --build

# to see the schema and table in the terminal
# docker exec -it my_postgres_db psql -U myuser -d mydb
# to see the table
# \dt -> to see all the tables
# \x  -> present the query result nicely
# \q  -> quit