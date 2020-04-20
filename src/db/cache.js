const redis = require("redis");

let cache_client = undefined;
try {
  const port = process.env.REDIS_PORT;
  const host = process.env.DOCKER_HOST;
  if (port && host) {
    cache_client = redis.createClient({ port, host });
    cache_client.on('connect', function () {
      console.log("Connected to Redis");
    })
  }
} catch (err) {
  console.log(err);
}

function nocache(cb) {
  if (!cache_client) {
    cb(null, null);
    return true;
  }
  return false;
}

const cacheRead = (id, cb) => {
  if (!nocache(cb)) {
    cache_client.get(id, (error, result) => {
      cb(error, result);
    });
  }
};

const cacheWrite = (id, data, cb) => {
  if (!nocache(cb)) {
    cache_client.set(id, data, (error, result) => {
      cb(error, result);
    });
  }
};

module.exports = { cacheRead, cacheWrite };