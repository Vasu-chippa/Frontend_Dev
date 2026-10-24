# URL Shortener Microservice

An Express API for creating and redirecting short URLs. Submitted links must
use HTTP or HTTPS and resolve to a dotted hostname.

## Endpoints

- `POST /api/shorturl` with a form field named `url`: returns the original URL
  and a numeric short URL ID.
- `GET /api/shorturl/:short_url`: redirects to the saved URL.
- Invalid links return `{"error":"invalid url"}`.
- `GET /api/whoami`: returns the request IP address, preferred language, and
  browser software (user-agent).
- `GET /api/`: current time
- `GET /api/:date`: a date string or Unix timestamp in milliseconds

Run locally with `npm start`. Short URL mappings are held in memory and reset
when the service restarts.
