# Deploying Dream International on Vercel + Neon

Everything runs on **one Vercel project**: the React site, `/admin` CMS UI, and `/api` backend.

## Architecture

| URL | What |
|-----|------|
| `yoursite.com/` | Public website |
| `yoursite.com/admin` | CMS admin panel |
| `yoursite.com/api/*` | Express API (serverless) |

Database: **Neon PostgreSQL** (free tier)  
Image uploads on Vercel: **Cloudinary** (free tier)

---

## Step 1 — Neon database

1. Create account at [neon.tech](https://neon.tech)
2. Create a project → copy the **PostgreSQL connection string**
3. It looks like: `postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`

---

## Step 2 — Cloudinary (for CMS image uploads)

1. Create account at [cloudinary.com](https://cloudinary.com)
2. Dashboard → copy **Cloud name**, **API Key**, **API Secret**

---

## Step 3 — Vercel project

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import GitHub repo: `alpineroottech/DreamInternational`
3. Framework: **Create React App** (auto-detected)
4. Root directory: `.` (default)
5. `vercel.json` in the repo sets build/install commands automatically

### Environment variables (Vercel → Settings → Environment Variables)

Set for **Production**, **Preview**, and **Development**:

| Variable | Value |
|----------|--------|
| `DATABASE_URL` | Your Neon connection string |
| `JWT_SECRET` | Random string, 32+ characters |
| `REACT_APP_API_URL` | `/api` |
| `CLOUDINARY_CLOUD_NAME` | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | From Cloudinary dashboard |
| `CLOUDINARY_FOLDER` | `dream-international` (optional) |
| `SEED_ADMIN_EMAIL` | Your admin email |
| `SEED_ADMIN_PASSWORD` | Strong password (first deploy only) |
| `SEED_ADMIN_NAME` | Admin display name |
| `NODE_ENV` | `production` |

After you add a custom domain, also set:

| Variable | Value |
|----------|--------|
| `CLIENT_ORIGIN` | `https://yourdomain.com` |

6. Click **Deploy**

On first deploy, the build runs `prisma migrate deploy` (creates tables) and `npm run build`.

### Seed the database (first time only)

After first successful deploy, run seed once from your machine:

```bash
cd server
cp .env.example .env
# Edit .env with your Neon DATABASE_URL and seed credentials
npm install
npx prisma db seed
```

Or use Vercel CLI: `vercel env pull` then run seed locally against Neon.

Default seed login (if you use defaults): see `server/.env.example` — **change the password immediately after first login**.

---

## Step 4 — Verify

1. Open `https://your-project.vercel.app`
2. Check API: `https://your-project.vercel.app/api/health` → `{"ok":true,...}`
3. Admin: `https://your-project.vercel.app/admin`
4. Log in, edit homepage content, confirm changes appear on the site

---

## Local development

```bash
# Terminal 1 — API
cd server
cp .env.example .env   # fill in Neon DATABASE_URL
npm install
npx prisma generate
npx prisma migrate deploy
npm run seed           # first time only
npm run dev

# Terminal 2 — frontend
cd ..
npm install
# Optional: .env with REACT_APP_API_URL=http://localhost:4000/api
npm start
```

---

## GitHub

- Repo: `https://github.com/alpineroottech/DreamInternational`
- Branch: `master`
- Push to `master` → Vercel auto-redeploys

---

## Security notes

- `JWT_SECRET` is required in production (app refuses weak/missing secrets)
- Admin routes require JWT + role checks
- HTML content is sanitized on write and render
- Rate limiting on login and inquiries
- Never commit `.env` files (already in `.gitignore`)

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails on `migrate deploy` | Ensure `DATABASE_URL` is set in Vercel env |
| `/admin` shows blank page | Hard refresh; check browser console |
| API 403 CORS | Set `CLIENT_ORIGIN` to your exact site URL |
| Image upload fails | Set all three `CLOUDINARY_*` variables |
| Cold start slow | Normal on Vercel free tier after idle time |
