# Akashi WhatsApp - Deployment Guide

This guide will help you deploy your WhatsApp task management application with:
- **Frontend on Vercel** (Free)
- **Backend on Render** (Free)

## Architecture Overview

```
Frontend (Vercel)  →  Backend (Render)  →  WhatsApp Web
    Next.js              Express.js           whatsapp-web.js
```

---

## Part 1: Deploy Backend to Render (FREE)

### Step 1: Prepare Your Backend Repository

You have two options:

#### Option A: Push backend to the same GitHub repo (easier)
```bash
cd whatsapp-backend
git init
git add .
git commit -m "Add WhatsApp backend service"
git push
```

#### Option B: Create a separate repository (recommended)
```bash
cd whatsapp-backend
git init
git add .
git commit -m "Initial commit: WhatsApp backend service"
```

Then create a new GitHub repository at https://github.com/new and push:
```bash
git remote add origin https://github.com/YOUR_USERNAME/whatsapp-backend.git
git branch -M main
git push -u origin main
```

### Step 2: Sign Up for Render

1. Go to https://render.com
2. Click "Get Started" or "Sign Up"
3. Sign up using your GitHub account (recommended)
4. Authorize Render to access your repositories

### Step 3: Create a New Web Service

1. Click "New +" button in the top right
2. Select "Web Service"
3. Connect your GitHub repository:
   - If you created a separate repo: select `whatsapp-backend`
   - If using same repo: select your main repo and set root directory to `whatsapp-backend`

### Step 4: Configure the Service

Fill in the following settings:

- **Name**: `akashi-whatsapp-backend` (or any name you prefer)
- **Region**: Choose closest to you (e.g., Oregon, Frankfurt, Singapore)
- **Branch**: `main`
- **Root Directory**:
  - If separate repo: leave empty
  - If same repo: `whatsapp-backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: `Free`

### Step 5: Add Environment Variables (Optional)

You can add these in the "Environment" section:
- `PORT`: `3001` (optional, Render sets this automatically)

### Step 6: Deploy!

1. Click "Create Web Service"
2. Render will start building and deploying
3. Wait 2-5 minutes for the first deploy
4. You'll see logs in the console
5. Once deployed, you'll get a URL like: `https://akashi-whatsapp-backend.onrender.com`

### Step 7: Test Your Backend

Click on your service URL or visit:
```
https://YOUR_SERVICE_NAME.onrender.com
```

You should see:
```json
{
  "status": "ok",
  "message": "WhatsApp Backend Service",
  "connected": false,
  "initializing": false
}
```

**🎉 Backend is deployed!**

---

## Part 2: Update and Deploy Frontend to Vercel

### Step 1: Add Backend URL to Vercel Environment Variables

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your `akashi-whatsapp` project
3. Go to **Settings** → **Environment Variables**
4. Add a new variable:
   - **Name**: `NEXT_PUBLIC_BACKEND_URL`
   - **Value**: `https://YOUR_SERVICE_NAME.onrender.com` (your Render URL)
   - **Environment**: Select all (Production, Preview, Development)
5. Click "Save"

### Step 2: Update Local Environment (Optional for local testing)

Update your `.env.local` file:
```bash
NEXT_PUBLIC_BACKEND_URL=https://YOUR_SERVICE_NAME.onrender.com
```

### Step 3: Commit and Push Changes

```bash
cd akashi-whatsapp
git add .
git commit -m "Connect frontend to Render backend"
git push
```

Vercel will automatically redeploy with the new environment variable.

### Step 4: Verify Deployment

1. Wait for Vercel deployment to complete
2. Visit your Vercel app URL: `https://rabbithole-tan.vercel.app`
3. Click "Connect WhatsApp"
4. QR code should now load properly!

---

## Part 3: Connect WhatsApp

### On Your Vercel App:

1. Visit your deployed app
2. Click **"Connect WhatsApp"** button
3. Wait for QR code to appear (~30 seconds to 1 minute on first load)
4. Open WhatsApp on your phone
5. Go to **Settings** → **Linked Devices**
6. Tap **"Link a Device"**
7. Scan the QR code
8. ✅ Connected!

---

## Important Notes

### ⚠️ Render Free Tier Limitations

- **Spin-down after 15 minutes of inactivity**
  - Your backend will sleep after 15 mins of no requests
  - It takes ~30-60 seconds to wake up
  - First QR code generation after sleep will be slower

- **WhatsApp session persistence**
  - Render free tier has persistent disk storage
  - Your WhatsApp session will be saved
  - You only need to scan QR code once (unless session expires)

### 💡 Tips

1. **Keep backend awake**: Use a free uptime monitor like:
   - UptimeRobot (https://uptimerobot.com)
   - Ping your backend every 10 minutes to prevent sleep

2. **Monitor logs**:
   - Check Render logs for any errors
   - Go to your service → "Logs" tab

3. **Update backend URL**: If you change your Render service name, update the environment variable in Vercel

---

## Troubleshooting

### QR Code not loading

1. Check Render service is running (green status)
2. Visit backend URL directly to verify it's up
3. Check browser console for CORS errors
4. Verify `NEXT_PUBLIC_BACKEND_URL` is set correctly in Vercel

### Backend keeps sleeping

- Use UptimeRobot to ping every 10 minutes
- Consider upgrading to Render paid plan ($7/month) for always-on

### WhatsApp disconnects

- WhatsApp Web sessions can expire
- Simply click "Connect WhatsApp" again and scan new QR code
- Sessions usually last weeks/months if backend stays running

---

## Cost Summary

- ✅ **Frontend (Vercel)**: FREE forever
- ✅ **Backend (Render)**: FREE (with sleep)
- ✅ **Uptime Monitor**: FREE (UptimeRobot free plan)

**Total Cost: $0/month** 🎉

---

## Need Help?

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- WhatsApp Web.js: https://github.com/pedroslopez/whatsapp-web.js

Good luck! 🚀
