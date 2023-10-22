require("dotenv").config();
const host = process.env.REDIS_HOST;
const port = Number.parseInt(process.env.REDIS_PORT);
const password = process.env.REDIS_PASSWORD;

// export const redisClient = createNodeRedisClient({
//   host,
//   port,
// });

// redisClient.nodeRedis.on('error', () => {
//   console.log('Redis connection error.');
// });

// redisClient.nodeRedis.on('connect', () => {
//   console.log(`Redis client connected on port ${port}!`);
// });

import { createClient } from "redis";
export const redisClient = createClient({
  password: password,
  socket: {
    // family: 6,
    host: host,
    port: port,
  },
});

redisClient
  .connect()
  .then(() => {
    console.log("connect redis successfully");
  })
  .catch((err: any) => {
    console.log(err);
  });
