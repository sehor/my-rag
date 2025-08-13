require('dotenv').config();
const express = require('express');
const { ParseServer } = require('parse-server');

const app = express();

const server = new ParseServer({
  databaseURI: process.env.DATABASE_URI || 'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_PATH || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'myAppId',
  masterKey: process.env.MASTER_KEY || 'myMasterKey',
  serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',
});

// Serve the Parse API on the /parse URL prefix
app.use('/parse', server.app);

const port = process.env.PORT || 1337;
app.listen(port, () => {
  console.log(`Parse Server running on port ${port}.`);
});
