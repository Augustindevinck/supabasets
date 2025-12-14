# Database Migration Guide

## Moving Your Project to a New Supabase Instance

This guide walks you through migrating your application and data to a new Supabase project.

---

## Phase 1: Create New Supabase Project

### Step 1: Create Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in details:
   - **Name**: Choose a new name (e.g., `my-app-prod`)
   - **Database Password**: Save this somewhere safe
   - **Region**: Choose closest to your users
4. Wait for project to initialize (2-3 minutes)

### Step 2: Get Credentials
Once project is ready:
1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

---

## Phase 2: Set Up Database Schema

### Option A: Using SQL Editor (Recommended)

1. Go to **SQL Editor**
2. Click **New Query**
3. Copy entire contents of `docs/DATABASE_SETUP.sql`
4. Paste into the editor
5. Click **Run**
6. Wait for success message

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI if you don't have it
npm install -g supabase

# Link to your new project
supabase link --project-ref your-project-ref

# Push schema from your migrations
supabase db push
```

---

## Phase 3: Verify Schema

After running the SQL script, verify everything is set up:

### Check Table Structure
```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;
```

Expected output:
```
id          | uuid           | NO
email       | text           | YES
customer_id | text           | YES
price_id    | text           | YES
has_access  | boolean        | YES
created_at  | timestamp      | YES
updated_at  | timestamp      | YES
```

### Check Indexes
```sql
SELECT indexname FROM pg_indexes WHERE tablename = 'profiles';
```

Should return:
```
profiles_pkey
idx_profiles_customer_id
idx_profiles_email
idx_profiles_has_access
```

### Check Triggers
```sql
SELECT trigger_name FROM information_schema.triggers 
WHERE trigger_schema = 'public' AND event_object_table = 'profiles';
```

Should return:
```
on_auth_user_created
on_profiles_updated
```

---

## Phase 4: Migrate Data (If Needed)

### Option A: Migrate Existing Users & Data

If you have existing data in your old Supabase instance and want to transfer it:

#### Step 1: Export Data from Old Instance
```sql
-- From old Supabase instance, export profiles table as CSV
-- Use Supabase Dashboard → profiles → Export
```

Or via command line:
```bash
# Install PostgreSQL client (psql)
# macOS: brew install postgresql
# Ubuntu: sudo apt-get install postgresql-client

# Export from old instance
psql \
  --host=old-db.supabaseurl.co \
  --username=postgres \
  --database=postgres \
  --command="SELECT * FROM profiles;" \
  > profiles_backup.csv
```

#### Step 2: Import Data to New Instance
```bash
# Import to new instance
psql \
  --host=new-db.supabaseurl.co \
  --username=postgres \
  --database=postgres \
  --command="\COPY profiles FROM STDIN WITH (FORMAT csv, HEADER);" \
  < profiles_backup.csv
