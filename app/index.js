const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const port = 3000;

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'mysql',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'secret',
  database: process.env.DB_NAME || 'mydb'
};

// Test database connection
async function initializeDB() {
  const maxRetries = 5;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const connection = await mysql.createConnection(dbConfig);
      await connection.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL
        )
      `);
      console.log('Database connected');
      return;
    } catch (err) {
      retries++;
      console.error(`Connection failed (attempt ${retries}/${maxRetries}):`, err.message);
      await new Promise(res => setTimeout(res, 5000)); // Wait 5 seconds
    }
  }

  console.error('Failed to connect to database after retries');
  process.exit(1);
}

// API endpoint
app.get('/users', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
initializeDB().then(() => {
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
});
