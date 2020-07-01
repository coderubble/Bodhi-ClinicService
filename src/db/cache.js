const redis = require("redis");
const { promisify } = require("util");
const { getClinicDetails } = require("../service/clinic.service");

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

const cacheEvict = (id, cb) => {
  if (!nocache(cb)) {
    cache_client.del(id, (error, result) => {
      cb(error, result);
    });
  }
};

const cacheRead = (id, cb) => {
  if (!nocache(cb)) {
    cache_client.get(id, (error, result) => {
      cb(error, result);
    });
  }
};

const cacheReadByPattern = (key, cb) => {
  if (!nocache(cb)) {
    cache_client.keys(`${key}*`, async function (err, keys) {
      let ccp = promisify(cache_client.get).bind(cache_client);
      let clinic_data = await Promise.all(keys.map(async key => {
        return { key, id: await ccp(key) }
      }));
      cb(err, clinic_data);
    })
  }
}

const cacheWriteAll = (key, data, cb) => {
  if (!nocache(cb)) {
    cache_client.set(key, data, (error, result) => {
      cb(error, result);
    });
  }
}

const cacheWrite = (id, data, cb) => {
  if (!nocache(cb)) {
    cache_client.set(id, data, (error, result) => {
      cb(error, result);
    });
  }
};

module.exports = { cacheRead, cacheWrite, cacheEvict, cacheReadByPattern, cacheWriteAll };