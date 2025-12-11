# Template - Next.js SaaS Boilerplate

## Overview
Template is a Next.js 15 boilerplate for building SaaS applications, AI tools, and web apps. It includes authentication via Supabase, Stripe payments, and a modern UI built with Tailwind CSS 4 and DaisyUI.

## Project Structure
```
app/                    # Next.js App Router pages
  api/                  # API routes (auth, stripe, webhooks)
  blog/                 # Blog pages with MDX support
  dashboard/            # Protected dashboard area
  signin/               # Authentication pages
components/             # Reusable React components
libs/                   # Utility libraries
  supabase/             # Supabase client configuration
  stripe.ts             # Stripe configuration
  resend.ts             # Email sending via Resend
public/                 # Static assets
types/                  # TypeScript type definitions
```

## Tech Stack
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 4 + DaisyUI 5
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **Email**: Resend
- **Language**: TypeScript

## Development
- Run: `npm run dev` (starts on port 5000)
- Build: `npm run build`
- Start: `npm start`

## Environment Variables
Required secrets:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

Optional (for full functionality):
- `STRIPE_SECRET_KEY` - Stripe secret key for payments
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `RESEND_API_KEY` - Resend API key for emails

## Configuration
Main configuration is in `config.ts` including:
- App name and description
- Stripe plans and pricing
- Email settings
- Authentication URLs
- Theme colors

## Deployment
The app is configured for deployment on Replit with autoscaling support.

## Code Conventions & ESLint Rules

### French Text & Apostrophes
- ESLint rule `react/no-unescaped-entities` is **disabled globally** in `.eslintrc.json`
- You can write French text with apostrophes directly in JSX: `Appel à l'action`, `Que fais l'app`, etc.
- No need to escape apostrophes with `{`'`}` or `&apos;` - use plain text

### JSX Text Guidelines
- Direct apostrophes in JSX text are allowed: ✅ `"Appel à l'action"`
- HTML entities in JSX text are not needed: ✅ Use plain apostrophe, not `&apos;`
- Keep spacing consistent and use template strings for dynamic content

### Future Development
- Maintain these ESLint settings for all French language content
- If modifying `.eslintrc.json`, keep `"react/no-unescaped-entities": "off"`
