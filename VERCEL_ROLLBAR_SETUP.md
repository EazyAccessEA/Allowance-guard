# Vercel Environment Variables Setup for Rollbar

## Environment Variables to Add in Vercel

You need to add these environment variables in your Vercel dashboard:

### 1. Server-side Access Token
- **Variable Name**: `ROLLBAR_ACCESS_TOKEN`
- **Value**: `5d447f90f4c94766a4ddf5e5d13a605551ee2a2fb14fe3216b2125ce33976501fa62c258fd0e6e8cfc68b34b3f0416b3`
- **Environment**: Production, Preview, Development

### 2. Client-side Access Token
- **Variable Name**: `NEXT_PUBLIC_ROLLBAR_ACCESS_TOKEN`
- **Value**: `601af65f62b7494fb5e6734a1df9b5f8cb892bcad5697d70c9dbd49ad6df51216e5b030bce8b3f4dae853df2e04af472`
- **Environment**: Production, Preview, Development

## How to Add Environment Variables in Vercel

### Method 1: Vercel Dashboard
1. Go to your project in [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Go to **Settings** tab
4. Click on **Environment Variables** in the sidebar
5. Add each variable:
   - Click **Add New**
   - Enter the variable name
   - Enter the value
   - Select environments (Production, Preview, Development)
   - Click **Save**

### Method 2: Vercel CLI
```bash
# Add server-side token
vercel env add ROLLBAR_ACCESS_TOKEN

# Add client-side token
vercel env add NEXT_PUBLIC_ROLLBAR_ACCESS_TOKEN
```

## Verification

After adding the environment variables:

1. **Redeploy your application** (Vercel will automatically redeploy when you add env vars)
2. **Check the deployment logs** to ensure no errors
3. **Test error reporting** by triggering an error in your app
4. **Check your Rollbar dashboard** to see if errors are being received

## Local Development

For local development, create a `.env.local` file in your project root:

```bash
# .env.local
ROLLBAR_ACCESS_TOKEN=5d447f90f4c94766a4ddf5e5d13a605551ee2a2fb14fe3216b2125ce33976501fa62c258fd0e6e8cfc68b34b3f0416b3
NEXT_PUBLIC_ROLLBAR_ACCESS_TOKEN=601af65f62b7494fb5e6734a1df9b5f8cb892bcad5697d70c9dbd49ad6df51216e5b030bce8b3f4dae853df2e04af472
```

## Security Notes

- ✅ **Server token** (`ROLLBAR_ACCESS_TOKEN`) is safe to use in server-side code
- ✅ **Client token** (`NEXT_PUBLIC_ROLLBAR_ACCESS_TOKEN`) is safe to expose to browsers
- ✅ These tokens are specifically designed for public use
- ✅ Rollbar tokens don't provide access to sensitive data

## Troubleshooting

### If errors aren't appearing in Rollbar:
1. Check that environment variables are set correctly in Vercel
2. Verify the tokens are valid in your Rollbar dashboard
3. Check browser console for any Rollbar initialization errors
4. Ensure your app is deployed with the latest environment variables

### If you see "Rollbar not configured" in console:
- Environment variables are not being loaded
- Check Vercel deployment logs for any issues
- Verify the variable names match exactly (case-sensitive)
