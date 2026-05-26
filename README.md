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

## 🏠 Self-hosted Docker bundle

Zen Weight can run with a self-hosted Supabase stack on a homeserver.

1. Copy the example environment:

```bash
cp .env.example .env
```

2. Edit `.env`:

- Replace every default secret before first start.
- For Tailscale/VPN access, replace `localhost` in `ZENWEIGHT_PUBLIC_URL`, `SUPABASE_PUBLIC_URL`, `API_EXTERNAL_URL`, `SITE_URL`, `ADDITIONAL_REDIRECT_URLS`, and `VITE_SUPABASE_URL` with your stable Tailscale host or IP.
- Use `sh supabase/utils/generate-keys.sh --update-env` to generate local secrets; it also keeps `VITE_SUPABASE_KEY` equal to `ANON_KEY`.

3. Start the bundle:

```bash
docker compose up -d --build
```

4. Open Zen Weight:

```text
http://<your-tailscale-host>:8081
```

Supabase is exposed through Kong on port `8000`. Studio is available through the same gateway and protected by `DASHBOARD_USERNAME` / `DASHBOARD_PASSWORD`.

The first database initialization applies the Zen Weight schema from `supabase/volumes/db/100-zenweight.sql`. Runtime Postgres data is stored in `supabase/volumes/db/data/` and is intentionally ignored by git.

Password reset emails require a real SMTP configuration. The default self-hosted setup autoconfirms email signup so local registration works without SMTP.

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
