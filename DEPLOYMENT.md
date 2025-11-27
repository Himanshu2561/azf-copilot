# LocalTunnel Deployment Guide

This guide will help you deploy the Next.js app using LocalTunnel for temporary hosting and embed it in a Vite.js iframe.

## ⚡ Quick Start (TL;DR)

If you're getting `ERR_BLOCKED_BY_CLIENT` or `localhost:8000` errors, you need to tunnel your backend API too!

1. **Tunnel your backend API** (port 8000):
   ```bash
   npm run tunnel:backend
   ```
   This will create: `https://azf-copilot-main-api.loca.lt`

2. **Set environment variable and rebuild**:
   ```bash
   export NEXT_PUBLIC_API_URL=https://azf-copilot-main-api.loca.lt
   npm run build
   npm start
   ```

3. **Tunnel your frontend** (port 3000):
   ```bash
   npm run tunnel
   ```
   This will create: `https://azf-copilot-main.loca.lt`

4. **Keep all 3 processes running:**
   - Backend server (port 8000)
   - Backend tunnel
   - Frontend server (port 3000) 
   - Frontend tunnel

See detailed steps below for complete instructions.

## Prerequisites

1. Node.js and npm installed
2. The app built and ready to run
3. LocalTunnel installed (will be installed automatically via npx)

## Step-by-Step Deployment

### 1. Build the Application

First, build the Next.js application for production:

```bash
npm run build
```

### 2. Start the Production Server

Start the Next.js production server on port 3000:

```bash
npm start
```

The app will be running at `http://localhost:3000`

### 3. Create LocalTunnel for Frontend

In a **new terminal window**, run:

```bash
npm run tunnel
```

This will:
- Create a tunnel on port 3000
- Use the custom subdomain: `azf-copilot-main`
- Create the URL: `https://azf-copilot-main.loca.lt`

**Note:** If the subdomain is already taken, you can use `npm run tunnel:random` for a random subdomain.

### 5. Tunnel Your Backend API (Required!)

**CRITICAL:** Your backend API (running on port 8000) also needs to be tunneled because:
- The frontend is accessed via HTTPS (through tunnel)
- Browsers block mixed content (HTTP requests from HTTPS pages)
- `localhost:8000` won't work from the tunneled frontend

In a **third terminal window**, create a tunnel for your backend API:

```bash
npm run tunnel:backend
```

This will create: `https://azf-copilot-main-api.loca.lt`

**Note:** If the subdomain is already taken, you can use `npm run tunnel:backend:random` for a random subdomain.

### 6. Configure Frontend to Use Backend Tunnel

You need to set the `NEXT_PUBLIC_API_URL` environment variable to point to your backend tunnel URL.

**Option A: Set when starting the server**

Stop your current `npm start` process (Ctrl+C) and restart with:

```bash
NEXT_PUBLIC_API_URL=https://azf-copilot-main-api.loca.lt npm start
```

**Option B: Create `.env.local` file**

Create a `.env.local` file in the project root:

```
NEXT_PUBLIC_API_URL=https://azf-copilot-main-api.loca.lt
```

Then rebuild and restart:
```bash
npm run build
npm start
```

**Important:** Environment variables starting with `NEXT_PUBLIC_` are embedded at build time. If you change the `.env.local` file, you must rebuild the app.

**Your URLs will be:**
- Frontend: `https://azf-copilot-main.loca.lt`
- Backend API: `https://azf-copilot-main-api.loca.lt`

### 7. Keep All Processes Running

**Important:** You need to keep **four processes** running:
- Terminal 1: Backend server (your API server on port 8000)
- Terminal 2: `npm run tunnel:backend` (Backend API tunnel → `https://azf-copilot-main-api.loca.lt`)
- Terminal 3: `npm start` (Next.js server on port 3000)
- Terminal 4: `npm run tunnel` (Frontend tunnel → `https://azf-copilot-main.loca.lt`)

If any process stops, the setup will break.

