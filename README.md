# Zen Weight

A minimalist weight tracking app built with React and Vite. Log your weight, track trends, and stay calm about the numbers.

## Features

- Weight logging with date and time
- 7-day trend chart (1w / 1m / 1y)
- Goal progress with milestones
- Configurable tracking strategy (last entry, 7-day average, or lowest weight)
- Full auth flow (sign in, register, password reset)
- Mobile-first: bottom tab bar on mobile, top header on desktop

## Tech stack

- **React 19** + Vite
- **Tailwind CSS v4**
- **Zustand** — state management
- **Recharts** — trend chart
- **Supabase** — auth + database
- **react-router-dom v7**

## Getting started

```bash
npm install
```

Create a `.env` file with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_anon_key
```

```bash
npm run dev   # dev server
npm run build # production build
```

## Homelab deployment

Zen Weight ships with a Docker Compose bundle that includes a self-hosted Supabase stack. Default ports are intentionally uncommon:

- Zen Weight app: `38181`
- Supabase/Kong HTTP gateway: `38001`
- Supabase/Kong HTTPS gateway: `38443`

### First deployment

```bash
cp .env.example .env
# Edit .env — replace all secrets and localhost URLs with your server IP or hostname
sh supabase/utils/generate-keys.sh --update-env  # generate local secrets
docker compose up -d --build
```

Open `http://<your-server>:38181`.

After changing `VITE_SUPABASE_URL` or `VITE_SUPABASE_KEY` (embedded at build time), rebuild:

```bash
docker compose build zenweight && docker compose up -d
```

To stop without deleting data:

```bash
docker compose down
```

Avoid `docker compose down -v` — it deletes the database volumes.

### Password reset

Requires a real SMTP config in `.env`. The default self-hosted setup autoconfirms email signup so local registration works without SMTP.
