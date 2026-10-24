// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var dns = require('dns');
var crypto = require('crypto');

app.set('trust proxy', 1);

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204
app.use(express.urlencoded({extended: false}));
app.use(express.json());

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

var shortUrls = new Map();
var nextShortUrl = 1;

app.post("/api/shorturl", function (req, res) {
  var originalUrl = req.body.url;
  var parsedUrl;

  if (typeof originalUrl !== 'string') {
    return res.json({error: 'invalid url'});
  }

  try {
    parsedUrl = new URL(originalUrl);
  } catch (error) {
    return res.json({error: 'invalid url'});
  }

  if (!['http:', 'https:'].includes(parsedUrl.protocol) || !parsedUrl.hostname.includes('.')) {
    return res.json({error: 'invalid url'});
  }

  dns.lookup(parsedUrl.hostname, function (error) {
    if (error) {
      return res.json({error: 'invalid url'});
    }

    var shortUrl = nextShortUrl++;
    shortUrls.set(shortUrl, originalUrl);
    res.json({original_url: originalUrl, short_url: shortUrl});
  });
});

app.get("/api/shorturl/:shortUrl", function (req, res) {
  var shortUrl = Number(req.params.shortUrl);
  var originalUrl = /^\d+$/.test(req.params.shortUrl) ? shortUrls.get(shortUrl) : undefined;

  if (!originalUrl) {
    return res.status(404).json({error: 'No short URL found'});
  }

  res.redirect(originalUrl);
});

var users = new Map();

app.post("/api/users", function (req, res) {
  var username = typeof req.body.username === 'string' ? req.body.username.trim() : '';

  if (!username) {
    return res.status(400).json({error: 'Username is required'});
  }

  var user = {_id: crypto.randomBytes(12).toString('hex'), username: username};
  users.set(user._id, {user: user, exercises: []});
  res.json(user);
});

app.get("/api/users", function (req, res) {
  res.json(Array.from(users.values(), function (record) {
    return record.user;
  }));
});

app.post("/api/users/:_id/exercises", function (req, res) {
  var record = users.get(req.params._id);

  if (!record) {
    return res.status(404).json({error: 'User not found'});
  }

  var description = typeof req.body.description === 'string' ? req.body.description.trim() : '';
  var duration = Number(req.body.duration);
  var date = req.body.date ? new Date(req.body.date) : new Date();

  if (!description || !Number.isFinite(duration) || duration <= 0 || Number.isNaN(date.getTime())) {
    return res.status(400).json({error: 'Description, positive duration, and a valid date are required'});
  }

  var exercise = {
    description: description,
    duration: duration,
    date: date
  };
  record.exercises.push(exercise);
  res.json({
    _id: record.user._id,
    username: record.user.username,
    description: exercise.description,
    duration: exercise.duration,
    date: exercise.date.toDateString()
  });
});

app.get("/api/users/:_id/logs", function (req, res) {
  var record = users.get(req.params._id);

  if (!record) {
    return res.status(404).json({error: 'User not found'});
  }

  var exercises = record.exercises.slice();
  if (req.query.from) {
    var from = new Date(req.query.from);
    if (!Number.isNaN(from.getTime())) {
      exercises = exercises.filter(function (exercise) {
        return exercise.date >= from;
      });
    }
  }
  if (req.query.to) {
    var to = new Date(req.query.to);
    if (!Number.isNaN(to.getTime())) {
      to.setUTCHours(23, 59, 59, 999);
      exercises = exercises.filter(function (exercise) {
        return exercise.date <= to;
      });
    }
  }
  if (req.query.limit !== undefined) {
    var limit = Number.parseInt(req.query.limit, 10);
    if (Number.isInteger(limit) && limit >= 0) {
      exercises = exercises.slice(0, limit);
    }
  }

  res.json({
    _id: record.user._id,
    username: record.user.username,
    count: record.exercises.length,
    log: exercises.map(function (exercise) {
      return {
        description: exercise.description,
        duration: exercise.duration,
        date: exercise.date.toDateString()
      };
    })
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
