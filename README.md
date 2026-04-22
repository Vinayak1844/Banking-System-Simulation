# 🏦 Banking System Simulation

A RESTful banking backend built with **Spring Boot 3**, featuring JWT-based authentication, account management, and full transaction support — deposit, withdrawal, and transfer.

---

## 🛠️ Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Framework    | Spring Boot 3.3.5                   |
| Language     | Java 21                             |
| Security     | Spring Security + JWT (jjwt 0.11.5) |
| Persistence  | Spring Data JPA + Hibernate         |
| Database     | MySQL 8                             |
| Build Tool   | Maven                               |
| Utilities    | Lombok, Bean Validation (Jakarta)   |

---

## 📁 Project Structure

```
src/main/java/com/bankingSimulationSystem/workFlow/
├── config/
│   └── SecurityConfig.java              # JWT filter chain, BCrypt, stateless sessions
├── controller/
│   ├── AuthController.java              # POST /auth/login → returns JWT string
│   ├── UserController.java              # POST /users/register
│   ├── AccountController.java           # POST /accounts/create, GET /accounts/my
│   └── TransactionController.java       # Deposit, withdraw, transfer, statement
├── dto/
│   ├── AuthRequest.java                 # { email, password }
│   ├── UserRequest.java                 # { name, email, password } with validation
│   ├── AccountRequest.java              # { accountType: SAVINGS | CURRENT }
│   ├── DepositRequest.java              # { accountId, amount }
│   ├── WithdrawRequest.java             # { accountId, amount }
│   ├── TransferRequest.java             # { fromId, toId, amount } with validation
│   └── TransactionResponse.java         # Response DTO for transaction history
├── entity/
│   ├── User.java                        # id, name, email, password, role
│   ├── Account.java                     # id, accountType, accountNumber, balance, user
│   ├── Transaction.java                 # id, amount, transactionType, timeStamp, fromAccount, toAccount
│   ├── AccountType.java                 # Enum: SAVINGS, CURRENT
│   ├── TransactionType.java             # Enum: DEPOSIT, WITHDRAW, TRANSFER
│   └── Role.java                        # Enum: ADMIN, USER
├── exception/
│   ├── GlobalExceptionHandler.java      # Handles RuntimeException + validation errors
│   ├── BadRequestException.java
│   └── ResourceNotFoundException.java
├── repository/
│   ├── UserRepository.java              # findByEmail(String)
│   ├── AccountRepository.java           # findByUser(User)
│   └── TransactionRepository.java       # findByFromAccount_UserOrToAccount_User(User, User)
├── security/
│   ├── JwtUtil.java                     # Token generation & validation (1hr expiry, HS256)
│   ├── JwtFilter.java                   # Per-request JWT authentication filter
│   └── CustomUserDetails.java           # UserDetails adapter
└── service/
    ├── UserService.java                 # BCrypt password encoding on registration
    ├── AccountService.java              # Auto-assigns UUID account number, links authenticated user
    ├── TransactionService.java          # deposit / withdraw / transfer + ownership checks
    └── CustomUserDetailsService.java    # Loads user by email for Spring Security
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
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

server.port=8080
```

> ⚠️ **Security:** The current `application.properties` contains plaintext credentials and the JWT secret is hardcoded in `JwtUtil.java`. Both must be moved to environment variables or a secrets manager before deploying anywhere.

### 4. Build and run

```bash
./mvnw spring-boot:run
```

The server starts at `http://localhost:8080`.

---

## 🔐 Authentication

The API uses **stateless JWT authentication**. Public endpoints are `/auth/**` and `POST /users/register`. All other endpoints require a valid `Bearer` token in the `Authorization` header. Tokens are signed with **HS256** and expire after **1 hour**.

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

Validation rules (enforced via `@Valid`):
- `name` — must not be blank
- `email` — must be a valid email format
- `password` — minimum 6 characters

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response:** A raw JWT string. Include it in all subsequent requests:

```
Authorization: Bearer <token>
```

---

## 📡 API Endpoints

