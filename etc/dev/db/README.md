## Running Docker on Dev Box.
```
$ docker run -d --name clinicdb \
-e MONGO_INITDB_ROOT_USERNAME=mongoadmin \
-e MONGO_INITDB_ROOT_PASSWORD=secret \
-p 27017:27017 \
mongo
```
