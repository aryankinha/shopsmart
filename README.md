# ShopSmart

A small, clean e-commerce storefront - React frontend, Node.js + Express backend, MongoDB Atlas database.

## Stack
| Layer      | Tech                        |
|------------|-----------------------------|
| Frontend   | React, Vite, React Router   |
| Backend    | Node.js, Express, Mongoose  |
| Database   | MongoDB Atlas               |
| Deployment | Render (backend + frontend) |

## Local Development

### Prerequisites
- Node.js 20+
- A MongoDB Atlas connection string (free tier works fine)

### Setup
```bash
git clone https://github.com/aryankinha/shopsmart
cd shopsmart
bash setup.sh

# Backend env
cp server/.env.example server/.env
# Open server/.env and fill in MONGODB_URI

# Frontend env
cp client/.env.example client/.env
# VITE_API_URL defaults to http://localhost:5000/api - leave as-is for local dev

# Start backend
cd server && npm run dev

# Start frontend (new terminal)
cd client && npm run dev
```

## API Endpoints
| Method | Endpoint          | Description       |
|--------|-------------------|-------------------|
| GET    | /api/products     | List all products |
| GET    | /api/products/:id | Get one product   |
| POST   | /api/products     | Create a product  |
| PUT    | /api/products/:id | Update a product  |
| DELETE | /api/products/:id | Delete a product  |

## Folder Structure

shopsmart/
├── client/
│   └── src/
│       ├── components/   # Reusable UI components
│       ├── pages/        # Route-level page components
│       ├── hooks/        # Custom React hooks
│       ├── services/     # API call functions
│       ├── styles/       # All CSS files
│       └── tests/        # Test files
└── server/
	├── models/           # Mongoose models
	├── routes/           # Express route handlers
	└── config/           # DB connection etc.

## Deployment
Deployed on Render. Set `MONGODB_URI` and `FRONTEND_URL` as environment variables in the Render dashboard before deploying.
