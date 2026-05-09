# 🏦 Banking System Simulation

A full-stack banking application with a **Spring Boot 3** RESTful backend and a **React** frontend, featuring JWT-based authentication, Swagger/OpenAPI documentation, role-based access control, account management, and full transaction support — deposit, withdrawal, and transfer by receiver name.

---

## 🛠️ Tech Stack

### Backend

| Layer        | Technology                                  |
|--------------|---------------------------------------------|
| Framework    | Spring Boot 3.3.5                           |
| Language     | Java 21                                     |
| Security     | Spring Security + JWT (jjwt 0.11.5)         |
| Persistence  | Spring Data JPA + Hibernate                 |
| Database     | MySQL 8                                     |
| Build Tool   | Maven                                       |
| API Docs     | SpringDoc OpenAPI (Swagger UI) 2.6.0        |
| Utilities    | Lombok, Bean Validation (Jakarta), spring-dotenv 4.0.0 |

### Frontend

| Layer     | Technology                  |
|-----------|-----------------------------|
| Framework | React (Vite dev server)     |
| HTTP      | Axios                       |
| Auth      | JWT stored in localStorage  |

---

## 📁 Project Structure

```
Banking-System-Simulation/
├── banking-frontend/                    # React frontend
│   └── src/
│       ├── components/
│       │   ├── DepositForm.jsx
│       │   ├── Navbar.jsx
│       │   ├── PrivateRoute.jsx
│       │   ├── TransactionHistory.jsx
│       │   ├── TransferForm.jsx
│       │   └── WithdrawForm.jsx
│       ├── context/
│       │   └── AuthContext.jsx          # JWT parsing, login/logout state
│       ├── pages/
│       │   ├── Accounts.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Transactions.jsx
│       │   └── admin/
│       │       ├── AdminAccounts.jsx
│       │       ├── AdminDashboard.jsx
│       │       ├── AdminTransactions.jsx
│       │       └── AdminUsers.jsx
│       ├── routes/
│       │   └── ProtectedRoute.jsx
│       └── services/
│           └── api.js                   # Axios instance with JWT interceptor (baseURL: localhost:8080)
└── src/main/java/com/bankingSimulationSystem/workFlow/
    ├── config/
    │   ├── CorsConfig.java              # Dedicated CORS filter bean (localhost:3000 + localhost:5173)
    │   ├── SecurityConfig.java          # JWT filter chain, BCrypt, stateless sessions, CORS, role-based rules
    │   └── OpenApiConfig.java           # Swagger/OpenAPI config with JWT bearer scheme
    ├── controller/
    │   ├── AuthController.java          # POST /auth/login → returns JWT string
    │   ├── UserController.java          # POST /users/register
    │   ├── AccountController.java       # POST /accounts/create, GET /accounts/my
    │   ├── TransactionController.java   # Deposit, withdraw, transfer, statement + GET /transactions/welcome
    │   └── AdminController.java         # GET /admin/users, GET /admin/accounts (ADMIN role only)
    ├── dto/
    │   ├── AuthRequest.java             # { email, password }
    │   ├── UserRequest.java             # { name, email, password } with validation
    │   ├── AccountRequest.java          # { accountType: SAVINGS | CURRENT }
    │   ├── DepositRequest.java          # { accountId, amount } — @Positive on amount only
    │   ├── WithdrawRequest.java         # { accountId, amount } — no validation annotations
    │   ├── TransferRequest.java         # { fromId, receiverName, amount } — @NotNull, @NotBlank, @Positive
    │   ├── TransactionResponse.java     # Response DTO for transaction history
    │   └── ErrorResponse.java           # { message, statusCode, time }
    ├── entity/
    │   ├── User.java                    # id, name, email, password, role
    │   ├── Account.java                 # id, accountType, accountNumber, balance, user
    │   ├── Transaction.java             # id, amount, transactionType, timeStamp, fromAccount, toAccount
    │   ├── AccountType.java             # Enum: SAVINGS, CURRENT
    │   ├── TransactionType.java         # Enum: DEPOSIT, WITHDRAW, TRANSFER
    │   └── Role.java                    # Enum: ADMIN, USER
    ├── exception/
    │   ├── GlobalExceptionHandler.java  # Handles ResourceNotFoundException, BadRequestException, MethodArgumentNotValidException, and generic fallback
    │   ├── BadRequestException.java
    │   └── ResourceNotFoundException.java
    ├── repository/
    │   ├── UserRepository.java          # findByEmail(String), findByNameIgnoreCase(String)
    │   ├── AccountRepository.java       # findByUser(User)
    │   └── TransactionRepository.java   # findByFromAccount_UserOrToAccount_User(User, User), findByFromAccountOrToAccount(Account, Account)
    ├── security/
    │   ├── JwtUtil.java                 # Token generation & validation — secret and expiry read from env vars
    │   ├── JwtFilter.java               # Per-request JWT authentication filter
    │   └── CustomUserDetails.java       # UserDetails adapter
    └── service/
        ├── UserService.java             # BCrypt password encoding on registration
        ├── AccountService.java          # Auto-assigns UUID account number, links authenticated user
        ├── TransactionService.java      # deposit / withdraw / transferByReceiverName + ownership checks
        └── CustomUserDetailsService.java # Loads user by email for Spring Security
```

