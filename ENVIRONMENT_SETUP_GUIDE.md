# Environment Variables Setup Guide

## Overview

This project uses Vite environment variables for configuration. Environment variables prefixed with `VITE_` are exposed to your client-side code via `import.meta.env`.

## Available Environment Variables

### Required Variables
- `VITE_API_BASE_URL`: The base URL for your API (e.g., `https://your-api-domain.com/api`)
- `VITE_API_KEY`: Your API key for authentication

### Optional Variables
- `VITE_APP_ENV`: Environment mode (`development` or `production`)
- `VITE_APP_NAME`: Application name
- `VITE_APP_VERSION`: Application version

## Setup Instructions

### 1. Create Environment File
Copy the example file to create your local environment configuration:

```bash
cp .env.example .env
```

### 2. Configure Your Variables
Edit the `.env` file with your actual values:

```env
# API Configuration
VITE_API_BASE_URL=https://seagreen-mink-431224.hostingersite.com/api
VITE_API_KEY=mh8bUvdGP2xD9P4J3BZPYvr6noPBwEwZ

# Environment Mode
VITE_APP_ENV=development
```

### 3. Usage in Code
Access environment variables in your TypeScript/JavaScript code:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'fallback-url';
const API_KEY = import.meta.env.VITE_API_KEY || 'fallback-key';
```

## Environment-Specific Configuration

### Development
- Use `.env` for local development
- Variables are loaded from `.env` file
- Fallback values are used if variables are not set

### Production
- Set environment variables on your hosting platform
- For Vercel/Netlify: Use platform's environment variable settings
- For traditional hosting: Set system environment variables

## Security Notes

- Never commit `.env` files to version control
- The `.env` file is gitignored by default
- Use different API keys for development and production
- Consider using environment variable management in your CI/CD pipeline

## Troubleshooting

1. **Variables not loading**: Ensure variables are prefixed with `VITE_`
2. **Changes not reflected**: Restart the development server after changing `.env`
3. **Build issues**: Check that all required variables are set for production

## Best Practices

- Use descriptive variable names
- Provide meaningful fallback values
- Document all environment variables
- Use different values for different environments
- Regularly rotate API keys in production
