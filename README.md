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

## SPA (Part 4)

Run client:
- `npm install --prefix client`
- `npm start --prefix client`

Routes mapped from `del1/`:
- `/auth` (login/register)
- `/products` (list)
- `/products/:id` (detail)
- `/cart`
- `/compare`
- `/search`
- `/integration`
- `/admin/products` (list)
- `/admin/products/add`
- `/admin/products/:id/edit`
- `/admin/categories`
- `/admin/features`
- `/admin/suppliers`
- `/admin/orders`
- `/admin/statistics`

Roles:
- Guest: demo product list and view-only screens.
- Customer: login + orders/cart checkout.
- Admin: add/delete products and admin screens.

Allowed input values:
- Email: `^\S+@\S+\.\S+$`
- Password: min 6 chars, at least 1 digit.
- Phone: `^(\+389)?\s?\d{2}\s?\d{3}\s?\d{3}$`
- Card number: 16 digits
- CVV: 3 digits
- Expiry: `MM/YY`
