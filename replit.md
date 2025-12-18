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
- Run: `bun run dev` (starts on port 5000)
- Build: `bun run build`
- Start: `bun start`

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

## Couleur de Thème Centralisée

La couleur de thème est maintenant centralisée pour faciliter les modifications futures.

### Où changer la couleur de thème:
**Fichier:** `app/globals.css`

Modifier les variables CSS au début du fichier (section `:root`):
```css
:root {
  --theme-color-hue: 259;        /* Teinte (0-360) */
  --theme-color-sat: 83%;        /* Saturation (0-100%) */
  --theme-color-light: 50%;      /* Luminosité (0-100%) */
}
```

### Exemples de couleurs (HSL):
- **Bleu:** hue: 217, sat: 100%, light: 50%
- **Rouge:** hue: 0, sat: 100%, light: 50%
- **Vert:** hue: 120, sat: 100%, light: 50%
- **Orange:** hue: 39, sat: 100%, light: 50%
- **Violet:** hue: 280, sat: 100%, light: 50%

### Classes CSS centralisées (dans globals.css):
- `.icon-theme-bg` - Arrière-plan léger de la couleur de thème
- `.icon-theme-bg-subtle` - Arrière-plan très léger pour les icônes
- `.icon-theme-text` - Texte dans la couleur de thème

Ces classes sont utilisées dans les composants qui affichent des icônes colorées (ButtonPopover, BetterIcon, etc.) et s'updateront automatiquement quand vous changerez les variables de thème.

## Deployment
The app is configured for deployment on Replit with autoscaling support.

## Logging System (December 18, 2025)

### Complete Unified Logging System
A professional, enterprise-grade logging utility has been implemented across the entire application:

**Location:** `lib/logger.ts` - Centralized logger module
**Features:**
- 4 log levels: DEBUG, INFO, WARN, ERROR
- Environment-aware: DEBUG level in development, WARN+ in production
- Formatted timestamps (ISO 8601)
- Context tracking (module name, user ID, request ID)
- Performance timers for API calls
- User action logging
- Color-coded console output (browser)

**Integration Points:**
- `libs/api.ts` - API interceptor logging with status codes
- `libs/gpt.ts` - OpenAI API call tracking
- `libs/stripe.ts` - Stripe operation logging
- `libs/resend.ts` - Email delivery tracking
- `app/api/lead/route.ts` - Lead capture logging
- `app/api/stripe/*` - Stripe webhook and checkout logging
- `app/api/admin/users/route.ts` - Admin operation logging

**Usage in New Modules:**
```typescript
import { createModuleLogger } from "@/lib/logger";
const logger = createModuleLogger("ModuleName");

logger.debug("Debug message", { context: "value" });
logger.info("Info message", { key: "value" });
logger.warn("Warning message", { optional: "context" });
logger.error("Error message", errorObject, { additional: "context" });

// Performance tracking
const timer = logger.startTimer("Operation name");
// ... do work ...
timer(); // logs duration

// API call logging
logger.logApiCall("GET", "/api/endpoint", 200, 150);

// User action tracking
logger.logUserAction("user_logged_in", userId, { source: "email" });
```

**Benefits:**
- Clean code - no scattered console.log statements
- Easy debugging - all logs go through one system
- Environment-aware - production logs only errors
- Structured - context makes debugging faster
- Performance monitoring - built-in timer utilities

## Recent Fixes (December 16, 2025)

### Authentication Flow - Complete Rewrite
- **Robust session polling**: Uses `useEffect` to poll session status every 100ms for up to 2 seconds
- **Signup flow**: Sets `hasSignedUp` flag, triggers useEffect that checks for session establishment
- **Signin flow**: Sets `shouldRedirect` flag, triggers useEffect that checks for session establishment
- **Input protection**: Inputs disabled during authentication to prevent duplicate submissions
- **Error handling**: Proper error states without double state updates
- **Removed**: AnimatedTabsSection component (replaced with custom FeaturesSection)

### New Components
- **FeaturesSection** (`components/FeaturesSection.tsx`): Custom interactive features showcase with 3 tabs
  - Automatisation Intelligente
  - Analytics en Temps Réel
  - Intégration Totale
  - Fully custom CSS with fadeIn animations

## Build Optimization

### Package Import Optimization
Next.js includes a built-in `optimizePackageImports` feature that tree-shakes heavy dependencies:

**Current optimized packages:**
- `@headlessui/react` - UI components
- `@tabler/icons-react` - Icons (3000+ icons, must tree-shake)
- `daisyui` - Tailwind component library
- `framer-motion` - Animation library for smooth transitions
- `react-hot-toast` - Toast notifications
- `react-tooltip` - Tooltip component

**Note:** Removed `aceternity-ui` dependency - all UI components are now custom-built for better performance and compatibility

This setting dramatically reduces first build time (from minutes to seconds) by only bundling what you actually import.

**Note:** These optimizations are automatically applied. Your imports are already optimal - you're importing specific components, not entire modules. ✅

### If Build Times Still Slow:
1. Clear `.next` folder: `rm -rf .next`
2. Rebuild fresh: `npm run build`
3. Monitor with: `npm run build -- --debug`

## Color Scheme & Design
### White-First Design
- **Background**: All components use white (`bg-white`) background
- **Text**: Dark gray text (`text-gray-900`, `text-gray-600`, `text-gray-700`)
- **Borders**: Light gray borders (`border-gray-200`)
- **No Mode Switching**: No dark mode - always white background with dark text

