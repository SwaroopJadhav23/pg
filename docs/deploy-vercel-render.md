# Deploy to Vercel (Frontend) + Render (Backend)

## Architecture

| Service | Platform | Folder |
|---------|----------|--------|
| React frontend | **Vercel** | `frontend/` |
| Express API | **Render** | `backend/` |
| Database | **MongoDB Atlas** | (already configured) |

---

## Step 1 — MongoDB Atlas

1. Open [MongoDB Atlas](https://cloud.mongodb.com) → your cluster.
2. **Network Access** → Add IP Address → **Allow Access from Anywhere** (`0.0.0.0/0`) so Render can connect.
3. Copy your connection string and add a database name, e.g.:
   ```
   mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/om_sai_pg?retryWrites=true&w=majority
   ```

---

## Step 2 — Deploy Backend on Render

1. Go to [render.com](https://render.com) → **New** → **Blueprint** (or **Web Service**).
2. Connect GitHub repo: `SwaroopJadhav23/pg`.
3. If using **Blueprint**, Render reads `render.yaml` from the repo root.
4. If using **Web Service** manually:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Health Check Path:** `/api/health`

### Render environment variables

| Key | Value |
|-----|-------|
| `MONGO_URI` | Your Atlas URI with `/om_sai_pg` |
| `JWT_SECRET` | Long random string |
| `JWT_REFRESH_SECRET` | Different long random string |
| `JWT_EXPIRES_IN` | `7d` |
| `JWT_REFRESH_EXPIRES_IN` | `30d` |
| `CLIENT_ORIGIN` | `https://YOUR-APP.vercel.app` (add localhost too if needed: `http://localhost:5173,https://YOUR-APP.vercel.app`) |

5. Deploy and copy your Render URL, e.g. `https://om-sai-pg-api.onrender.com`.
6. Test: open `https://YOUR-RENDER-URL.onrender.com/api/health` — should return `{ "success": true }`.
7. **Seed super admin** (one time): Render Dashboard → Shell → run:
   ```bash
   npm run seed
   ```
   Login: `superadmin` / `123456`

> **Note:** On Render free tier, uploaded images in `/upload` are stored on ephemeral disk and may be lost after redeploys. For production, use S3/Cloudinary later.

---

## Step 3 — Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New** → **Project**.
2. Import GitHub repo `SwaroopJadhav23/pg`.
3. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### Vercel environment variable

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://YOUR-RENDER-URL.onrender.com/api` |

4. Deploy.

5. Copy your Vercel URL, e.g. `https://om-sai-pg.vercel.app`.

---

## Step 4 — Link Frontend + Backend

1. Go back to **Render** → your API service → **Environment**.
2. Update `CLIENT_ORIGIN` to your real Vercel URL:
   ```
   https://om-sai-pg.vercel.app
   ```
   Or both local + production:
   ```
   http://localhost:5173,https://om-sai-pg.vercel.app
   ```
3. **Save** and let Render redeploy.

---

## Step 5 — Verify

- Landing page loads on Vercel URL
- Login works (`superadmin` / `123456`)
- API calls go to Render (check browser Network tab)
- Property/tenant images load from Render (`/upload`, `/pgimages`)

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| CORS error | Set `CLIENT_ORIGIN` on Render to exact Vercel URL (no trailing slash) |
| API 404 on Vercel | `VITE_API_URL` must end with `/api` |
| MongoDB connection failed | Atlas → allow `0.0.0.0/0`; check URI has DB name |
| Render sleeps (free tier) | First request after idle takes ~30s — normal on free plan |
| Images broken | Ensure `VITE_API_URL` is set; images are served from Render |
