# Vercel Deployment Setup

## Environment Variables

Before deploying to Vercel, you need to add these environment variables in your Vercel project settings:

### Required Variables:

1. **VITE_MAPBOX_TOKEN**

   - Value: Your Mapbox public token (starts with `pk.`)
   - Get from: https://account.mapbox.com/access-tokens/
   - Example: `pk.eyJ1IjoiYTM4OTg2NjQwIi...`

2. **VITE_WALKSCORE_API_KEY** (Optional)

   - Value: Your Walk Score API key
   - Get from: https://www.walkscore.com/professional/api.php
   - Leave as `your-walkscore-key` to use synthetic data

3. **VITE_MAPBOX_TOKEN** (Already configured)
   - This same token is also used to fetch neighborhood aerial images
   - Uses Mapbox Static Images API (satellite-streets view)
   - No additional configuration needed!

## Deployment Steps

1. **Push your code to GitHub:**

   ```bash
   git add .
   git commit -m "Update empathic grid with sliding panel"
   git push origin master
   ```

2. **Import project to Vercel:**

   - Go to https://vercel.com
   - Click "Add New..." → "Project"
   - Import your GitHub repository: `vincentnguyen1710/CityOS-Citizen-Portal`

3. **Configure Project Settings:**

   - **Framework Preset:** Vite
   - **Root Directory:** `app`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

4. **Add Environment Variables:**

   - In Vercel dashboard, go to: Project Settings → Environment Variables
   - Add `VITE_MAPBOX_TOKEN` with your Mapbox token
   - Add `VITE_WALKSCORE_API_KEY` (optional)
   - Apply to: Production, Preview, and Development

5. **Deploy:**
   - Click "Deploy"
   - Vercel will build and deploy your app
   - You'll get a live URL like: `cityos-citizen-portal.vercel.app`

## Important Notes

- ✅ `.env` file is excluded from git (contains sensitive tokens)
- ✅ All secrets are loaded from environment variables
- ✅ No sensitive data will be exposed in the repository
- ⚠️ Never commit `.env` files to git
- ⚠️ Always use environment variables for API keys

## Verify Deployment

After deployment, check:

1. Map loads correctly (Mapbox token works)
2. Sliding panel opens/closes smoothly
3. All visualization layers toggle properly
4. No console errors for missing environment variables
