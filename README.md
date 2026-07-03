# Om Sai PG Management System

A complete MERN stack PG management starter with one frontend and one backend project.

## Roles

- Student / PG Resident
- Admin / Caretaker / Manager
- Super Admin / Owner

## Run Backend

```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```

## Run Frontend

```bash
cd frontend
npm install
npm run dev
```

## Demo Logins

- Student: `student@pg.test` / `Password@123`
- Admin: `admin@pg.test` / `Password@123`
- Super Admin: `owner@pg.test` / `Password@123`

## API Groups

- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/auth/seed-demo`
- `GET /api/student/dashboard`
- `GET /api/admin/dashboard`
- `GET /api/super-admin/dashboard`

## Production Notes

- Set strong unique values for `JWT_SECRET` and `JWT_REFRESH_SECRET`.
- Keep `CLIENT_ORIGIN` restricted to your deployed frontend URL.
- Run MongoDB with indexes enabled; schemas define indexes for role/property/status, rent, complaints, visitors, staff, expenses and audit logs.
- Frontend routes are code-split for faster initial load.
- API requests use JWT access tokens with refresh-token rotation.
- Mutating authenticated requests are tracked in audit/activity logs.
