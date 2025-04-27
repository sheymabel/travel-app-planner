const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;



app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
