# auction-microservice

**auction-microservice** is a set of independently deployable services powering a real-time auction platform.

## 🚀 Architecture

- services/database – shared schema & migrations
- services/item – CRUD APIs for auction items
- services/user-profile – user registration & profile management
- services/bidding – bidding logic, validation & pub/sub
- services/frontend – React + Vite client

Each service is implemented in TypeScript, exposes a REST API, and (for bidding) uses Ably for real-time events.

## 🛠️ Prerequisites

- Docker ≥ 20.10
- Docker Compose v2

## ⚙️ Setup with Docker Compose

```bash
# Clone the repo
git clone https://github.com/<your-org>/auction-microservice.git
cd auction-microservice

# Build and start all services
docker-compose up --build
```

By default, this will start:

- PostgreSQL on port 5432
- Item service on http://localhost:4200
- User‐profile service on http://localhost:4000
- Bidding service on http://localhost:4100
- Frontend on http://localhost:8080

## ▶️ Running Locally

If you need to rebuild or start/stop services:

```bash
docker-compose up --build       # build and start all services

docker-compose down             # stop and remove containers, networks, volumes
```

## 📑 API Reference

- Item service:  
  • GET `/items`  
  • POST `/items`  
  • GET `/items/:id`  
  • PUT `/items/:id`  
  • DELETE `/items/:id`
- User‐profile service:  
  • POST `/users`  
  • GET `/users/:id`
- Bidding service:  
  • GET `/bid/:itemId`  
  • POST `/bid/:itemId`
- Real‐time channels (Ably):  
  • `bid` (global)  
  • `bid:item:{itemId}` (per-item)

## 🧪 Testing

```bash
pnpm test
```

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch
3. Submit a PR

## 📄 License

MIT
