//index.js
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const cors = require('cors');

// Correct the import
const { WriteAheadLog545 } = require('./public/log.js');

const app = express();
const port = process.env.PORT || 4200;

// MongoDB connection setup
const uri = process.env.MONGODB_URI || 'mongodb+srv://zk977238:QZWvapj3sOqLciWI@4140assignment545.001txn4.mongodb.net/txn4.mongodb.net/';
const dbName = '4140assignment545';
const client = new MongoClient(uri, { useUnifiedTopology: true });

async function connectToDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.use(cors());
// Serve static files (like JS) from the 'public' directory
app.use(express.static('public'));
app.use(bodyParser.json());

// Sample route to render a page
app.get('/', (req, res) => {
  res.render('index'); // Create 'index.ejs' in your 'views' directory
});

// Sample route to get log data
app.get('/get-log', (req, res) => {
  const logData = writeAheadLog545.getLog(); // Use writeAheadLog instead of log
  res.json({ logData });
});

app.post('/save-log', async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection('logs545'); // Replace with your actual collection name

    const { logData } = req.body; // Extract logData from the request body

    // Save the log to the database
    await collection.insertOne({ log: logData });

    console.log('Log saved to MongoDB');
    res.status(200).send('Log saved to MongoDB');
  } catch (err) {
    console.error('Error saving log to MongoDB:', err);
    res.status(500).json({ error: err.message });  // Send error details in the response
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Application is available on localhost:4200`);
  connectToDB(); // Connect to MongoDB when the server starts
});

module.exports = {
  WriteAheadLog545,
};
