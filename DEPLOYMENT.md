# Complete hosting guide (first time)

Deploy **Dream International Travel and Tours** on:

| Service | What it does | Cost |
|---------|----------------|------|
| **GitHub** | Stores your code | Free |
| **Neon** | Database (tours, pages, CMS content) | Free |
| **Supabase** | Image file storage only | Free |
| **Netlify** | Website + admin + API (one URL) | Free |

You will end up with one live URL like:

`https://dream-international.netlify.app`

- Homepage → `/`
- CMS admin → `/admin`
- API → `/api/health`

---

## Before you start

You need:

- A **GitHub account** (your code is already at `alpineroottech/DreamInternational`)
- An **email address** for Neon, Supabase, and Netlify
- About **45–60 minutes**

**Important:** Neon = database. Supabase = images only. Do **not** use Supabase’s database for this project.

---

# Part 1 — Neon (database)

### 1.1 Create account

1. Open [https://neon.tech](https://neon.tech)
2. Click **Sign up** (use GitHub or email)
3. Verify your email if asked

### 1.2 Create a project

1. On the Neon dashboard, click **New Project**
2. **Project name:** `dream-international` (any name is fine)
3. **Region:** pick one close to you (e.g. `Asia Pacific (Singapore)` if you’re in Nepal)
4. **Postgres version:** leave default
5. Click **Create project**

### 1.3 Copy the connection string

1. After the project loads, find **Connection string** on the main page
2. Make sure the dropdown says **URI** (not JDBC, etc.)
3. Click **Copy** — it looks like:

   ```
   postgresql://neondb_owner:XXXX@ep-xxxx.region.aws.neon.tech/neondb?sslmode=require
   ```

4. Paste it into a **private note** (Notepad, password manager).  
   This is your `DATABASE_URL`. **Never share it publicly or commit it to GitHub.**

### 1.4 (Optional) Reset password

If you ever exposed this string, go to **Project → Settings → Reset password** and copy the new connection string.

**Neon is done.** Keep `DATABASE_URL` for Part 4.

---

# Part 2 — Supabase (image storage)

Supabase stores **uploaded images** from the CMS media library. Your text/content still lives in Neon.

### 2.1 Create account

1. Open [https://supabase.com](https://supabase.com)
2. Click **Start your project** / **Sign up**
3. Sign in with GitHub (easiest) or email

### 2.2 Create a project

1. Click **New project**
2. **Organization:** use default or create one
3. **Project name:** `dream-international-media`
4. **Database password:** generate a strong password and **save it** (you won’t need it for this setup — we use Neon for DB — but keep it safe)
5. **Region:** pick closest to you
6. Click **Create new project**
7. Wait 1–2 minutes until status is **Active**

### 2.3 Create a public storage bucket

1. In the left sidebar, click **Storage**
2. Click **New bucket**
3. **Name of bucket:** `media` (use exactly this — or remember the name for env vars)
4. Turn **ON** → **Public bucket**  
   (so your website can show images without extra auth)
5. Click **Create bucket**

You should see a bucket named `media` in the list.

### 2.4 Get API keys

1. Left sidebar → **Project Settings** (gear icon at bottom)
2. Click **API** in the settings menu
3. Copy these two values:

| Label on screen | Your env variable |
|-----------------|-------------------|
| **Project URL** | `SUPABASE_URL` |
| **service_role** key (under Project API keys → click **Reveal**) | `SUPABASE_SERVICE_ROLE_KEY` |

**Warning:** The `service_role` key is secret. It bypasses all security.  
- ✅ Put it in **Netlify environment variables** and `server/.env` locally  
- ❌ Never put it in React code, GitHub, or chat messages

**Supabase is done.** You should have:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET` = `media`

---

# Part 3 — Generate a JWT secret

Your CMS login needs a random secret.

1. Open [https://generate-secret.vercel.app/32](https://generate-secret.vercel.app/32)  
   — or run in terminal: `openssl rand -base64 32`
2. Copy the random string
3. Save it as `JWT_SECRET`

---

# Part 4 — Netlify (host everything)

### 4.1 Create account

1. Open [https://www.netlify.com](https://www.netlify.com)
2. Click **Sign up**
3. Choose **GitHub** to connect (recommended)

### 4.2 Import your GitHub repo

1. On Netlify dashboard, click **Add new site**
2. Click **Import an existing project**
3. Click **GitHub** (or **GitHub Enterprise** if applicable)
4. If asked, **authorize Netlify** to access your GitHub account
5. Find and select **`alpineroottech/DreamInternational`** (or `DreamInternational`)
6. On the build settings screen you should see:

   | Field | Value (auto from `netlify.toml`) |
   |-------|----------------------------------|
   | Branch to deploy | `master` |
   | Build command | `npm run netlify-build` |
   | Publish directory | `build` |

7. **Do not click Deploy yet** — add environment variables first (next step)

### 4.3 Add environment variables

Still on the setup screen (or go to **Site configuration → Environment variables**):

Click **Add environment variables** and add **each row** below.

| Key | Value | Notes |
|-----|--------|--------|
| `DATABASE_URL` | Paste your Neon connection string | From Part 1 |
| `JWT_SECRET` | Paste your random secret | From Part 3, 32+ characters |
| `REACT_APP_API_URL` | `/api` | Exactly this, no https |
| `SUPABASE_URL` | `https://xxxxx.supabase.co` | From Part 2 |
| `SUPABASE_SERVICE_ROLE_KEY` | Long key starting with `eyJ...` | service_role from Supabase |
| `SUPABASE_STORAGE_BUCKET` | `media` | Your bucket name |
| `SUPABASE_STORAGE_FOLDER` | `uploads` | Optional folder inside bucket |
| `SEED_ADMIN_EMAIL` | `you@yourcompany.com` | Your admin login email |
| `SEED_ADMIN_PASSWORD` | `YourStrongPassword123!` | Change after first login |
| `SEED_ADMIN_NAME` | `Dream Admin` | Display name |
| `RESEND_API_KEY` | `re_...` | From [Resend](https://resend.com/api-keys) — contact & flight form emails |
| `RESEND_FROM_EMAIL` | `Dream International <noreply@yourdomain.com>` | Verified sender in Resend; use `onboarding@resend.dev` only for testing |
| `RESEND_ADMIN_EMAIL` | `info@yourdomain.com` | Inbox for new inquiry notifications (optional; falls back to CMS contact email) |
| `NODE_ENV` | `production` | |

**Scopes:** check **Production** and **Deploy previews** for all variables.

Click **Deploy site** (or **Save** then **Trigger deploy → Deploy site**).

### 4.4 Wait for the build

1. You’ll see a **Deploying** screen with a log
2. First build takes **3–8 minutes**
3. **Success** = green **Published** badge  
4. If it **fails**, open the log and check:
   - `DATABASE_URL` missing or wrong → fix in Environment variables → **Retry deploy**
   - Prisma error → confirm Neon project is running

### 4.5 Note your live URL

1. On the site overview, find **Production domains**
2. Copy something like: `https://random-name-123.netlify.app`
3. This is your live site URL

---

# Part 5 — Seed the database (first time only)

The build creates empty tables. You need to add the admin user and demo content once.

### 5.1 On your computer

1. Open terminal in the project folder
2. Run:

```bash
cd server
cp .env.example .env
```

3. Open `server/.env` in a text editor and fill in:

```
DATABASE_URL="your-neon-connection-string"
JWT_SECRET="same-as-netlify"
SUPABASE_URL="https://xxxxx.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
SUPABASE_STORAGE_BUCKET="media"
SUPABASE_STORAGE_FOLDER="uploads"
SEED_ADMIN_EMAIL="you@yourcompany.com"
SEED_ADMIN_PASSWORD="YourStrongPassword123!"
SEED_ADMIN_NAME="Dream Admin"
```

4. Run:

```bash
npm install
npx prisma generate
npx prisma db seed
```

5. You should see messages about creating admin user and content.

---

# Part 6 — Verify everything works

### 6.1 API health check

Open in browser:

```
https://YOUR-SITE.netlify.app/api/health
```

Expected:

```json
{"ok":true,"service":"dream-cms","env":"production","host":"serverless"}
```

### 6.2 Homepage

Open:

```
https://YOUR-SITE.netlify.app
```

You should see the Dream International homepage.

### 6.3 Admin login

1. Open: `https://YOUR-SITE.netlify.app/admin`
2. Log in with `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`
3. Change your password after first login (recommended)

### 6.4 Test image upload

1. In admin, go to **Media** (or open any tour/destination editor)
2. Upload a test image
3. In Supabase → **Storage** → **media** → **uploads**, you should see the file
4. The image should display on the site when you assign it to content

---

# Part 7 — Custom domain (optional, later)

1. Netlify → your site → **Domain management**
2. Click **Add a domain** → enter `dreaminternationaltours.com`
3. Follow Netlify’s DNS instructions at your domain registrar
4. After the domain works, add in **Environment variables**:

   | Key | Value |
   |-----|--------|
   | `CLIENT_ORIGIN` | `https://dreaminternationaltours.com` |

5. **Trigger deploy** again

---

# Part 8 — Updating the site later

When code changes are pushed to GitHub:

```bash
git add .
git commit -m "your message"
git push origin master
```

Netlify **automatically rebuilds** within a few minutes.

---

# Quick reference — all environment variables

| Variable | Where to get it |
|----------|-----------------|
| `DATABASE_URL` | Neon → Connection string |
| `JWT_SECRET` | You generate (32+ random chars) |
| `REACT_APP_API_URL` | Always `/api` |
| `SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → service_role |
| `SUPABASE_STORAGE_BUCKET` | Bucket name you created (`media`) |
| `SUPABASE_STORAGE_FOLDER` | `uploads` (optional) |
| `SEED_ADMIN_EMAIL` | You choose |
| `SEED_ADMIN_PASSWORD` | You choose |
| `CLIENT_ORIGIN` | Your custom domain (optional) |

---

# Troubleshooting

| Problem | What to do |
|---------|------------|
| Build fails: migration syntax error / `﻿` | Migration file had a BOM — pull latest `master`, then clear failed migration (see below) |
| Build fails: `P3018` migration failed | Run `npx prisma migrate resolve --rolled-back 20260617000000_init_postgresql` in `server/` with your Neon `DATABASE_URL`, then redeploy |
| `/admin` shows blank page | Hard refresh (Ctrl+F5); check browser console |
| Login fails | Re-run `npx prisma db seed` with correct `DATABASE_URL` |
| Upload fails | Check all 3 `SUPABASE_*` vars; bucket must be **public** |
| Images don’t show | Confirm bucket is public; check file appears in Supabase Storage |
| API 403 CORS | Add `CLIENT_ORIGIN` with exact site URL (no trailing slash) |
| Site slow first load | Normal on free tier (cold start after idle time) |

---

# Security checklist

- [ ] `JWT_SECRET` is long and random
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is **only** in Netlify env vars and local `server/.env`
- [ ] `DATABASE_URL` is **never** committed to GitHub
- [ ] Admin password changed after first login
- [ ] Neon password rotated if it was ever shared publicly

---

# Local development (optional)

**Terminal 1 — API:**

```bash
cd server
cp .env.example .env   # fill in Neon + Supabase vars
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
```

**Terminal 2 — website:**

```bash
npm install
npm start
```

Site: `http://localhost:3000`  
API: `http://localhost:4000`