All endpoints below require the `Authorization: Bearer <token>` header.

### Accounts

| Method | Endpoint           | Description                                              |
|--------|--------------------|----------------------------------------------------------|
| `POST` | `/accounts/create` | Create a new bank account for the authenticated user     |
| `GET`  | `/accounts/my`     | Fetch all accounts belonging to the authenticated user   |

**Create account — request body:**

```json
{
  "accountType": "SAVINGS"
}
```

Account types: `SAVINGS`, `CURRENT`

> On creation, a UUID-based account number is automatically generated, the balance is set to `0`, and the account is linked to the currently authenticated user. The `email` field in `AccountRequest` is not used.

---

### Transactions

| Method | Endpoint                   | Description                                            |
|--------|----------------------------|--------------------------------------------------------|
| `POST` | `/transactions/deposit`    | Deposit funds into an account you own                  |
| `POST` | `/transactions/withdraw`   | Withdraw funds from an account you own                 |
| `POST` | `/transactions/transfer`   | Transfer funds between two accounts                    |
| `GET`  | `/transactions/my/statement` | Get full transaction history for the authenticated user |

**Request bodies:**

```json
// POST /transactions/deposit
{ "accountId": 1, "amount": 500.00 }

// POST /transactions/withdraw
{ "accountId": 1, "amount": 100.00 }

// POST /transactions/transfer
{ "fromId": 1, "toId": 2, "amount": 200.00 }
```

> Transfer validates that `fromId ≠ toId` and that the `from` account belongs to the authenticated user. Self-transfers are rejected with a `400 Bad Request`.

**Transaction response (GET `/transactions/my/statement`):**

```json
[
  {
    "id": 1,
    "type": "DEPOSIT",
    "amount": 500.00,
    "time": "2024-11-01T10:30:00",
    "fromAccountId": null,
    "toAccountId": 1
  },
  {
    "id": 2,
    "type": "TRANSFER",
    "amount": 200.00,
    "time": "2024-11-01T11:00:00",
    "fromAccountId": 1,
    "toAccountId": 2
  }
]
```

---

## 🧱 Data Model

```
User ──< Account ──< Transaction (from / to)
```

| Entity        | Key Fields                                                                 |
|---------------|----------------------------------------------------------------------------|
| `User`        | `id`, `name`, `email`, `password` (BCrypt), `role` (ADMIN / USER)         |
| `Account`     | `id`, `accountType`, `accountNumber` (UUID), `balance`, `user` (FK)       |
| `Transaction` | `id`, `amount`, `transactionType`, `timeStamp`, `fromAccount`, `toAccount` |

**Transaction account fields by type:**

| Type       | `fromAccount` | `toAccount` |
|------------|---------------|-------------|
| `DEPOSIT`  | `null`        | set         |
| `WITHDRAW` | set           | `null`      |
| `TRANSFER` | set           | set         |

---

## 🛡️ Security Notes

- Passwords are hashed with **BCrypt** before storage.
- JWT tokens are signed with **HS256** and validated on every request via `JwtFilter`.
- All transaction operations verify that the authenticated user owns the source account.
- Sessions are **stateless** — no server-side session is maintained.
- The JWT secret key is currently hardcoded in `JwtUtil.java`. Externalize it before any deployment.
- The `application.properties` file currently contains real database credentials — do not commit this file; add it to `.gitignore` or use environment-variable substitution.

---

## 🚧 Known Issues & Potential Improvements

| Area | Issue / Improvement |
|------|---------------------|
| Security | Hardcoded JWT secret in `JwtUtil.java` — move to `application.properties` or an environment variable |
| Feature | JWT token refresh / logout (token blacklist) |
| Feature | `ADMIN` role-based access control endpoints |
| Feature | Pagination for transaction history |
| DX | Swagger / OpenAPI documentation |
| DX | Unit and integration tests (only an empty context-load test exists) |

---

## 🧪 Running Tests

```bash
./mvnw test
```

Only a context-load smoke test exists currently (`WorkFlowApplicationTests`). Integration and unit test coverage is a planned improvement.
