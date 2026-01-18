# Supabase Setup Guide for CloudDrop

Supabase is a fantastic, easier alternative to Firebase. Here is how to set it up for your file sharing app.

## Step 1: Create a Project
1.  Go to [Supabase.com](https://supabase.com/) and click **"Start your project"**.
2.  Sign in with GitHub.
3.  Click **"New Project"**.
4.  Name it `CloudDrop`.
5.  Create a strong database password (you usually won't need this for simple storage, but save it anyway).
6.  Click **"Create new project"**.

## Step 2: Get Your Keys
1.  Once your project is ready (it takes about a minute), go to the **Project Settings** (gear icon at the bottom of the left sidebar).
2.  Click **"API"**.
3.  You will see `Project URL` and `Project API keys`.
4.  Copy the **Project URL**.
5.  Copy the **`anon`** public key.
6.  *I will ask you for these in a moment!*

## Step 3: Create a Storage Bucket
1.  Click the **Storage Icon** (folder icon) in the left sidebar.
2.  Click **"New Bucket"**.
3.  Name the bucket `uploads`.
4.  **IMPORTANT:** Toggle **ON** "Public Bucket".
    *   *This allows anyone with the link to download the file.*
5.  Click **"Save"**.

## Step 4: Storage Policies (Allow Uploads)
By default, no one can upload. You need to allow "public" uploads for this demo.
1.  In the Storage dashboard, click **"Policies"** (under Configuration).
2.  Under your `uploads` bucket, click **"New Policy"**.
3.  Select **"Get started quickly"** -> choose the first option ("Give users access to SELECT, INSERT, UPDATE, DELETE").
4.  Select **"For full customization"** (or just "Start from scratch" if that's easier).
5.  **Easier permissions:**
    *   Click "New Policy" -> "For full customization".
    *   Policy Name: `Public Uploads`.
    *   Allowed Operations: Check **INSERT** and **SELECT**.
    *   Target roles: `anon` (or just leave default to select all).
    *   Click **"Review"** -> **"Save"**.
    *   *(Note: For a simple demo, allowing 'anon' inserts is fine. In a real app, you'd add Auth).*

✅ **All set!** Now just give me your URL and Key.

## Troubleshooting: "Row Level Security" Error?
If you see an error saying **"new row violates row-level security policy"**, it means Step 4 wasn't done correctly.

**The Easiest Fix (Run SQL):**
1.  In Supabase, look at the left sidebar and click the **SQL Editor** icon (square with `>_`).
2.  Click **"New Query"**.
3.  Paste this code and click **"Run"** (bottom right):

```sql
-- Allow public uploads to 'uploads' bucket
create policy "Public Uploads"
on storage.objects for insert
with check ( bucket_id = 'uploads' );

-- Allow public downloads/viewing
create policy "Public View"
on storage.objects for select
using ( bucket_id = 'uploads' );
```

**Option 2: The UI Way (Full Customization Form):**
If you are in the "Create Policy" window:
1.  Click **"For full customization"** (or "Create from scratch").
2.  **Policy Name:** Enter `Public Access`.
3.  **Allowed Operation:** Check **INSERT** and **SELECT**.
4.  **Target roles:** Click the dropdown and select **anon** (this means "anonymous/public").
5.  **USING expression:** Enter `bucket_id = 'uploads'`
6.  **WITH CHECK expression:** Enter `bucket_id = 'uploads'`
7.  Click **Review** -> **Save**.

## Step 5: Auto-Delete Old Files (Optional)
To automatically delete files older than 10 minutes, you can set up a "Cron Job" inside your database.

1.  Open the **SQL Editor** in Supabase.
2.  **New Query**.
3.  Paste and Run this Code:

```sql
-- 1. Enable the Cron extension
create extension if not exists pg_cron with schema extensions;

-- 2. Schedule the deletion (Runs every 10 minutes)
select cron.schedule(
  'delete-old-files',          -- Job name
  '*/10 * * * *',              -- Cron syntax (Every 10 mins)
  $$
    delete from storage.objects
    where bucket_id = 'uploads'
    and created_at < now() - interval '10 minutes';
  $$
);
```

**To check if it's running:**
```sql
select * from cron.job;
```
