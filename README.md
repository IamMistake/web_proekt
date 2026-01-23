# tech-store-backend

## Local Development

1. Install dependencies:
   - `npm install`
2. Start the backend:
   - `npm run server`

## Docker Compose

Run backend + MongoDB locally:
- `docker-compose up --build`

The API will be available at `http://localhost:5000` and MongoDB at `mongodb://localhost:27017/techstore`.

## DB Maintenance

Use the maintenance page (non-production or with admin token):
- `http://localhost:5000/db`

Endpoints:
- `POST /db/clear`
- `POST /db/seed`

## Swagger

- JSON: `http://localhost:5000/api/swagger.json`
- UI: `http://localhost:5000/api/docs/`