## Embedding in Vite.js App

### Iframe Configuration

In your Vite.js app, embed the app using an iframe:

```html
<iframe 
  src="https://azf-copilot-main.loca.lt" 
  width="100%" 
  height="100%"
  frameborder="0"
  allow="clipboard-read; clipboard-write"
  style="border: none;"
></iframe>
```

Or in a React/Vue component:

```jsx
// React example
<iframe 
  src="https://azf-copilot-main.loca.lt" 
  style={{ width: '100%', height: '100%', border: 'none' }}
  allow="clipboard-read; clipboard-write"
/>
```

### Environment Variables

The app uses `NEXT_PUBLIC_API_URL` to connect to your backend API. This must be set to your **backend tunnel URL** (not localhost).

**Important:** Since `NEXT_PUBLIC_*` variables are embedded at build time, you must rebuild after changing them:

```bash
# Set the environment variable
export NEXT_PUBLIC_API_URL=https://azf-copilot-main-api.loca.lt

# Rebuild the app
npm run build

# Start the server
npm start
```

Or create/update `.env.local`:

```
NEXT_PUBLIC_API_URL=https://azf-copilot-main-api.loca.lt
```

Then rebuild and start:
```bash
npm run build
npm start
```

## Important Notes

### Security Considerations

⚠️ **LocalTunnel is for temporary/development use only:**
- The URLs are publicly accessible
- Anyone with the URL can access your app
- Don't use for production or sensitive data
- URLs may change on restart (unless using custom subdomain)

### Network Configuration

The app has been configured with:
- ✅ CORS headers to allow cross-origin requests
- ✅ Content-Security-Policy allowing iframe embedding
- ✅ Removed X-Frame-Options restrictions

### Troubleshooting

1. **Tunnel not working?**
   - Make sure the Next.js server is running on port 3000
   - Check if port 3000 is already in use
   - Try a different port: `npm start` on a different port, then tunnel that port

2. **Iframe not loading?**
   - Verify the tunnel URL is accessible in your browser
   - Check browser console for CORS errors
   - Ensure both processes (Next.js and tunnel) are running

3. **API calls failing with `ERR_BLOCKED_BY_CLIENT` or `localhost:8000` errors?**
   - ✅ **You MUST tunnel your backend API** (port 8000) separately
   - ✅ Set `NEXT_PUBLIC_API_URL` to your backend tunnel URL (HTTPS, not localhost)
   - ✅ Rebuild the app after setting the environment variable: `npm run build`
   - ✅ Verify the backend tunnel is running and accessible
   - ✅ Check if the backend API has CORS configured to accept requests from `*.loca.lt`
   - ✅ Make sure you're using HTTPS URLs (not HTTP) for the backend tunnel

4. **Connection timeout?**
   - LocalTunnel free tier may have connection limits
   - Try restarting the tunnel
   - Consider using a custom subdomain for more stability

## Quick Start Script

You can create a simple script to start both processes. Create a file `start-tunnel.sh`:

```bash
#!/bin/bash
# Start Next.js server in background
npm start &
NEXT_PID=$!

# Wait a moment for server to start
sleep 3

# Start tunnel
npm run tunnel

# Cleanup on exit
trap "kill $NEXT_PID" EXIT
```

Make it executable:
```bash
chmod +x start-tunnel.sh
```

Then run:
```bash
./start-tunnel.sh
```

## Alternative: Using PM2 (Optional)

For more robust process management, you can use PM2:

```bash
# Install PM2 globally
npm install -g pm2

# Start Next.js with PM2
pm2 start npm --name "nextjs" -- start

# Start frontend tunnel with PM2
pm2 start "npx localtunnel --port 3000 --subdomain azf-copilot-main" --name "tunnel"

# Start backend tunnel with PM2
pm2 start "npx localtunnel --port 8000 --subdomain azf-copilot-main-api" --name "tunnel-backend"

# View logs
pm2 logs

# Stop all
pm2 stop all
```

