## redis on Docker
```
$ docker run --name metadatacache -p 6379:6379 --rm -d redis
```
## Connecting using cli
```
$ redis-cli -h 192.168.99.100 -p 6379 ping
```