### Custom Components (No Aceternity)
All UI components are custom-built for optimal performance:
- **GridBackground** (`components/GridBackground.tsx`): White grid with subtle gray lines
- **HeroHighlight** (`components/ui/hero-highlight.tsx`): White background container
- **Highlight** (animated text): Blue gradient text on white background
- **Header** (`components/Header.tsx`): White header with gray text navigation
- **Sidebar** (`components/ui/sidebar.tsx`): White sidebar with light gray borders

## Code Conventions & ESLint Rules

### French Text & Apostrophes
- Escape apostrophes with HTML entity `&apos;` in JSX: `Appel à l&apos;action`, `Que fais l&apos;app`
- This prevents ESLint `react/no-unescaped-entities` errors during deployment

### Utility Functions
- `cn()` function in `lib/utils.ts` uses clsx for conditional class merging
- Import: `import { cn } from "@/lib/utils"`
- Usage: `className={cn("base-class", condition && "conditional-class")}`

## Authentication
- **Email/Password**: Users can sign up and sign in with email + password
  - Signup page: `/signup` - Creates account with mandatory name
  - Signin page: `/signin` - Login with email/password  
  - Password minimum: 6 characters
  - **Auto-redirect**: 500ms delay ensures session is established before redirect to `/dashboard`
- **Google OAuth**: Continue with Google button (redirects via `/api/auth/callback`)
- Supabase Auth handles all authentication
- After successful auth, users are automatically redirected to `/dashboard`
- Dashboard is protected - non-authenticated users are redirected to `/signin`

## Admin System
- Admin emails are defined in `libs/admin.ts`
- Current admins: `dropposting40@gmail.com`
- Two admin interfaces:
  - **Admin Dashboard** (`/admin/dashboard`) - Overview avec statistiques (nombre d'utilisateurs)
  - **User Management** (`/admin`) - Gestion complète des utilisateurs
- API route `/api/user/check-admin` verifies admin status server-side
- Admin links visible in sidebar for authorized users

### Admin Interfaces
Les interfaces admin (`/admin/dashboard` et `/admin`) sont des pages protégées accessibles uniquement aux admins avec:
- **Same Sidebar as Home/Settings**: Navigation cohérente
- **Admin Section**: Section séparée avec accès aux fonctionnalités admin
- **Responsive Design**: Support desktop et mobile

#### Fonctionnalités Admin:
1. **Admin Dashboard** (`/admin/dashboard`):
   - Statistiques d'utilisation du SaaS
   - Nombre total d'utilisateurs inscrits
   - Vue d'ensemble centralisée

2. **User Management** (`/admin`):
   - Statistiques d'abonnement avec graphique circulaire (abonnés vs non-abonnés)
   - Taux de conversion affiché
   - Voir tous les utilisateurs inscrits (nom, email, statut abonnement, provider, date d'inscription, dernière connexion)
   - Badge de statut "Abonné" ou "Non abonné" pour chaque utilisateur
   - Supprimer des utilisateurs (avec confirmation)

#### APIs Admin:
- `GET /api/admin/users` - Récupère la liste des utilisateurs avec données d'abonnement et statistiques
- `DELETE /api/admin/users` - Supprime un utilisateur (body: `{ userId: string }`)

#### Composants Admin:
- `components/admin/SubscriptionStats.tsx` - Cartes de stats + graphique circulaire SVG
- `components/admin/UsersTable.tsx` - Table des utilisateurs avec badges d'abonnement

#### Fichiers clés:
- `libs/supabase/admin.ts` - Client Supabase avec service role key
- `components/admin/UsersTable.tsx` - Composant table des utilisateurs
- `components/AdminLinks.tsx` - Liens admin réutilisables dans la sidebar
- `app/api/admin/users/route.ts` - API routes admin
- `app/admin/page.tsx` - Page admin user management
- `app/admin/dashboard/page.tsx` - Page admin dashboard avec statistiques

### Adding New Admins
Edit `libs/admin.ts` and add email to `ADMIN_EMAILS` array:
```typescript
const ADMIN_EMAILS = [
  "dropposting40@gmail.com",
  "new-admin@example.com",  // add new admins here
];
```

## Navigation & UI
### Home Page
- Main page after login: `/dashboard`
- Contains dashboard grid layout
- Accessible from sidebar under "Home" link

### Sidebar Navigation
- **Left Sidebar**: Custom responsive sidebar with smooth framer-motion animations
  - Collapses on hover (desktop), expandable menu on mobile
  - White background with gray border
  - Quick links: Home, Settings
  - User account button integrated
  - Admin section for authorized users
- **Header**: Custom white header with gray text and border
  - Clean, light design adapted for white background
  - Mobile-responsive menu with same white styling

### Sidebar Components
Located in `components/ui/sidebar.tsx`:
- `Sidebar` - Main container
- `SidebarBody` - Layout with responsive desktop/mobile views
- `SidebarLink` - Individual navigation links using Next.js Link (no full refresh)
- Uses `framer-motion` for smooth animations without element disappearing

### Settings Page
Users can manage their account at `/dashboard/settings` with:
- **Profil Section**: Edit name, view email
- **Security Section**: Change password (sends reset link to email)
- **Danger Zone**: Delete account (to be implemented)

Access via:
- Sidebar link under Home
- User profile dropdown menu in the sidebar

### Dependencies
- `framer-motion` - Animation library
- `@tabler/icons-react` - Icon set
