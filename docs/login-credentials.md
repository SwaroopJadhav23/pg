# Login Credentials (Localhost)

Use these demo accounts to access the Om Sai PG Management System on localhost.

**Login page:** http://localhost:5173/login

**Default password for all accounts:** `Password@123`

---create

## Login Credentials (Email / Password)

| Role | Email (ID) | Password | Main Dashboard Link |
|------|------------|----------|---------------------|
| Student | `student@pg.test` | `Password@123` | http://localhost:5173/student |
| Admin | `admin@pg.test` | `Password@123` | http://localhost:5173/admin |
| Super Admin | `owner@pg.test` | `Password@123` | http://localhost:5173/super-admin |
| Admin (Mumbai) | `mumbai.admin@pg.test` | `Password@123` | http://localhost:5173/admin |

---

## How to Use

1. Start the backend:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Open http://localhost:5173/login

4. Sign in with any email and password from the table above.

5. You will be redirected to the dashboard for your role automatically.

---

## Reset Demo Users

If login fails, re-seed the database:

```bash
cd backend
npm run seed
```
