# 🚀 Vercel Deployment Guide

This guide will help you deploy your Kindle Book Archive application to Vercel in just a few minutes.

## 📋 Prerequisites

- [GitHub account](https://github.com)
- [Vercel account](https://vercel.com) (free tier is sufficient)
- Git installed on your local machine
- Your project code ready

## 🛠️ Pre-Deployment Setup

### 1. Verify Project Structure

Ensure your project has this structure:
```
├── api/                    # Vercel serverless functions
│   ├── search.js          # Book search API
│   ├── summarize.js       # AI summary API
│   ├── health.js          # Health check API
│   └── package.json       # API dependencies
├── client/                # React frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── .env.production
│   └── ...
├── vercel.json            # Vercel configuration
├── .vercelignore          # Files to ignore
├── package.json           # Root package.json
└── README.md
```

### 2. Environment Variables

You'll need these environment variables for production:

#### Required:
- None (the app works with fallback summaries)

#### Optional (for AI summaries):
- `GEMINI_API_KEY` - Your Google Gemini API key

## 🚀 Deployment Methods

### Method 1: Deploy via Vercel Dashboard (Recommended)

#### Step 1: Push to GitHub
```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Ready for Vercel deployment"

# Add your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

#### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will automatically detect the configuration

#### Step 3: Configure Deployment
1. **Framework Preset**: Vercel should auto-detect "Other"
2. **Root Directory**: Leave as `.` (root)
3. **Build Command**: `npm run vercel-build`
4. **Output Directory**: `client/build`
5. **Install Command**: `npm install`

#### Step 4: Add Environment Variables (Optional)
1. In the Vercel dashboard, go to your project
2. Navigate to "Settings" → "Environment Variables"
3. Add `GEMINI_API_KEY` if you have one:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Your Gemini API key
   - **Environment**: Production

#### Step 5: Deploy
1. Click "Deploy"
2. Wait for the build to complete (2-3 minutes)
3. Your app will be live at `https://your-project-name.vercel.app`

### Method 2: Deploy via Vercel CLI

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Login to Vercel
```bash
vercel login
```

#### Step 3: Deploy
```bash
# From your project root
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? (enter your preferred name)
# - Directory? ./
```

#### Step 4: Set Environment Variables (Optional)
```bash
# Add Gemini API key if you have one
vercel env add GEMINI_API_KEY production
```

#### Step 5: Deploy to Production
```bash
vercel --prod
```

## ✅ Post-Deployment Verification

### 1. Test the Application
Visit your deployed URL and test:
- [ ] Homepage loads correctly
- [ ] Search functionality works
- [ ] Book cards display properly
- [ ] Pagination works
- [ ] AI summaries work (or fallback text appears)
- [ ] Responsive design on mobile

### 2. Test API Endpoints
Your API endpoints will be available at:
- `https://your-app.vercel.app/api/search?q=test`
- `https://your-app.vercel.app/api/health`
- `https://your-app.vercel.app/api/summarize` (POST)

### 3. Performance Check
- [ ] Page loads in under 3 seconds
- [ ] Search results appear quickly
- [ ] Images load properly
- [ ] Animations are smooth

## 🔧 Configuration Details

### Vercel.json Explained
```json
{
  "version": 2,
  "builds": [
    {
      "src": "client/package.json",    // Build the React app
      "use": "@vercel/static-build",   // Use static build
      "config": {
        "distDir": "build"             // Output directory
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",              // API routes
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",                  // All other routes to React app
      "dest": "/client/$1"
    }
  ]
}
```

### Environment Variables in Production
The app automatically uses:
- `REACT_APP_API_URL=/api` (relative URLs for same domain)
- Fallback summaries if no Gemini API key is provided

## 🔄 Continuous Deployment

Once connected to GitHub, Vercel will automatically:
- Deploy on every push to main branch
- Create preview deployments for pull requests
- Run builds and tests automatically

## 🐛 Troubleshooting

### Common Issues and Solutions

#### Build Fails
```bash
# Error: Module not found
# Solution: Check package.json dependencies
cd client && npm install
```

#### API Routes Don't Work
- Verify `api/` folder is in project root
- Check `vercel.json` routing configuration
- Ensure API functions export properly

#### Environment Variables Not Working
- Add variables in Vercel dashboard
- Redeploy after adding variables
- Check variable names (case-sensitive)

#### CORS Issues
- API functions include CORS headers
- Check browser network tab for errors
- Verify API URLs are correct

### Performance Issues
```bash
# Large bundle size
# Solution: Check for unnecessary dependencies
npm run build
# Check build/static/js/ file sizes
```

## 📊 Monitoring and Analytics

### Vercel Analytics (Optional)
1. Go to your project dashboard
2. Navigate to "Analytics" tab
3. Enable analytics for performance monitoring

### Function Logs
- View real-time logs in Vercel dashboard
- Check "Functions" tab for API performance
- Monitor error rates and response times

## 🔐 Security Considerations

### API Rate Limiting
- Built-in rate limiting in API functions
- Caching reduces external API calls
- CORS properly configured

### Environment Variables
- Never commit API keys to Git
- Use Vercel environment variables for secrets
- Separate development and production configs

## 🚀 Advanced Deployment Options

### Custom Domain
1. Go to project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Configure DNS records as instructed

### Preview Deployments
- Every pull request gets a preview URL
- Test changes before merging
- Share preview links with team

### Branch Deployments
```bash
# Deploy specific branch
vercel --prod --target production
```

## 📈 Scaling Considerations

### Vercel Limits (Free Tier)
- 100GB bandwidth per month
- 100 serverless function invocations per day
- 10 second function timeout

### Upgrading
- Pro plan: $20/month per member
- Increased limits and team features
- Priority support

## ✨ Success! Your App is Live

Once deployed, your Kindle Book Archive will be available at:
```
https://your-project-name.vercel.app
```

Share it with the world! 🌍

---

## 📞 Need Help?

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **GitHub Issues**: Create an issue in your repository
- **Community**: Join the Vercel Discord community

**Happy Deploying! 🎉**