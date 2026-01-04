# Wallety

A secure digital wallet API built with Node.js, Express, and PostgreSQL. Wallety enables users to manage their wallets, transfer funds, and handle payment requests.

## Features

- User authentication with JWT
- Wallet management with transaction history
- Fund deposits and transfers between users
- Payment request system (create, accept, reject)
- Comprehensive API documentation with Swagger
- PostgreSQL database with Prisma ORM
- Docker support for easy deployment

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT with bcryptjs
- **Validation**: Zod
- **Documentation**: Swagger (swagger-jsdoc + swagger-ui-express)
- **Containerization**: Docker & Docker Compose

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v15)
- Docker and Docker Compose (optional)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd Wallety
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fintech_wallet_db"
JWT_SECRET=your_jwt_secret_here
PORT=3000
NODE_ENV=development
```

4. Start PostgreSQL using Docker:

```bash
docker-compose up -d
```

5. Run database migrations:

```bash
npx prisma migrate deploy
```

6. Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## API Documentation

Once the server is running, access the Swagger documentation at:

```
http://localhost:3000/api-docs
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token

### Wallet

- `POST /api/wallet/deposit` - Deposit funds to your wallet
- `POST /api/wallet/transfer` - Transfer funds to another user
- `GET /api/wallet/history` - Get paginated transaction history

### Payment Requests

- `POST /api/request/request` - Create a payment request
- `GET /api/request/incoming` - Get all incoming payment requests
- `PATCH /api/request/:id/reject` - Reject a payment request
- `PATCH /api/request/:id/pay` - Accept and pay a payment request

All endpoints except authentication require a Bearer token in the Authorization header.

## Scripts

```bash
npm run dev          # Start development server with nodemon
npm run build        # Compile TypeScript to JavaScript
npm start            # Run production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
```

## Database Schema

The application uses four main models:

- **User**: Stores user credentials and profile
- **Wallet**: Manages user balance and currency
- **Transaction**: Records all deposits and transfers
- **Request**: Handles payment requests between users

## Docker Deployment

Build and run with Docker:

```bash
# Build the image
docker build -t wallety-api .

# Run the container
docker run -p 3000:3000 --env-file .env wallety-api
```

Or use Docker Compose for the full stack:

```bash
docker-compose up
```

## Project Structure

```
src/
├── @types/          # TypeScript type definitions
├── config/          # Configuration files (Swagger, etc.)
├── lib/             # Database client initialization
├── middleware/      # Auth, validation, error handling
├── modules/         # Feature modules (auth, wallet, payment-request)
│   ├── auth/
│   ├── wallet/
│   └── payment-request/
├── utils/           # Helper functions
├── app.ts           # Express app setup
└── server.ts        # Server entry point
```

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Helmet.js for HTTP headers security
- Input validation with Zod schemas
- Prepared statements via Prisma (SQL injection prevention)

## License

ISC
