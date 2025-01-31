const express = require('express');
const mysql = require('mysql2/promise');
const redis = require('redis');
const { Client } = require('@elastic/elasticsearch');
const app = express();
const port = 3000;

// Database Config
const dbConfig = { /* ... (same as before) */ };

// Redis Client
const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || 'redis',
    port: 6379
  },
  password: 'redispass'
});
redisClient.on('error', (err) => console.error('Redis error:', err));
await redisClient.connect();

// Elasticsearch Client
const esClient = new Client({
  node: `http://${process.env.ELASTICSEARCH_HOST || 'es'}:9200`,
  auth: {
    username: 'elastic',
    password: 'elasticpass'
  }
});

// Initialize Elasticsearch Index
async function initializeElasticsearch() {
  try {
    await esClient.indices.create({
      index: 'users',
      body: {
        mappings: {
          properties: {
            name: { type: 'text' }
          }
        }
      }
    });
    console.log('Elasticsearch index created');
  } catch (err) {
    if (err.meta?.body?.error?.type !== 'resource_already_exists_exception') {
      console.error('Elasticsearch setup failed:', err);
    }
  }
}

// Example: Cached API Endpoint with Elasticsearch Search
app.get('/users', async (req, res) => {
  try {
    // Check Redis cache
    const cacheKey = 'users:all';
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    // Fetch from MySQL
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query('SELECT * FROM users');

    // Cache in Redis (TTL: 60 seconds)
    await redisClient.set(cacheKey, JSON.stringify(rows), { EX: 60 });

    // Index in Elasticsearch
    await Promise.all(rows.map(user =>
      esClient.index({
        index: 'users',
        body: user
      })
    ));

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
initializeDB()
  .then(initializeElasticsearch)
  .then(() => {
    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  });
