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
  return res.send(
    `Hello and welcome to this tiny express-redis docker example<br>
    <br>
    Please use the following HTML GET commands<br>
    <br>
    <table>
      <tr>
        <td>/</td>
        <td>this page</td>
      </tr>
      <tr>
        <td>/keys </td>
        <td>lists all keys</td>
      </tr>
      <tr>
        <td>/read/:key</td>
        <td>gets the stored value for a key</td>
      </tr>
      <tr>
        <td>/store/:key/:value</td>
        <td>stores a value for a key</td>
      </tr>
    </table>
    <br>
    Last access: ${lastUse}`);
});

const PORT = process.env.PORT;
app.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT}`);
  await redisClient.setAsync("lastUse", new Date().toISOString());
});
