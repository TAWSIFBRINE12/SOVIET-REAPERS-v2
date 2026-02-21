# Soviet Reapers Platform - Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Google OAuth credentials

## Step 1: Set Up Google OAuth

### 1.1 Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project: "Soviet Reapers"
3. Enable the Google+ API

### 1.2 Create OAuth 2.0 Credentials
1. Go to "Credentials" in the left menu
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - `http://localhost:5000/auth/google/callback`
   - `https://yourdomain.com/auth/google/callback` (for production)
5. Copy your Client ID and Client Secret

### 1.3 Configure Backend
Create `.env` file in the `server/` directory: