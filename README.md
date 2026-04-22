# 🏦 Banking System Simulation

A RESTful banking backend built with **Spring Boot 3**, featuring JWT-based authentication, account management, and full transaction support (deposit, withdrawal, transfer).

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Spring Boot 3.3.5 |
| Language | Java 21 |
| Security | Spring Security + JWT (jjwt 0.11.5) |
| Persistence | Spring Data JPA + Hibernate |
| Database | MySQL |
| Build Tool | Maven |
| Utilities | Lombok |

---

## 📁 Project Structure

```
src/main/java/com/bankingSimulationSystem/workFlow/
├── config/
│   └── SecurityConfig.java         # JWT filter chain, BCrypt, stateless sessions
├── controller/
│   ├── AuthController.java         # Login → returns JWT
│   ├── UserController.java         # User registration
│   ├── AccountController.java      # Account creation
│   └── TransactionController.java  # Deposit, withdraw, transfer, history
├── dto/
│   ├── AuthRequest.java
│   ├── UserRequest.java
│   ├── AccountRequest.java
│   ├── DepositRequest.java
│   ├── WithdrawRequest.java
│   └── TransferRequest.java
├── entity/
│   ├── User.java                   # User with role (ADMIN/USER)
│   ├── Account.java                # Account with type (SAVINGS/CURRENT)
│   ├── Transaction.java            # Transaction record with timestamp
│   ├── AccountType.java            # Enum: SAVINGS, CURRENT
│   ├── TransactionType.java        # Enum: DEPOSIT, WITHDRAW, TRANSFER
│   └── Role.java                   # Enum: ADMIN, USER
├── exception/
│   ├── GlobalExceptionHandler.java
│   ├── BadRequestException.java
│   └── ResourceNotFoundException.java
├── repository/
│   ├── UserRepository.java
│   ├── AccountRepository.java
│   └── TransactionRepository.java
├── security/
│   ├── JwtUtil.java                # Token generation & validation
│   ├── JwtFilter.java              # Per-request JWT authentication filter
│   └── CustomUserDetails.java      # UserDetails adapter
└── service/
    ├── UserService.java
    ├── AccountService.java
    ├── TransactionService.java
    └── CustomUserDetailsService.java
```

---

## ⚙️ Getting Started

### Prerequisites

- Java 21+
- Maven 3.8+
- MySQL 8+

### 1. Clone the repository

```bash
git clone https://github.com/your-username/Banking-System-Simulation.git
cd Banking-System-Simulation
```

### 2. Set up the database

```sql
CREATE DATABASE banking_system;
```

### 3. Configure `application.properties`

Edit `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/banking_system
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
server.port=8080
```

### 4. Build and run

```bash
./mvnw spring-boot:run
```

The server starts at `http://localhost:8080`.

---

## 🔐 Authentication

The API uses **stateless JWT authentication**. Public endpoints are `/auth/**` and `POST /users/register`. All other endpoints require a valid `Bearer` token.

### Register a user

```http
POST /users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response:** A JWT string. Include it in subsequent requests:

```
Authorization: Bearer <token>
```

---

## 📡 API Endpoints

All endpoints below require the `Authorization: Bearer <token>` header.

### Accounts

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/accounts/create` | Create a new bank account |

```json
// POST /accounts/create
{
  "email": "john@example.com",
  "accountType": "SAVINGS"
}
```

Account types: `SAVINGS`, `CURRENT`

---

### Transactions

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/transactions/deposit` | Deposit funds into an account |
| `POST` | `/transactions/withdraw` | Withdraw funds from an account |
| `POST` | `/transactions/transfer` | Transfer funds between accounts |
| `GET` | `/transactions/account/{id}` | Get transaction history for an account |

```json
// POST /transactions/deposit
{ "accountId": 1, "amount": 500.00 }

// POST /transactions/withdraw
{ "accountId": 1, "amount": 100.00 }

// POST /transactions/transfer
{ "fromId": 1, "toId": 2, "amount": 200.00 }
```

---

## 🧱 Data Model

```
User ──< Account ──< Transaction
```

- A **User** can have multiple **Accounts** (SAVINGS or CURRENT).
- Each **Transaction** records the amount, type, timestamp, and the source/destination accounts.
- Transaction types: `DEPOSIT`, `WITHDRAW`, `TRANSFER`.

---

## 🛡️ Security Notes

- Passwords are hashed with **BCrypt** before storage.
- JWT tokens are validated on every request via a servlet filter.
- Sessions are **stateless** — no server-side session is maintained.
- Before deploying, move sensitive config (DB credentials, JWT secret) to environment variables or a secrets manager.

---

## 🚧 Potential Improvements

- Add JWT secret key configuration via `application.properties`
- Implement token refresh / logout (token blacklist)
- Add Swagger / OpenAPI documentation
- Write unit and integration tests
- Add pagination for transaction history
- Introduce `ADMIN` role-based access control
