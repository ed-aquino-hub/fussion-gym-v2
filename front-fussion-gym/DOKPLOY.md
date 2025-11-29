# Dokploy Configuration for FUSSION GYM Frontend

## Application Settings

### Build Configuration
- **Build Command**: `npm run build`
- **Install Command**: `npm install`
- **Start Command**: `npm start`
- **Output Directory**: `dist`
- **Port**: `3000`

### Environment Variables
Add in Dokploy dashboard:
```
VITE_API_URL=https://gym-back.donita.site/api
```

### Advanced Settings
- **Node Version**: 18 or higher
- **Package Manager**: npm

## Deployment Steps

1. **Create New Application in Dokploy**
   - Type: Node.js Application
   - Name: fussion-gym-frontend

2. **Connect GitHub Repository**
   - Repository: `ed-aquino-hub/fussion-gym-v2`
   - Branch: `MVP-v3`
   - Root Directory: `front-fussion-gym`

3. **Configure Build Settings**
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Port: `3000`

4. **Add Environment Variable**
   - Key: `VITE_API_URL`
   - Value: `https://gym-back.donita.site/api`

5. **Deploy**
   - Click "Deploy" button
   - Wait for build to complete
   - Access your app via the Dokploy-provided URL

## Health Check
The app will be available at: `http://your-dokploy-url:3000`

## Troubleshooting

### If build fails:
- Check that Node.js version is 18+
- Verify all dependencies are in package.json
- Check build logs for errors

### If app doesn't start:
- Ensure `serve` package is installed
- Check that `dist` folder exists after build
- Verify port 3000 is available

### If API calls fail:
- Verify VITE_API_URL environment variable is set
- Check that backend is accessible from frontend server
- Look for CORS errors in browser console
