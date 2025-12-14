# Database Schema Documentation

## Overview
This document provides a complete documentation of the Supabase database schema used in this SaaS application. Use this to recreate the database in a new Supabase instance.

**Created:** December 14, 2025  
**Supabase Version:** Compatible with Supabase Latest  
**Database:** PostgreSQL  

---

## Database Architecture

### Authentication
- **Provider:** Supabase Auth (managed by Supabase)
- **Auth Schema:** `auth.*` (built-in, do not modify)
- **User Table:** `auth.users` (managed by Supabase)
- **User Fields Used:**
  - `id` (UUID) - Primary key
  - `email` - User email
  - `created_at` - Account creation timestamp
  - `last_sign_in_at` - Last login timestamp
  - `user_metadata.name` - User full name
  - `app_metadata.provider` - Auth provider (email, google, etc.)

### Tables

#### 1. `profiles` (Public)
Extends `auth.users` with application-specific user data including subscription information.

**Table Definition:**
```sql
CREATE TABLE profiles (
  id UUID NOT NULL PRIMARY KEY,
  email TEXT,
  customer_id TEXT,
  price_id TEXT,
  has_access BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_profiles_auth_user
    FOREIGN KEY (id) 
    REFERENCES auth.users(id) 
    ON DELETE CASCADE
);
```

**Column Details:**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | - | Foreign key to `auth.users.id` |
| `email` | TEXT | YES | NULL | User's email address (denormalized from auth.users) |
| `customer_id` | TEXT | YES | NULL | Stripe Customer ID (set after first purchase) |
| `price_id` | TEXT | YES | NULL | Stripe Price ID of user's current subscription |
| `has_access` | BOOLEAN | YES | false | Whether user has active access to product (subscription status) |
| `created_at` | TIMESTAMP | YES | CURRENT_TIMESTAMP | Profile creation date |
| `updated_at` | TIMESTAMP | YES | CURRENT_TIMESTAMP | Last profile update date |

**Key Relationships:**
- `id` → `auth.users(id)` [ONE-TO-ONE]

**Indexes:**
```sql
-- Create indexes for common queries
CREATE INDEX idx_profiles_customer_id ON profiles(customer_id);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_has_access ON profiles(has_access);
```

---

## Row Level Security (RLS) Policies

The `profiles` table uses RLS to control access:

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can read their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Admin users can read all profiles
CREATE POLICY "Admin can read all profiles"
  ON profiles FOR SELECT
  USING (auth.jwt() ->> 'role' = 'authenticated' AND EXISTS (
    SELECT 1 FROM admin_emails 
    WHERE email = auth.jwt() ->> 'email'
  ));

-- Service role can do everything
CREATE POLICY "Service role can do everything"
  ON profiles
  USING (current_setting('app.jwt_secret')::text = current_setting('app.jwt_claims')::text);
```

---

## Stripe Integration Fields

These fields track Stripe subscription data:

- **`customer_id`** - Stores Stripe Customer ID. Set when:
  - User completes first checkout (one-time payment or subscription)
  - Webhook event: `checkout.session.completed`

- **`price_id`** - Stores Stripe Price ID. Set when:
  - User selects a specific pricing plan
  - Webhook event: `checkout.session.completed` or `invoice.paid`

- **`has_access`** - Boolean flag indicating subscription status. Set to `true` when:
  - Webhook event: `checkout.session.completed` or `invoice.paid`
  
  Set to `false` when:
  - Webhook event: `customer.subscription.deleted` or `invoice.payment_failed`

---

## Subscription Status Logic

A user is considered **subscribed** when:
```typescript
isSubscribed = !!(profile.customer_id && profile.price_id)
```

This means the user must have BOTH a Stripe Customer ID AND a Price ID to be counted as subscribed.

---

## API Endpoints & Database Usage

### Authentication Endpoints
- `POST /api/auth/callback` - Updates user in auth.users
- `POST /api/auth/signin` - Authenticates against auth.users
- `POST /api/auth/signup` - Creates user in auth.users and profiles

### Profile Endpoints
- `GET /api/user/profile` - Reads from `profiles` table
- `PUT /api/user/profile` - Updates `profiles` table

### Stripe Endpoints
- `POST /api/webhook/stripe` - Updates `profiles` with Stripe data
  - Sets `customer_id`, `price_id`, `has_access`

### Admin Endpoints
- `GET /api/admin/users` - Queries `profiles` table + `auth.users` (via admin API)
  - Joins auth user data with profile subscription data
- `DELETE /api/admin/users` - Deletes from `auth.users` (cascades to profiles)

---

## Migration Guide: Setting Up a New Supabase Instance

### Step 1: Create the Profile Table
Go to Supabase Dashboard → SQL Editor and run:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID NOT NULL PRIMARY KEY,
  email TEXT,
  customer_id TEXT,
  price_id TEXT,
  has_access BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_profiles_auth_user
    FOREIGN KEY (id) 
    REFERENCES auth.users(id) 
    ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX idx_profiles_customer_id ON profiles(customer_id);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_has_access ON profiles(has_access);
```