---

## ⚙️ Getting Started

### Prerequisites

- Java 21+
- Maven 3.8+
- MySQL 8+
- Node.js (for the frontend)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/Banking-System-Simulation.git
cd Banking-System-Simulation
```

### 2. Set up the database

```sql
CREATE DATABASE banking_system;
```

### 3. Configure environment variables

The project uses [spring-dotenv](https://github.com/paulschwarz/spring-dotenv) to load a `.env` file from the project root. Create a `.env` file (never commit this):

```env
DB_URL=jdbc:mysql://localhost:3306/banking_system
DB_USERNAME=your_mysql_username
DB_PASSWORD=your_mysql_password
JWT_SECRET=your-very-long-random-secret-key-here
```

`application.properties` references these variables:

```properties
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRATION=86400000
```

> ⚠️ **Security:** Add `.env` to `.gitignore`. The JWT expiration is set to **24 hours** (86400000 ms). The JWT secret is read via `@Value("${jwt.secret}")` in `JwtUtil` — ensure the key is long enough for HS256 (at least 32 characters).

### 4. Build and run the backend

```bash
./mvnw spring-boot:run
```

The server starts at `http://localhost:8080`.

### 5. Run the frontend

```bash
cd banking-frontend
npm install
npm run dev
```

The Vite dev server starts at `http://localhost:5173`.

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

The API uses **stateless JWT authentication**. Public endpoints are `/auth/**`, `POST /users/register`, and the Swagger docs paths. All other endpoints require a valid `Bearer` token in the `Authorization` header. Tokens are signed with **HS256** and expire after **24 hours** (configurable via `JWT_EXPIRATION`).

The frontend stores the JWT in `localStorage` and attaches it automatically to every request via an Axios interceptor.

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

All newly registered users are assigned the `USER` role automatically. There is no self-registration path for `ADMIN` accounts.

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

| Method | Endpoint                     | Description                                             |
|--------|------------------------------|---------------------------------------------------------|
| `POST` | `/transactions/deposit`      | Deposit funds into an account you own                   |
| `POST` | `/transactions/withdraw`     | Withdraw funds from an account you own                  |
| `POST` | `/transactions/transfer`     | Transfer funds to another user by name                  |
| `GET`  | `/transactions/my/statement` | Get full transaction history for the authenticated user |
| `GET`  | `/transactions/welcome`      | Health-check endpoint — returns a welcome string        |

**Request bodies:**

