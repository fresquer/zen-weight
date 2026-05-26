# ZenWeight self-hosting

This deployment uses the official Supabase self-hosted Docker stack plus a ZenWeight frontend container.

## First start

```bash
cp .env.example .env
```

Before the first `docker compose up`, edit `.env` and replace all default secrets. At minimum, change:

- `POSTGRES_PASSWORD`
- `JWT_SECRET`
- `ANON_KEY`
- `SERVICE_ROLE_KEY`
- `DASHBOARD_USERNAME`
- `DASHBOARD_PASSWORD`
- `SECRET_KEY_BASE`
- `VAULT_ENC_KEY`
- `PG_META_CRYPTO_KEY`
- `LOGFLARE_PUBLIC_ACCESS_TOKEN`
- `LOGFLARE_PRIVATE_ACCESS_TOKEN`

Supabase's helper scripts are included under `supabase/utils`:

```bash
sh supabase/utils/generate-keys.sh
```

For Tailscale, use the same stable host in all public URLs:

```env
ZENWEIGHT_PUBLIC_URL=http://your-host.tailnet.ts.net:38181
SUPABASE_PUBLIC_URL=http://your-host.tailnet.ts.net:38001
API_EXTERNAL_URL=http://your-host.tailnet.ts.net:38001
SITE_URL=http://your-host.tailnet.ts.net:38181
ADDITIONAL_REDIRECT_URLS=http://your-host.tailnet.ts.net:38181/reset-password
VITE_SUPABASE_URL=http://your-host.tailnet.ts.net:38001
```

`supabase/utils/generate-keys.sh --update-env` also updates `VITE_SUPABASE_KEY` to match `ANON_KEY`. Vite embeds this value while building the frontend image, so rebuild ZenWeight after changing it:

```bash
docker compose build zenweight
docker compose up -d
```

## Running

```bash
docker compose up -d --build
docker compose ps
```

Open ZenWeight at `http://your-host.tailnet.ts.net:38181`.

Supabase API and Studio are served through Kong at `http://your-host.tailnet.ts.net:38001`. Do not expose this port directly to the public internet without HTTPS, a reverse proxy, and strong credentials.

## Data and backups

The Postgres data directory is `supabase/volumes/db/data/`. Back it up before upgrades.

For a SQL dump:

```bash
docker compose exec db pg_dump -U postgres -d postgres > zenweight-backup.sql
```

To stop the stack without deleting data:

```bash
docker compose down
```

Avoid `docker compose down -v` unless you intentionally want to delete named volumes.
