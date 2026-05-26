# Zen Weight

A modern, minimalist weight tracking application built with Vue 3 and Vite. Zen Weight helps you monitor your weight journey with a clean, intuitive interface and powerful tracking features.

## 🌟 Features

- **Weight Tracking**: Easily log your daily weight with date and time
- **Progress Monitoring**: Track your weight changes with detailed statistics
- **Goal Setting**: Set and monitor your weight goals
- **Data Visualization**: View your weight trends and averages
- **User Settings**: Customize your experience with various options
- **Secure Authentication**: User accounts with email/password authentication
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/zen-weight.git
cd zen-weight
```

2. Install dependencies:

```bash
npm install
```

--

3. Create a `.env` file in the root directory with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_key
```

4. Start the development server:

```bash
npm run dev
```

5. Build for production:

```bash
npm run build
```

## 🏠 Homelab deployment

Zen Weight can run on a homelab server with Docker Compose. The compose bundle includes the Zen Weight frontend and a self-hosted Supabase stack, so you do not need a separate hosted Supabase project.

Default ports are intentionally uncommon to avoid collisions with other homelab services:

- Zen Weight app: `38181`
- Supabase/Kong HTTP gateway: `38001`
- Supabase/Kong HTTPS gateway: `38443`

For a server at `192.168.1.140`, the app will be available at `http://192.168.1.140:38181`.

### Server prerequisites

Install Docker and Docker Compose on the server, then copy the repository to a stable directory such as:

```bash
/opt/zen-weight
```

If copying from your workstation, exclude generated directories:

```bash
rsync -av --exclude node_modules --exclude dist ./ laperlanegra@192.168.1.140:/opt/zen-weight/
```

### First deployment

1. Copy the example environment:

```bash
cp .env.example .env
```

2. Edit `.env`:

- Replace every default secret before first start.
- Replace `localhost` in `ZENWEIGHT_PUBLIC_URL`, `SUPABASE_PUBLIC_URL`, `API_EXTERNAL_URL`, `SITE_URL`, `ADDITIONAL_REDIRECT_URLS`, and `VITE_SUPABASE_URL` with your server IP, DNS name, or Tailscale host.
- Use `sh supabase/utils/generate-keys.sh --update-env` to generate local secrets; it also keeps `VITE_SUPABASE_KEY` equal to `ANON_KEY`.

Example LAN values:

```env
ZENWEIGHT_HTTP_PORT=38181
ZENWEIGHT_PUBLIC_URL=http://192.168.1.140:38181

KONG_HTTP_PORT=38001
KONG_HTTPS_PORT=38443

SUPABASE_PUBLIC_URL=http://192.168.1.140:38001
API_EXTERNAL_URL=http://192.168.1.140:38001

SITE_URL=http://192.168.1.140:38181
ADDITIONAL_REDIRECT_URLS=http://192.168.1.140:38181/reset-password

VITE_SUPABASE_URL=http://192.168.1.140:38001
```

3. Start the bundle:

```bash
docker compose up -d --build
```

4. Open Zen Weight:

```text
http://<your-server-ip-or-host>:38181
```

Supabase is exposed through Kong on port `38001`. Studio is available through the same gateway and protected by `DASHBOARD_USERNAME` / `DASHBOARD_PASSWORD`.

If you later expose the app through Tailscale, a domain, or a reverse proxy, update all public URL values in `.env` to that stable external host, especially `ZENWEIGHT_PUBLIC_URL`, `SUPABASE_PUBLIC_URL`, `API_EXTERNAL_URL`, `SITE_URL`, `ADDITIONAL_REDIRECT_URLS`, and `VITE_SUPABASE_URL`. Because Vite embeds `VITE_SUPABASE_URL` and `VITE_SUPABASE_KEY` when building the frontend image, rebuild after changing those values:

```bash
docker compose build zenweight
docker compose up -d
```

The first database initialization applies the Zen Weight schema from `supabase/volumes/db/100-zenweight.sql`. Runtime Postgres data is stored in `supabase/volumes/db/data/` and is intentionally ignored by git.

Password reset emails require a real SMTP configuration. The default self-hosted setup autoconfirms email signup so local registration works without SMTP.

To stop the stack without deleting data:

```bash
docker compose down
```

Avoid `docker compose down -v` unless you intentionally want to delete the database volumes.

## 🛠️ Tech Stack

- **Frontend Framework**: Vue 3
- **Build Tool**: Vite
- **State Management**: Pinia
- **Styling**: TailwindCSS
- **Authentication**: Supabase Auth
- **Database**: Supabase
- **Routing**: Vue Router

## 📱 Features in Detail

### Weight Tracking

- Log your weight with date and time
- Edit or delete previous entries
- View your weight history in a clean timeline

### Progress Summary

- Last recorded weight
- Previous weight for comparison
- 10-day average weight
- Weight trend indicators

### User Configuration

- Customizable weight units (kg/lbs)
- Adjustable tracking period
- Notification preferences
- Account management

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Vue.js team for the amazing framework
- Supabase team for the backend infrastructure
- All contributors who help improve this project
