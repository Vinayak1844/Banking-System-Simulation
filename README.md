# 🏦 Banking System Simulation

A RESTful banking backend built with **Spring Boot 3**, featuring JWT-based authentication, Swagger/OpenAPI documentation, role-based access control, account management, and full transaction support — deposit, withdrawal, and transfer.

---

## 🛠️ Tech Stack

| Layer        | Technology                                  |
|--------------|---------------------------------------------|
| Framework    | Spring Boot 3.3.5                           |
| Language     | Java 21                                     |
| Security     | Spring Security + JWT (jjwt 0.11.5)         |
| Persistence  | Spring Data JPA + Hibernate                 |
| Database     | MySQL 8                                     |
| Build Tool   | Maven                                       |
| API Docs     | SpringDoc OpenAPI (Swagger UI) 2.6.0        |
| Utilities    | Lombok, Bean Validation (Jakarta)           |

---

## 📁 Project Structure

```
src/main/java/com/bankingSimulationSystem/workFlow/
├── config/
│   ├── SecurityConfig.java              # JWT filter chain, BCrypt, stateless sessions, role-based rules
│   └── OpenApiConfig.java               # Swagger/OpenAPI config with JWT bearer scheme
├── controller/
│   ├── AuthController.java              # POST /auth/login → returns JWT string
│   ├── UserController.java              # POST /users/register
│   ├── AccountController.java           # POST /accounts/create, GET /accounts/my
│   ├── TransactionController.java       # Deposit, withdraw, transfer, statement
│   └── AdminController.java             # GET /admin/users, GET /admin/accounts (ADMIN role only)
├── dto/
│   ├── AuthRequest.java                 # { email, password }
│   ├── UserRequest.java                 # { name, email, password } with validation
│   ├── AccountRequest.java              # { accountType: SAVINGS | CURRENT }
│   ├── DepositRequest.java              # { accountId, amount }
│   ├── WithdrawRequest.java             # { accountId, amount }
│   ├── TransferRequest.java             # { fromId, toId, amount } with validation
│   ├── TransactionResponse.java         # Response DTO for transaction history
│   └── ErrorResponse.java               # { message, statusCode, time }
├── entity/
│   ├── User.java                        # id, name, email, password, role
│   ├── Account.java                     # id, accountType, accountNumber, balance, user
│   ├── Transaction.java                 # id, amount, transactionType, timeStamp, fromAccount, toAccount
│   ├── AccountType.java                 # Enum: SAVINGS, CURRENT
│   ├── TransactionType.java             # Enum: DEPOSIT, WITHDRAW, TRANSFER
│   └── Role.java                        # Enum: ADMIN, USER
├── exception/
│   ├── GlobalExceptionHandler.java      # Handles ResourceNotFoundException, BadRequestException, validation errors, and generic fallback
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
spring.application.name=workFlow
spring.datasource.url=jdbc:mysql://localhost:3306/banking_system
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

server.port=8080
```

> ⚠️ **Security:** The current `application.properties` contains plaintext credentials and the JWT secret is hardcoded in `JwtUtil.java`. Both must be moved to environment variables or a secrets manager before deploying anywhere. Do **not** commit `application.properties` — add it to `.gitignore`.

### 4. Build and run

```bash
./mvnw spring-boot:run
```

The server starts at `http://localhost:8080`.

---

## 📖 API Documentation (Swagger UI)

The project includes **SpringDoc OpenAPI** with a pre-configured JWT bearer security scheme. Once the server is running, open:

```
http://localhost:8080/swagger-ui/index.html
```

The Swagger UI lets you explore and test every endpoint interactively. To authorize, click **Authorize**, enter your `Bearer <token>`, and all subsequent requests will include it automatically.

The raw OpenAPI spec is available at:

```
http://localhost:8080/v3/api-docs
```

These docs endpoints are publicly accessible (no token required).

---

## 🔐 Authentication

The API uses **stateless JWT authentication**. Public endpoints are `/auth/**`, `POST /users/register`, and the Swagger docs paths. All other endpoints require a valid `Bearer` token in the `Authorization` header. Tokens are signed with **HS256** and expire after **1 hour**.

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

### Public Endpoints (no token required)

| Method | Endpoint           | Description             |
|--------|--------------------|-------------------------|
| `POST` | `/users/register`  | Register a new user     |
| `POST` | `/auth/login`      | Login and receive a JWT |
| `GET`  | `/swagger-ui/**`   | Swagger UI              |
| `GET`  | `/v3/api-docs/**`  | OpenAPI spec            |

### Accounts (requires Bearer token)

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

> On creation, a UUID-based account number is automatically generated, the balance is set to `0`, and the account is linked to the currently authenticated user.

---

### Transactions (requires Bearer token)

| Method | Endpoint                     | Description                                            |
|--------|------------------------------|--------------------------------------------------------|
| `POST` | `/transactions/deposit`      | Deposit funds into an account you own                  |
| `POST` | `/transactions/withdraw`     | Withdraw funds from an account you own                 |
| `POST` | `/transactions/transfer`     | Transfer funds between two accounts                    |
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

### Admin Endpoints (requires ADMIN role)

| Method | Endpoint          | Description                      |
|--------|-------------------|----------------------------------|
| `GET`  | `/admin/users`    | List all registered users        |
| `GET`  | `/admin/accounts` | List all accounts in the system  |

> Access is restricted to users with the `ADMIN` role, enforced via Spring Security's `hasRole("ADMIN")` rule. To create an ADMIN user, set the role directly in the database — there is no self-registration path for admin accounts.

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

## ⚠️ Error Responses

All errors return a structured `ErrorResponse` JSON body:

```json
{
  "message": "Insufficient Balance",
  "statusCode": 400,
  "time": "2024-11-01T11:05:00"
}
```

| Exception                        | HTTP Status |
|----------------------------------|-------------|
| `ResourceNotFoundException`      | `404`       |
| `BadRequestException`            | `400`       |
| `MethodArgumentNotValidException`| `400`       |
| Any other `Exception`            | `500`       |

---

## 🛡️ Security Notes

- Passwords are hashed with **BCrypt** before storage.
- JWT tokens are signed with **HS256** and validated on every request via `JwtFilter`.
- All transaction operations verify that the authenticated user owns the source account.
- Sessions are **stateless** — no server-side session is maintained.
- Admin endpoints are restricted to users with `Role.ADMIN`.
- The JWT secret key is currently hardcoded in `JwtUtil.java`. Externalize it before any deployment.
- The `application.properties` file currently contains real database credentials — do not commit this file; add it to `.gitignore` or use environment-variable substitution.

---

## 🚧 Known Issues & Potential Improvements

| Area     | Issue / Improvement                                                                            |
|----------|-----------------------------------------------------------------------------------------------|
| Security | Hardcoded JWT secret in `JwtUtil.java` — move to `application.properties` or an env variable  |
| Security | `application.properties` contains plaintext DB credentials — use env vars or a secrets manager |
| Feature  | JWT token refresh / logout (token blacklist)                                                  |
| Feature  | Admin user creation endpoint or seeding mechanism (currently requires direct DB insert)        |
| Feature  | Pagination for transaction history                                                            |
| Bug      | `WithdrawRequest` has no `@Valid` annotation on the controller — amount validation is missing  |
| DX       | Unit and integration tests (only an empty context-load test exists)                           |

---

## 🧪 Running Tests

```bash
./mvnw test
```

Only a context-load smoke test exists currently (`WorkFlowApplicationTests`). Integration and unit test coverage is a planned improvement.
