# LocalTunnel Deployment Guide

This guide will help you deploy the Next.js app using LocalTunnel for temporary hosting and embed it in a Vite.js iframe.

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

### 3. Create LocalTunnel (Option A: Random Subdomain)

In a **new terminal window**, run:

```bash
npm run tunnel
```

This will:
- Create a tunnel on port 3000
- Generate a random subdomain (e.g., `https://random-name-1234.loca.lt`)
- Display the public URL you can use

**Note:** Copy the HTTPS URL provided (it will look like `https://xxxxx.loca.lt`)

### 4. Create LocalTunnel (Option B: Custom Subdomain)

If you want a custom subdomain (if available):

```bash
npx localtunnel --port 3000 --subdomain your-custom-name
```

Replace `your-custom-name` with your desired subdomain. This will create a URL like:
`https://your-custom-name.loca.lt`

### 5. Keep Both Processes Running

**Important:** You need to keep both processes running:
- Terminal 1: `npm start` (Next.js server)
- Terminal 2: `npm run tunnel` or the custom tunnel command (LocalTunnel)

If either process stops, the tunnel will break.

## Embedding in Vite.js App

### Iframe Configuration

In your Vite.js app, embed the app using an iframe:

```html
<iframe 
  src="https://your-tunnel-url.loca.lt" 
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
  src="https://your-tunnel-url.loca.lt" 
  style={{ width: '100%', height: '100%', border: 'none' }}
  allow="clipboard-read; clipboard-write"
/>
```

### Environment Variables

If your Next.js app needs to connect to a backend API, make sure to set the `NEXT_PUBLIC_API_URL` environment variable:

```bash
NEXT_PUBLIC_API_URL=https://your-backend-api.com npm start
```

Or create a `.env.local` file:

```
NEXT_PUBLIC_API_URL=https://your-backend-api.com
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

3. **API calls failing?**
   - Verify `NEXT_PUBLIC_API_URL` is set correctly
   - Check if the backend API allows requests from the tunnel domain
   - Ensure the backend has CORS configured to accept requests from `*.loca.lt`

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

# Start tunnel with PM2
pm2 start "npx localtunnel --port 3000" --name "tunnel"

# View logs
pm2 logs

# Stop all
pm2 stop all
```

