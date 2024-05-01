const express = require('express');
const app = express();


const cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 })); 

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// API endpoint for getting Unix timestamp and UTC date
app.get("/api/:date?", function (req, res) {
  let dateInput = req.params.date ? req.params.date : new Date();
  let dateObject = new Date(dateInput);

  // Check if the date is valid
  if (isNaN(dateObject)) {
    return res.json({ error: "Invalid Date" });
  }

  // Construct response object
  let responseObject = {
    unix: dateObject.getTime(),
    utc: dateObject.toUTCString()
  };

  // Send response
  res.json(responseObject);
});

// Listen on port set in environment variable or default to 3000
const listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
