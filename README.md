# File Metadata Microservice

An Express API that reports metadata for uploaded files.

## Endpoints

- `POST /api/fileanalyse` with a multipart file field named `upfile`: returns
  the uploaded file's `name`, MIME `type`, and `size` in bytes. Uploads are
  held in memory and limited to 10 MB.
- `POST /api/users` with `username`: creates and returns a user.
- `GET /api/users`: returns all users.
- `POST /api/users/:_id/exercises` with `description`, `duration`, and optional
  `date`: adds an exercise and returns its details.
- `GET /api/users/:_id/logs` with optional `from`, `to`, and `limit`: returns
  the user's exercise log and total exercise count.
- `POST /api/shorturl` with a form field named `url`: returns the original URL
  and a numeric short URL ID.
- `GET /api/shorturl/:short_url`: redirects to the saved URL.
- `GET /api/whoami`: returns the request IP address, preferred language, and
  browser software (user-agent).
- `GET /api/`: current time
- `GET /api/:date`: a date string or Unix timestamp in milliseconds

Run locally with `npm start`. User, exercise, and short URL data is held in
memory and resets when the service restarts.
