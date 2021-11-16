const app = require('./app');
const express = require('express');
const port = 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