```json
// POST /transactions/deposit
{ "accountId": 1, "amount": 500.00 }

// POST /transactions/withdraw
{ "accountId": 1, "amount": 100.00 }

// POST /transactions/transfer
{ "fromId": 1, "receiverName": "Jane Doe", "amount": 200.00 }
```

**Validation notes:**
- `deposit` — `@Positive` is declared on `DepositRequest.amount`, but `@Valid` is **not** used on the controller parameter, so Bean Validation is not triggered. Amount validation is enforced manually in `TransactionService` (`amount <= 0` check).
- `withdraw` — `WithdrawRequest` has no validation annotations at all. Amount is validated manually in the service.
- `transfer` — `@Valid` **is** present on the controller parameter; `fromId` is `@NotNull`, `receiverName` is `@NotBlank`, `amount` is `@Positive`.

**Transfer logic:**
Transfers are resolved by receiver **name** (case-insensitive lookup via `findByNameIgnoreCase`), not by account ID. The service finds the receiver user and automatically selects their first account as the destination. If multiple users share the same name, the transfer is rejected with a `400 Bad Request` asking for a unique name. The `from` account must belong to the authenticated user.

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

| Entity        | Key Fields                                                                  |
|---------------|-----------------------------------------------------------------------------|
| `User`        | `id`, `name`, `email`, `password` (BCrypt), `role` (ADMIN / USER)          |
| `Account`     | `id`, `accountType`, `accountNumber` (UUID), `balance`, `user` (FK)        |
| `Transaction` | `id`, `amount`, `transactionType`, `timeStamp`, `fromAccount`, `toAccount`  |

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

| Exception                          | HTTP Status |
|------------------------------------|-------------|
| `ResourceNotFoundException`        | `404`       |
| `BadRequestException`              | `400`       |
| `MethodArgumentNotValidException`  | `400`       |
| Any other `Exception`              | `500`       |

> Note: Validation errors from `MethodArgumentNotValidException` return only the first field error message (not a map of all field errors).

---

## 🌐 CORS

CORS is configured in two places — `CorsConfig` (a dedicated `CorsFilter` bean) and `SecurityConfig` (a `CorsConfigurationSource` bean). Both allow requests from:

- `http://localhost:3000`
- `http://localhost:5173` (Vite dev server)

Allowed methods: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`. All headers are permitted and credentials (`Authorization`) are exposed. Update the allowed origins before deploying to production.

---

## 🛡️ Security Notes

- Passwords are hashed with **BCrypt** before storage.
- JWT tokens are signed with **HS256** and validated on every request via `JwtFilter`.
- The JWT secret and DB credentials are loaded from environment variables via `.env` (spring-dotenv) — do not hardcode or commit them.
- All transaction operations verify that the authenticated user owns the source account.
- Sessions are **stateless** — no server-side session is maintained.
- Admin endpoints are restricted to users with `Role.ADMIN`.
- CSRF is disabled (appropriate for stateless REST APIs).
- The frontend parses the JWT client-side to extract the user role and drive admin route access.

---

## 🚧 Known Issues & Potential Improvements

| Area       | Issue / Improvement                                                                                                      |
|------------|--------------------------------------------------------------------------------------------------------------------------|
| Feature    | JWT token refresh / logout (token blacklist)                                                                             |
| Feature    | Admin user creation endpoint or seeding mechanism (currently requires direct DB insert)                                  |
| Feature    | Pagination for transaction history                                                                                       |
| Feature    | Transfer by receiver name fails silently if a user has multiple accounts — always picks the first account                |
| Feature    | CORS allowed origins are hardcoded — should be configurable via environment variable                                     |
| DX         | Unit and integration tests (only an empty context-load test exists)                                                      |
---

## 🧪 Running Tests

```bash
./mvnw test
```

Only a context-load smoke test exists currently (`WorkFlowApplicationTests`). Integration and unit test coverage is a planned improvement.
