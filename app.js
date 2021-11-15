const express = require('express');
const fs = require('fs');
const app = express();

const tours = JSON.parse(fs.readFileSync('./dev-data/data/tours.json'));

app.get('/api/v1/tours', (req, res) => {
  res.json({
    status: 'success',
    data: {
      tours,
    },
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
