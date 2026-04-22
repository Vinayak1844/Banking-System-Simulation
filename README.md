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
│   ├── AccountController.java      # Account creation + fetch my accounts
│   └── TransactionController.java  # Deposit, withdraw, transfer, my statement
├── dto/
│   ├── AuthRequest.java
│   ├── UserRequest.java
│   ├── AccountRequest.java
│   ├── DepositRequest.java
│   ├── WithdrawRequest.java
│   ├── TransferRequest.java
│   └── TransactionResponse.java    # Response DTO for transaction history
├── entity/
│   ├── User.java                   # User with role (ADMIN/USER)
│   ├── Account.java                # Account with type (SAVINGS/CURRENT) and UUID account number
│   ├── Transaction.java            # Transaction record with timestamp
│   ├── AccountType.java            # Enum: SAVINGS, CURRENT
│   ├── TransactionType.java        # Enum: DEPOSIT, WITHDRAW, TRANSFER
│   └── Role.java                   # Enum: ADMIN, USER
├── exception/
│   ├── GlobalExceptionHandler.java # Handles RuntimeException + validation errors
│   ├── BadRequestException.java
│   └── ResourceNotFoundException.java
├── repository/
│   ├── UserRepository.java
│   ├── AccountRepository.java      # findByUser(User)
│   └── TransactionRepository.java  # findByFromAccount_UserOrToAccount_User(...)
├── security/
│   ├── JwtUtil.java                # Token generation & validation (1hr expiry, HS256)
│   ├── JwtFilter.java              # Per-request JWT authentication filter
│   └── CustomUserDetails.java      # UserDetails adapter
└── service/
    ├── UserService.java            # BCrypt password encoding on registration
    ├── AccountService.java         # Auto-assigns UUID account number and linked user
    ├── TransactionService.java     # deposit / withdraw / transfer + ownership checks
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
spring.jpa.properties.hibernate.format_sql=true
server.port=8080
```

> ⚠️ The JWT secret is currently hardcoded in `JwtUtil.java`. Move it to `application.properties` or an environment variable before deploying.

### 4. Build and run

```bash
./mvnw spring-boot:run
```

The server starts at `http://localhost:8080`.

---

## 🔐 Authentication

The API uses **stateless JWT authentication**. Public endpoints are `/auth/**` and `POST /users/register`. All other endpoints require a valid `Bearer` token. Tokens expire after **1 hour**.

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

**Response:** A JWT string. Include it in all subsequent requests:

```
Authorization: Bearer <token>
```

---

## 📡 API Endpoints

All endpoints below require the `Authorization: Bearer <token>` header.

### Accounts

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/accounts/create` | Create a new bank account for the authenticated user |
| `GET` | `/accounts/my` | Fetch all accounts belonging to the authenticated user |

```json
// POST /accounts/create
{
  "email": "john@example.com",
  "accountType": "SAVINGS"
}
```

Account types: `SAVINGS`, `CURRENT`

> On creation, a UUID-based account number is automatically generated and balance is set to `0`.

---

### Transactions

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/transactions/deposit` | Deposit funds into an account |
| `POST` | `/transactions/withdraw` | Withdraw funds from an account |
| `POST` | `/transactions/transfer` | Transfer funds between two accounts |
| `GET` | `/transactions/my/statement` | Get full transaction history for the authenticated user |

```json
// POST /transactions/deposit
{ "accountId": 1, "amount": 500.00 }

// POST /transactions/withdraw
{ "accountId": 1, "amount": 100.00 }

// POST /transactions/transfer
{ "fromId": 1, "toId": 2, "amount": 200.00 }
```

**Transaction Response (GET /transactions/my/statement):**

```json
[
  {
    "id": 1,
    "type": "DEPOSIT",
    "amount": 500.00,
    "time": "2024-11-01T10:30:00",
    "fromAccountId": null,
    "toAccountId": 1
  }
]
```

---

## 🧱 Data Model

```
User ──< Account ──< Transaction
```

- A **User** can have multiple **Accounts** (`SAVINGS` or `CURRENT`), each with an auto-generated UUID account number.
- Each **Transaction** records the amount, type, timestamp, and source/destination accounts.
- For `DEPOSIT`, only `toAccount` is set. For `WITHDRAW`, only `fromAccount` is set. For `TRANSFER`, both are set.
- Transaction types: `DEPOSIT`, `WITHDRAW`, `TRANSFER`.

---

## 🛡️ Security Notes

- Passwords are hashed with **BCrypt** before storage.
- JWT tokens are signed with **HS256** and validated on every request via a servlet filter.
- All transaction operations verify that the acting user owns the source account.
- Sessions are **stateless** — no server-side session is maintained.
- Before deploying, move the JWT secret and DB credentials to environment variables or a secrets manager.

---

## 🚧 Known Issues & Potential Improvements

- `AccountRequest.email` field is accepted but ignored — the account is always linked to the JWT-authenticated user
- `@NotBlank` on `DepositRequest.amount` (a `double`) is a mismatched constraint and has no effect
- JWT secret key is hardcoded in `JwtUtil.java` — should be externalized to config
- `getMyTransactions()` and `getMyAccountStatement()` in `TransactionService` are duplicates — one should be removed
- Add JWT token refresh / logout (token blacklist)
- Add Swagger / OpenAPI documentation
- Write unit and integration tests
- Add pagination for transaction history
- Introduce `ADMIN` role-based access control endpoints
