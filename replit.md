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

## Build Optimization

### Package Import Optimization
Next.js includes a built-in `optimizePackageImports` feature that tree-shakes heavy dependencies:

**Current optimized packages:**
- `@headlessui/react` - UI components
- `@tabler/icons-react` - Icons (3000+ icons, must tree-shake)
- `daisyui` - Tailwind component library
- `aceternity-ui` - Custom animations and components
- `framer-motion` - Animation library
- `react-hot-toast` - Toast notifications
- `react-tooltip` - Tooltip component

This setting dramatically reduces first build time (from minutes to seconds) by only bundling what you actually import.

**Note:** These optimizations are automatically applied. Your imports are already optimal - you're importing specific components, not entire modules. ✅

### If Build Times Still Slow:
1. Clear `.next` folder: `rm -rf .next`
2. Rebuild fresh: `npm run build`
3. Monitor with: `npm run build -- --debug`

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

## Authentication
- **Email/Password**: Users can sign up and sign in with email + password
  - Signup page: `/signup` - Creates account with mandatory name
  - Signin page: `/signin` - Login with email/password
  - Password minimum: 6 characters
- **Google OAuth**: Continue with Google button
- Supabase Auth handles all authentication
- After successful auth, users are redirected to `/dashboard`

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
- **Left Sidebar**: Aceternity UI responsive sidebar with smooth animations
  - Collapses on hover (desktop), expandable menu on mobile
  - Dark mode support
  - Quick links: Home, Settings
  - User account button integrated
  - Admin section for authorized users
- **Header**: Page title and description

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
