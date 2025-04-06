# Klaralyze

Klaralyze is a powerful analytics platform for Zendesk data, providing insights and visualizations to help improve customer support performance.

## Features

- Zendesk integration with real-time data sync
- Beautiful analytics dashboard
- Agent performance metrics
- Ticket analytics and insights
- Modern, responsive UI
- Secure authentication with Supabase

## Tech Stack

- Next.js 13 (App Router)
- TypeScript
- Supabase (Auth & Database)
- Tailwind CSS
- Zendesk API

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

The project is set up for easy deployment on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Add your environment variables
4. Deploy! 