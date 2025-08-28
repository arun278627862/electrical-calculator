# 🚀 Deployment Guide - GitHub Pages

## Quick Deployment Steps

### 1. Create GitHub Repository
```bash
# Create a new repository on GitHub
# Name it: electrical-calculator (or your preferred name)
# Make it public
# Don't initialize with README (we already have one)
```

### 2. Upload Files
```bash
# Clone the repository locally
git clone https://github.com/yourusername/electrical-calculator.git
cd electrical-calculator

# Copy all project files to this directory:
# - index.html
# - style.css
# - script.js
# - manifest.json
# - service-worker.js
# - README.md

# Add and commit files
git add .
git commit -m "Initial commit: Electrical Engineering Calculator"
git push origin main
```

### 3. Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **Deploy from a branch**
5. Select **main** branch
6. Click **Save**

### 4. Your App is Live! 🎉
- **URL**: `https://yourusername.github.io/electrical-calculator`
- **PWA**: Installable on mobile/desktop
- **Offline**: Works without internet connection

## Alternative Deployment Methods

### Netlify
1. Drag and drop your project folder to [netlify.com](https://netlify.com)
2. Get instant HTTPS and custom domain support

### Vercel
1. Connect your GitHub repository to [vercel.com](https://vercel.com)
2. Automatic deployments on every push

### Local Testing
```bash
# Simple HTTP server (Python 3)
python -m http.server 8000

# Simple HTTP server (Node.js)
npx http-server

# Open http://localhost:8000 in your browser
```

## Troubleshooting

### PWA Not Working
- Ensure HTTPS is enabled (GitHub Pages provides this)
- Check browser console for service worker errors
- Verify manifest.json is accessible

### Charts Not Loading
- Check if Chart.js CDN is accessible
- Verify internet connection for first load
- Check browser console for errors

### Offline Functionality
- Service worker must be registered successfully
- Clear browser cache and reload
- Check if files are being cached properly

## Performance Tips

### Before Deployment
- Minify CSS and JavaScript files
- Optimize images (if any)
- Enable gzip compression (if supported)

### After Deployment
- Test on multiple devices
- Verify PWA installation
- Check offline functionality
- Test various screen sizes

## Custom Domain (Optional)

### Add Custom Domain
1. In GitHub Pages settings, add your domain
2. Update DNS records with your domain provider
3. Wait for DNS propagation (up to 24 hours)

### Update Manifest
```json
{
    "start_url": "https://yourdomain.com",
    "scope": "https://yourdomain.com"
}
```

---

**Your Electrical Engineering Calculator is now ready for the world! ⚡**
