# Request Header Parser Microservice

An Express API that reports request header details and parses dates into Unix
milliseconds and UTC strings.

## Endpoints

- `GET /api/whoami`: returns the request IP address, preferred language, and
  browser software (user-agent).
- `GET /api/`: current time
- `GET /api/:date`: a date string or Unix timestamp in milliseconds

Example: `GET /api/1451001600000` returns
`{"unix":1451001600000,"utc":"Fri, 25 Dec 2015 00:00:00 GMT"}`.
Invalid dates return `{"error":"Invalid Date"}`.

Run locally with `npm start`. The app trusts the immediate reverse proxy when
resolving the client IP address.
