# Quick Deployment Guide

Get Chimera Protocol deployed in 5 minutes!

## 🚀 Fastest Path: Vercel

### Option 1: Deploy Button (30 seconds)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/chimera-protocol)

### Option 2: CLI Deploy (2 minutes)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Build the project
npm run build

# 3. Deploy
vercel --prod
```

That's it! Your app is live.

## 🎯 Alternative: Netlify

### Option 1: Drag & Drop (1 minute)

1. Run `npm run build`
2. Go to [Netlify Drop](https://app.netlify.com/drop)
3. Drag the `dist` folder
4. Done!

### Option 2: CLI Deploy (2 minutes)

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Build the project
npm run build

# 3. Deploy
netlify deploy --prod --dir=dist
```

## ✅ Pre-Deployment Checklist

Before deploying, run these commands:

```bash
# 1. Install dependencies
npm install

# 2. Run tests
npm test

# 3. Build for production
npm run build

# 4. Verify build
npm run verify-build

# 5. Test locally
npm run preview
```

Visit `http://localhost:4173` to test the production build.

## 🔧 Environment Variables

Set these in your hosting platform:

**For Demo/Development:**
```
VITE_API_BASE_URL=http://localhost:3000
VITE_ENABLE_MOCK_DATA=true
VITE_ENABLE_ANALYTICS=false
```

**For Production:**
```
VITE_API_BASE_URL=https://api.chimera-protocol.com
VITE_ENABLE_MOCK_DATA=false
VITE_ENABLE_ANALYTICS=true
```

### Setting Variables in Vercel
1. Go to Project Settings → Environment Variables
2. Add each variable
3. Redeploy

### Setting Variables in Netlify
1. Go to Site Settings → Environment Variables
2. Add each variable
3. Redeploy

## 🐛 Common Issues

### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### 404 on Page Refresh
- **Vercel**: Already configured in `vercel.json`
- **Netlify**: Already configured in `netlify.toml`
- **Other platforms**: Configure SPA routing

### Environment Variables Not Working
- Ensure they start with `VITE_`
- Redeploy after adding variables
- Check platform dashboard for typos

## 📚 Need More Details?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment documentation.

## 🎉 Post-Deployment

After deployment:
1. Visit your live URL
2. Test all pages and navigation
3. Check browser console for errors
4. Run Lighthouse audit
5. Share with your team!

## 💡 Pro Tips

- **Custom Domain**: Add in platform settings
- **SSL**: Automatically provided by Vercel/Netlify
- **Analytics**: Enable in environment variables
- **Monitoring**: Use platform's built-in analytics

## 🆘 Need Help?

- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for troubleshooting
- Review platform documentation
- Test production build locally first
