# Deploying Dream International on Netlify + Neon

Everything runs on **one Netlify site**: the React site, `/admin` CMS UI, and `/api` backend.

## Architecture

| URL | What |
|-----|------|
| `yoursite.com/` | Public website |
| `yoursite.com/admin` | CMS admin panel |
| `yoursite.com/api/*` | Express API (Netlify Function) |

Database: **Neon PostgreSQL** (free tier)  
Image uploads: **Cloudinary** (free tier — required on Netlify for CMS uploads)

---

## Step 1 — Neon database

1. Create account at [neon.tech](https://neon.tech)
2. Create a project → copy the **PostgreSQL connection string**
3. Format: `postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`

**Never commit or share this string.** Set it only in Netlify environment variables.

---

## Step 2 — Cloudinary (for CMS image uploads)

1. Create account at [cloudinary.com](https://cloudinary.com)
2. Dashboard → copy **Cloud name**, **API Key**, **API Secret**

---

## Step 3 — Netlify site

1. Go to [netlify.com](https://netlify.com) → **Add new site** → **Import an existing project**
2. Connect GitHub → select `alpineroottech/DreamInternational`
3. Branch: `master`
4. Netlify reads `netlify.toml` automatically:
   - **Build command:** `npm run netlify-build`
   - **Publish directory:** `build`
   - **Functions:** `netlify/functions`

### Environment variables (Site settings → Environment variables)

Add these for **Production** (and **Deploy previews** if you want):

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
| `SEED_ADMIN_PASSWORD` | Strong password |
| `SEED_ADMIN_NAME` | Admin display name |
| `NODE_ENV` | `production` |

After you add a custom domain, also set:

| Variable | Value |
|----------|--------|
| `CLIENT_ORIGIN` | `https://yourdomain.com` |

5. Click **Deploy site**

On first deploy, the build runs `prisma migrate deploy` (creates tables) and builds the React app.

### Seed the database (first time only)

After the first successful deploy, run seed once from your machine:

```bash
cd server
cp .env.example .env
# Edit .env with your Neon DATABASE_URL and seed credentials
npm install
npx prisma db seed
```

**Change the admin password immediately after first login.**

---

## Step 4 — Verify

1. Open `https://your-site.netlify.app`
2. API health: `https://your-site.netlify.app/api/health` → `{"ok":true,...}`
3. Admin: `https://your-site.netlify.app/admin`
4. Log in, edit content, confirm the homepage updates

---

## Local development

```bash
# Terminal 1 — API
cd server
cp .env.example .env   # Neon DATABASE_URL + secrets
npm install
npx prisma generate
npx prisma migrate deploy
npm run seed           # first time only
npm run dev

# Terminal 2 — frontend
cd ..
npm install
npm start
```

### Optional: Netlify Dev (proxies /api locally)

```bash
npm install -g netlify-cli
netlify login
netlify dev
```

Runs the site at `http://localhost:8888` with functions proxied like production.

---

## GitHub

- Repo: `https://github.com/alpineroottech/DreamInternational`
- Branch: `master`
- Push to `master` → Netlify auto-redeploys

---

## Security notes

- `JWT_SECRET` is required in production
- Admin routes require JWT + role checks
- HTML content is sanitized on write and render
- Rate limiting on login and inquiries
- Never commit `.env` files

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails on `migrate deploy` | Set `DATABASE_URL` in Netlify env vars |
| `/admin` blank or 404 | Hard refresh; confirm SPA redirect in `netlify.toml` |
| API 403 CORS | Set `CLIENT_ORIGIN` to your exact Netlify URL |
| Image upload fails | Set all three `CLOUDINARY_*` variables |
| Function timeout | Large uploads may hit 26s limit — use images under 8 MB |
| Cold start slow | Normal on Netlify free tier after idle time |
