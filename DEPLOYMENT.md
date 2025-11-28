# Chimera Protocol - Deployment Guide

This guide covers deploying the Chimera Protocol frontend to various hosting platforms.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Build Configuration](#build-configuration)
- [Deployment Platforms](#deployment-platforms)
  - [Vercel (Recommended)](#vercel-recommended)
  - [Netlify](#netlify)
  - [GitHub Pages](#github-pages)
  - [AWS S3 + CloudFront](#aws-s3--cloudfront)
- [Testing Production Build Locally](#testing-production-build-locally)
- [Post-Deployment Checklist](#post-deployment-checklist)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js 20.x or higher
- npm or yarn package manager
- Git repository
- Account on chosen hosting platform

## Environment Variables

The application uses environment variables for configuration. Create appropriate `.env` files:

### Development (.env)
```bash
VITE_API_BASE_URL=http://localhost:3000
VITE_ENABLE_MOCK_DATA=true
VITE_ENABLE_ANALYTICS=false
```

### Production (.env.production.local)
```bash
VITE_API_BASE_URL=https://api.chimera-protocol.com
VITE_ENABLE_MOCK_DATA=false
VITE_ENABLE_ANALYTICS=true
# VITE_ANALYTICS_ID=your-analytics-id
```

**Important:** Never commit `.env.production.local` to version control. It's already excluded in `.gitignore`.

## Build Configuration

The project uses Vite with optimized production settings:

### Build Features
- **Code Splitting**: Separate chunks for React, Three.js, UI libraries
- **Minification**: Terser with console.log removal
- **Source Maps**: Enabled for debugging
- **Asset Optimization**: Organized folder structure for images, fonts, JS
- **Tree Shaking**: Removes unused code
- **Compression**: Gzip/Brotli ready

### Build Command
```bash
npm run build
```

This will:
1. Run TypeScript type checking (`tsc -b`)
2. Build optimized production bundle
3. Output to `dist/` directory

### Build Output
```
dist/
├── index.html
├── assets/
│   ├── js/
│   │   ├── react-vendor-[hash].js
│   │   ├── three-vendor-[hash].js
│   │   ├── ui-vendor-[hash].js
│   │   └── [name]-[hash].js
│   ├── images/
│   └── fonts/
```

## Deployment Platforms

### Vercel (Recommended)

Vercel provides the best experience for Vite applications with zero configuration.

#### Quick Deploy

1. **Install Vercel CLI** (optional)
   ```bash
   npm install -g vercel
   ```

2. **Deploy via CLI**
   ```bash
   vercel
   ```

3. **Or Deploy via Git Integration**
   - Push code to GitHub/GitLab/Bitbucket
   - Import project in Vercel dashboard
   - Vercel auto-detects Vite configuration

#### Configuration

The `vercel.json` file is already configured with:
- SPA routing (all routes → index.html)
- Security headers
- Asset caching (1 year for hashed assets)
- Environment variables

#### Environment Variables in Vercel

1. Go to Project Settings → Environment Variables
2. Add production variables:
   - `VITE_API_BASE_URL`
   - `VITE_ENABLE_MOCK_DATA`
   - `VITE_ENABLE_ANALYTICS`

#### Custom Domain

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

### Netlify

Netlify is another excellent option with similar features.

#### Quick Deploy

1. **Install Netlify CLI** (optional)
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy via CLI**
   ```bash
   netlify deploy --prod
   ```

3. **Or Deploy via Git Integration**
   - Push code to GitHub/GitLab/Bitbucket
   - Import project in Netlify dashboard
   - Build settings are auto-detected from `netlify.toml`

#### Configuration

The `netlify.toml` file is already configured with:
- Build command and output directory
- SPA routing redirects
- Security headers
- Content Security Policy
- Asset caching

#### Environment Variables in Netlify

1. Go to Site Settings → Environment Variables
2. Add production variables (same as Vercel)

### GitHub Pages

GitHub Pages is free but requires additional configuration for SPAs.

#### Setup

1. **Install gh-pages package**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   ```json
   {
     "homepage": "https://yourusername.github.io/chimera-protocol",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Add 404.html for SPA routing**
   Create `public/404.html` that redirects to index.html

4. **Deploy**
   ```bash
   npm run deploy
   ```

#### Limitations
- No server-side configuration
- No custom headers
- Requires workaround for SPA routing

### AWS S3 + CloudFront

For enterprise deployments with full control.

#### Setup

1. **Create S3 Bucket**
   - Enable static website hosting
   - Configure bucket policy for public read

2. **Build and Upload**
   ```bash
   npm run build
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

3. **Create CloudFront Distribution**
   - Origin: S3 bucket
   - Default root object: index.html
   - Error pages: 404 → /index.html (for SPA routing)
   - Enable Gzip/Brotli compression

4. **Configure Custom Domain**
   - Add CNAME record in Route 53
   - Configure SSL certificate in ACM

## Testing Production Build Locally

Before deploying, test the production build locally:

### 1. Build the Application
```bash
npm run build
```

### 2. Preview the Build
```bash
npm run preview
```

This starts a local server serving the production build at `http://localhost:4173`

### 3. Test Checklist

- [ ] All pages load correctly
- [ ] Navigation works (no 404s)
- [ ] 3D brain visualization renders
- [ ] Animations are smooth
- [ ] No console errors
- [ ] Assets load correctly (images, fonts)
- [ ] Responsive design works
- [ ] Performance is acceptable (Lighthouse score)

### 4. Run Lighthouse Audit

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse http://localhost:4173 --view
```

**Target Scores:**
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 80

## Post-Deployment Checklist

After deploying to production:

- [ ] Verify all pages are accessible
- [ ] Test navigation flows
- [ ] Check browser console for errors
- [ ] Verify environment variables are correct
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on different devices (desktop, tablet)
- [ ] Verify custom domain works (if configured)
- [ ] Check SSL certificate is valid
- [ ] Test performance with real network conditions
- [ ] Verify analytics are working (if enabled)
- [ ] Check security headers (use securityheaders.com)
- [ ] Test error pages (404, etc.)

## Troubleshooting

### Build Fails

**Issue:** TypeScript errors during build
```bash
# Check for type errors
npm run build
```
**Solution:** Fix TypeScript errors in source code

**Issue:** Out of memory during build
```bash
# Increase Node memory
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

### Routing Issues

**Issue:** 404 errors on page refresh
**Solution:** Ensure SPA routing is configured:
- Vercel: `vercel.json` rewrites
- Netlify: `netlify.toml` redirects
- Other platforms: Configure server to serve index.html for all routes

### Performance Issues

**Issue:** Large bundle size
**Solution:**
- Check bundle analysis: `npm run build -- --mode analyze`
- Ensure code splitting is working
- Lazy load heavy components (Three.js)

**Issue:** Slow 3D rendering
**Solution:**
- Reduce polygon count in brain mesh
- Optimize particle systems
- Use lower quality on mobile devices

### Environment Variables Not Working

**Issue:** Variables are undefined in production
**Solution:**
- Ensure variables are prefixed with `VITE_`
- Set variables in hosting platform dashboard
- Rebuild after changing variables

### CORS Errors

**Issue:** API requests fail with CORS errors
**Solution:**
- Configure CORS on backend API
- Ensure `VITE_API_BASE_URL` is correct
- Check API endpoint is accessible

## Performance Optimization Tips

### 1. Enable Compression
Most platforms enable Gzip/Brotli automatically, but verify:
```bash
curl -H "Accept-Encoding: gzip" -I https://your-domain.com
```

### 2. Configure CDN Caching
- Static assets: Cache for 1 year (already configured)
- HTML: No cache or short cache (5 minutes)

### 3. Preload Critical Assets
Add to `index.html`:
```html
<link rel="preload" href="/assets/fonts/main.woff2" as="font" type="font/woff2" crossorigin>
```

### 4. Use WebP Images
Convert images to WebP format for better compression

### 5. Monitor Performance
- Use Vercel Analytics or Netlify Analytics
- Set up error tracking (Sentry, LogRocket)
- Monitor Core Web Vitals

## Security Best Practices

### 1. Security Headers
Already configured in `vercel.json` and `netlify.toml`:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: Restrict camera, microphone, geolocation

### 2. Content Security Policy
Configure CSP to prevent XSS attacks (already in netlify.toml)

### 3. HTTPS Only
- Always use HTTPS in production
- Enable HSTS (HTTP Strict Transport Security)

### 4. Dependency Security
```bash
# Regular security audits
npm audit

# Fix vulnerabilities
npm audit fix
```

## Continuous Deployment

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - run: npm test
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## Support

For deployment issues:
- Check platform documentation (Vercel, Netlify, etc.)
- Review build logs for errors
- Test production build locally first
- Verify environment variables are set correctly

## Additional Resources

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [React Router Deployment](https://reactrouter.com/en/main/guides/deployment)
