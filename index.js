// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

app.set('trust proxy', 1);

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get("/api/whoami", function (req, res) {
  res.json({
    ipaddress: req.get('cf-connecting-ip') || req.ip,
    language: req.get('accept-language') || '',
    software: req.get('user-agent') || ''
  });
});

app.get("/api/:date?", function (req, res) {
  var dateInput = req.params.date;
  var date = dateInput === undefined
    ? new Date()
    : /^\d+$/.test(dateInput)
      ? new Date(Number(dateInput))
      : new Date(dateInput);

  if (Number.isNaN(date.getTime())) {
    return res.json({error: "Invalid Date"});
  }

  res.json({
    unix: date.getTime(),
    utc: date.toUTCString()
  });
});


// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
