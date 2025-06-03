# ThinkTapFlow

A modern SaaS application for automated content generation.

## Environment Variables Setup

1. Copy the template from `config/env.template.txt`
2. Create two new files:
   - `.env.local` (for local development)
   - `.env.production` (for production)
3. Replace the placeholder values with your actual credentials

Required environment variables:

```bash
# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="ThinkTapFlow"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="your-project-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Google AI
GOOGLE_AI_API_KEY="your-google-ai-api-key"
GOOGLE_AI_MODEL="gemini-pro"

# Paddle
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN="your-paddle-client-token"
PADDLE_SECRET_KEY="your-paddle-secret-key"
PADDLE_WEBHOOK_SECRET="your-paddle-webhook-secret"
```

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase (Auth & Database)
- Google Generative AI
- Paddle (Payments)

## Project Structure

```
thinktapflow/
├── app/                          # Next.js 14 App Router
│   ├── (auth)/                  # Auth group
│   │   ├── login/
│   │   └── signup/
│   ├── dashboard/               # Protected dashboard
│   │   ├── history/
│   │   ├── billing/
│   │   └── settings/
│   ├── pricing/
│   └── api/                     # API routes
├── components/                   # Reusable components
│   ├── ui/                      # shadcn/ui components
│   ├── layout/                  # Layout components
│   ├── auth/                    # Auth components
│   ├── dashboard/               # Dashboard components
│   ├── landing/                 # Landing page components
│   └── common/                  # Common components
├── lib/                         # Utility functions
├── hooks/                       # Custom React hooks
├── types/                       # TypeScript types
└── public/                      # Static assets
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local` and fill in the required environment variables
4. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `GOOGLE_AI_API_KEY`: Your Google AI API key
- `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN`: Your Paddle client token
- `PADDLE_SECRET_KEY`: Your Paddle secret key

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier