# Tax-Down Service

A microservice-based application for managing customer information, built with Node.js, TypeScript, and AWS services.

## 🏗️ Architecture

This service follows Clean Architecture principles and is built using:

- TypeScript
- Fastify
- AWS Lambda
- DynamoDB
- AWS Cognito
- Docker
- Jest for testing

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- AWS CLI (for local development)
- pnpm (recommended) or npm

### 🐳 Running with Docker

1. Clone the repository:
```bash
git clone [https://github.com/your-repo/tax-down.git](https://github.com/Wcamaly/tax-down.git)
cd tax-down
```

2. Build and run the containers:
```bash
docker-compose up --build
```

This will start:
- LocalStack (AWS services emulator)
- DynamoDB local
- The application service

### 🔧 Local Development

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Run the development server:
```bash
pnpm dev
```

## 🧪 Testing

### Running Unit Tests

```bash
cd customer
# Run all tests
pnpm test
```

### Running E2E Tests

```bash
# Make sure Docker is running
cd e2e
pnpm test:e2e
```

## 📁 Project Structure

```
src/
├── application/        # Application business rules
│   └── customer/
├── domain/            # Enterprise business rules
│   ├── entities/
│   └── repositories/
├── infrastructure/    # Frameworks and drivers
│   ├── config/
│   ├── delivers/
│   └── repositories/
└── handler.ts         # AWS Lambda handler
```

## 🛠️ Available Scripts

- `pnpm test`: Run tests


## 📝 API Documentation

### Endpoints

#### Customer

- `GET /customer/:customerId` - Get customer by ID
- `GET /customer/user/:cognitoId` - Get customer by Cognito ID
- `POST /customer` - Create new customer
- `PUT /customer/:customerId` - Update customer
- `DELETE /customer/:customerId` - Delete customer

#### Salary Records

- `POST /salary-record` - Add new salary record
- `GET /salary-record/:customerId` - Get customer'\''s salary records


### Video Example

![Video Example](https://github.com/Wcamaly/tax-down/blob/main/doc/example.mp4)