```

Or import via Supabase Dashboard:
1. Go to **profiles** table
2. Click **Import data**
3. Select your CSV file
4. Click **Upload**

### Option B: Fresh Start (Recommended for Testing)
Skip data migration and start with fresh users.

---

## Phase 5: Update Application

### Update Environment Variables

#### For Replit:
1. Go to **Secrets** tab
2. Update or create:
   - `NEXT_PUBLIC_SUPABASE_URL` = new URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = new anon key
   - `SUPABASE_SERVICE_ROLE_KEY` = new service role key

#### For `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL="https://new-project-ref.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbG..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbG..."
```

### Restart Application
```bash
# If using Replit: Redeploy or refresh the browser
# If local: npm run dev
```

---

## Phase 6: Test Integration

### Test Authentication
1. Navigate to `/signin`
2. Create a new test account
3. Check Supabase Dashboard → **Authentication** → **Users**
   - New user should appear
4. Check **profiles** table
   - New profile row should be created automatically (via trigger)

### Test Stripe Integration (If Applicable)
1. In dashboard, try to subscribe
2. Complete Stripe checkout
3. Check **profiles** table → new row should have:
   - `customer_id` = filled
   - `price_id` = filled
   - `has_access` = true

### Test Admin Dashboard
1. Add your email to `libs/admin.ts` ADMIN_EMAILS
2. Navigate to `/admin`
3. Verify you can see users and stats

---

## Phase 7: Configure Webhooks (For Stripe)

If using Stripe payments:

### Step 1: Update Webhook Endpoint
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Click **Developers** → **Webhooks**
3. Click on your webhook endpoint
4. Update **Endpoint URL** to your new domain:
   ```
   https://your-new-domain.com/api/webhook/stripe
   ```

### Step 2: Verify Webhook Secret
Ensure in your `.env` you have:
```
STRIPE_WEBHOOK_SECRET=whsec_...
```

This value should NOT change when migrating to new Supabase.

---

## Phase 8: Test in Production (After Deployment)

### Test Checklist
- [ ] Users can sign up
- [ ] Users can sign in
- [ ] Profile auto-created on signup
- [ ] Stripe checkout works
- [ ] Stripe subscription updates DB
- [ ] Admin dashboard shows correct stats
- [ ] No console errors
- [ ] All environment variables configured

---

## Rollback Plan

If something goes wrong:

### Quick Rollback (Keep Old Instance)
1. Update environment variables back to old instance
2. Restart application
3. Users continue with old data

### Full Rollback (Restore from Backup)
1. In new Supabase → **Settings** → **Backups**
2. If you have a backup, restore it
3. Or use PostgreSQL backup file to restore

---

## Troubleshooting

### Problem: "Profiles table doesn't exist"
**Solution:** Re-run the SQL setup script from `docs/DATABASE_SETUP.sql`

### Problem: "RLS policy error when signing up"
**Solution:** 
1. Verify RLS policies were created
2. Run: `SELECT * FROM pg_policies WHERE tablename = 'profiles';`
3. Re-create policies if missing

### Problem: "Service role key not working"
**Solution:**
1. Verify `SUPABASE_SERVICE_ROLE_KEY` is correct
2. Check key doesn't have typos
3. Regenerate if needed: Settings → API → Service Role Key → Regenerate

### Problem: "Profile not created automatically on signup"
**Solution:**
1. Check trigger exists: `SELECT * FROM information_schema.triggers WHERE event_object_table = 'profiles';`
2. Check function exists: `SELECT * FROM pg_proc WHERE proname = 'handle_new_user';`
3. Re-create if missing - re-run SQL setup script

### Problem: "Can't authenticate users"
**Solution:**
1. Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
2. Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
3. Check browser console for CORS errors
4. Verify Supabase project is fully initialized

---

## Validation Queries

Run these to verify everything is working:

```sql
-- 1. Check profiles table exists and has correct structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles';

-- 2. Check all indexes exist
SELECT indexname 
FROM pg_indexes 
WHERE tablename = 'profiles';

-- 3. Check triggers are installed
SELECT trigger_name, function_name 
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
  AND event_object_table = 'profiles';

-- 4. Check RLS is enabled
SELECT relname, relrowsecurity 
FROM pg_class 
WHERE relname = 'profiles';

-- 5. Count profiles (should match auth.users after signup)
SELECT COUNT(*) as profile_count FROM profiles;

-- 6. Check for orphaned profiles (shouldn't exist)
SELECT p.id FROM profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE u.id IS NULL;
```

---

## Support

For issues:
1. Check [Supabase Docs](https://supabase.com/docs)
2. Review error messages in application logs
3. Check [Supabase Discord Community](https://discord.gg/supabase)
4. Check PostgreSQL error codes: https://www.postgresql.org/docs/current/errcodes-appendix.html

---

## Completion Checklist

- [ ] New Supabase project created
- [ ] Credentials obtained (URL, anon key, service role key)
- [ ] Database schema set up with SQL script
- [ ] Schema verified (tables, indexes, triggers)
- [ ] Data migrated (if needed)
- [ ] Environment variables updated
- [ ] Application tested (signup, signin, payments)
- [ ] Webhooks configured (if applicable)
- [ ] Admin dashboard verified
- [ ] No errors in logs

Once all items are checked, your migration is complete!