### Step 2: Enable Row Level Security
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can read their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Policy: Service role can bypass RLS
CREATE POLICY "Service role bypass"
  ON profiles
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');
```

### Step 3: Create Trigger for Auto-Profile Creation
```sql
-- Create function to insert profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Step 4: Update Environment Variables
In your `.env.local` or Replit secrets, update:
```
NEXT_PUBLIC_SUPABASE_URL=<new_instance_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<new_anon_key>
SUPABASE_SERVICE_ROLE_KEY=<new_service_role_key>
```

### Step 5: Verify Setup
Run a test query:
```sql
-- Should return empty set (no users yet)
SELECT * FROM profiles;
```

---

## Data Migration from Old Instance

If migrating from an existing Supabase instance:

### Option 1: Export/Import via SQL
```sql
-- Export from old instance
\copy profiles TO profiles_backup.csv CSV HEADER;

-- Import to new instance
\copy profiles FROM profiles_backup.csv CSV HEADER;

-- Update sequences
SELECT setval('profiles_id_seq', (SELECT MAX(id) FROM profiles));
```

### Option 2: Using Supabase Backup
1. Go to old Supabase project → Settings → Backups
2. Create a backup
3. Download the backup SQL file
4. Run it in new Supabase instance

### Option 3: Programmatic Export/Import
```typescript
// Export
const { data } = await supabaseOld
  .from('profiles')
  .select('*');

// Import  
const { error } = await supabaseNew
  .from('profiles')
  .insert(data);
```

---

## Backup & Recovery

### Automatic Backups
Supabase provides automatic daily backups. Access via:
- Supabase Dashboard → Settings → Backups

### Manual Backup
```bash
# Using pg_dump (requires psql client)
pg_dump \
  --host=db.supabaseurl.co \
  --username=postgres \
  --database=postgres \
  --table=profiles \
  > profiles_backup.sql
```

### Restore from Backup
```bash
psql \
  --host=db.supabaseurl.co \
  --username=postgres \
  --database=postgres \
  < profiles_backup.sql
```

---

## Performance Considerations

### Current Indexes
- `idx_profiles_customer_id` - Used in Stripe webhook queries
- `idx_profiles_email` - Used in user lookup
- `idx_profiles_has_access` - Used in admin dashboard queries

### Query Optimization
Most frequent queries:
```sql
-- User profile lookup (by ID)
SELECT * FROM profiles WHERE id = $1;
-- Uses: Primary key index (automatic)

-- Customer lookup (by Stripe ID)
SELECT * FROM profiles WHERE customer_id = $1;
-- Uses: idx_profiles_customer_id

-- Email lookup
SELECT * FROM profiles WHERE email = $1;
-- Uses: idx_profiles_email

-- Active subscription check
SELECT COUNT(*) FROM profiles WHERE has_access = true;
-- Uses: idx_profiles_has_access
```

---

## Troubleshooting

### Users Not Appearing in Profiles
**Problem:** User signed up but no profile row exists.

**Solution:** Ensure the trigger `on_auth_user_created` is enabled:
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

### Subscription Status Not Updating
**Problem:** `has_access` not changing after Stripe payment.

**Solution:** Check:
1. Webhook secret configured correctly
2. Stripe webhook events being sent
3. Check logs: `SELECT * FROM webhooks_log;` (if logging enabled)

### RLS Blocking Legitimate Queries
**Problem:** Getting "new row violates row-level security policy"

**Solution:** 
- Verify user is authenticated
- Check JWT claims
- Use service role key for admin operations

---

## Version History

| Date | Change | Author |
|------|--------|--------|
| 2025-12-14 | Initial documentation | System |
| - | - | - |

---

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
