# Timestamp API

A small Express API that returns Unix milliseconds and a UTC date string for
the supplied date.

## Endpoints

- `GET /api/`: current time
- `GET /api/:date`: a date string or Unix timestamp in milliseconds

Example: `GET /api/1451001600000` returns
`{"unix":1451001600000,"utc":"Fri, 25 Dec 2015 00:00:00 GMT"}`.
Invalid dates return `{"error":"Invalid Date"}`.

Run locally with `npm start`.
