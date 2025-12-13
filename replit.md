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
- Escape apostrophes with HTML entity `&apos;` in JSX: `Appel à l&apos;action`, `Que fais l&apos;app`
- This prevents ESLint `react/no-unescaped-entities` errors during deployment

### Utility Functions
- `cn()` function in `lib/utils.ts` uses clsx for conditional class merging
- Import: `import { cn } from "@/lib/utils"`
- Usage: `className={cn("base-class", condition && "conditional-class")}`

### Design Components
- **GridBackground** (`components/GridBackground.tsx`): Animated grid background with radial fade
  - Used in hero sections for modern aesthetic
  - Adapts to light/dark mode automatically

## Admin System
- Admin emails are defined in `libs/admin.ts`
- Current admins: `dropposting40@gmail.com`
- Admin dashboard: `/admin` (protected, server-side verification)
- API route `/api/user/check-admin` verifies admin status server-side
- ButtonAccount shows "Admin" button only for verified admins

### Adding New Admins
Edit `libs/admin.ts` and add email to `ADMIN_EMAILS` array:
```typescript
const ADMIN_EMAILS = [
  "dropposting40@gmail.com",
  "new-admin@example.com",  // add new admins here
];
```

## Dashboard UI
- **Left Sidebar**: Aceternity UI responsive sidebar with smooth animations
  - Collapses on hover (desktop), expandable menu on mobile
  - Dark mode support
  - Quick links: Dashboard, Settings
  - User account button integrated
- **Header**: Dashboard title and welcome message
- **Main Content Area**: Full-width layout with responsive grid

### Sidebar Components
Located in `components/ui/sidebar.tsx`:
- `Sidebar` - Main container
- `SidebarBody` - Layout with responsive desktop/mobile views
- `SidebarLink` - Individual navigation links with icons
- Uses `framer-motion` for smooth animations

### Dependencies
- `framer-motion` - Animation library
- `@tabler/icons-react` - Icon set
