const express = require('express');
const app = express();


const redisClient = require('./redis-client');

app.get('/store/:key/:value', async (req, res) => {
  const { key, value } = req.params;
  await redisClient.setAsync(key, value);
  return res.send("Success");
});

app.get('/read/:key', async (req, res) => {
  const { key } = req.params;
  const value = await redisClient.getAsync(key);
  return res.json({[key]: value});
});

app.get('/keys', async (req, res) => {
  const keys = await redisClient.keysAsync('*');
  return res.send(keys);
});

app.get('/', async (req, res) => {
  const lastUse = await redisClient.getAsync("lastUse");
  await redisClient.setAsync("lastUse", new Date().toISOString());
  return res.body(
    `Hello and welcome to this tiny express-redis docker example\n
    \n
    Please use the following HTML GET commands\n
    \n
    /                   > this page\n
    /keys               > lists all keys\n
    /read/:key          > gets the stored value for a key\n
    /store/:key/:value  > stores a value for a key\n
    \n
    Last access: ${lastUse}`);
});

const PORT = process.env.PORT;
app.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT}`);
  await redisClient.setAsync("lastUse", new Date().toISOString());
});
