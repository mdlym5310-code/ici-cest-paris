# Firebase Setup Guide 🔥

## Why products aren't showing up

If you're adding products through the admin panel but they're not appearing on the main page, it's because **Firebase is not configured yet**. The code is currently using placeholder values.

## Quick Setup (5 minutes)

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or select an existing project
3. Enter project name: `ici-cest-paris-store` (or any name)
4. Follow the setup wizard (disable Google Analytics if you want)

### Step 2: Enable Realtime Database

1. In your Firebase project, click **"Realtime Database"** in the left menu
2. Click **"Create Database"**
3. Choose **"Start in test mode"** (we'll secure it later)
4. Select a location (choose closest to your users, e.g., `europe-west1`)
5. Click **"Done"**

### Step 3: Get Your Firebase Config

1. Click the **⚙️ Settings icon** (gear) next to "Project Overview"
2. Scroll down to **"Your apps"** section
3. Click the **</> Web icon** to add a web app
4. Register your app with a nickname (e.g., "ici-cest-paris")
5. **Copy the config object** that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### Step 4: Update Your Code

**Update `script.js`** (around line 22):
- Replace the placeholder `firebaseConfig` with your actual config

**Update `admin.html`** (around line 154):
- Replace the placeholder `firebaseConfig` with your actual config
- **IMPORTANT**: Use the SAME config in both files!

### Step 5: Set Security Rules

1. Go to **Realtime Database** > **Rules** tab
2. Replace the rules with:

```json
{
  "rules": {
    "products": {
      ".read": true,
      ".write": true
    }
  }
}
```

3. Click **"Publish"**

⚠️ **Note**: These rules allow anyone to read/write. For production, you should add authentication.

### Step 6: Test It!

1. Open `admin.html` in your browser
2. Enter password: `paris2026`
3. Add a test product
4. Check the browser console (F12) for messages
5. Open `index.html` - your product should appear!

## Troubleshooting

### Products still not showing?

1. **Check Browser Console** (F12):
   - Look for Firebase errors
   - Should see: "✅ Connected to Firebase"

2. **Verify Config**:
   - Make sure `script.js` and `admin.html` have the SAME config
   - No typos in the config values

3. **Check Firebase Console**:
   - Go to Realtime Database > Data tab
   - You should see a `products` node with your products

4. **Check Security Rules**:
   - Rules should allow `.read: true` and `.write: true` for `products`

5. **Clear Browser Cache**:
   - Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### Common Errors

**Error: "Permission denied"**
- Solution: Update security rules (Step 5)

**Error: "Firebase SDK not loaded"**
- Solution: Check internet connection, Firebase SDK loads from CDN

**Error: "Configuration not found"**
- Solution: Double-check your config values in both files

**Products save but don't appear**
- Solution: Make sure both files use the SAME Firebase config
- Check that `connectToFirebase()` is being called in `script.js`

## Production Security (Optional)

For production, you should secure your database:

```json
{
  "rules": {
    "products": {
      ".read": true,
      ".write": false,
      "$productId": {
        ".write": "auth != null || newData.child('adminKey').val() === 'your-secret-key'"
      }
    }
  }
}
```

Then add authentication to your admin panel.

## Need Help?

1. Check browser console (F12) for error messages
2. Verify Firebase config matches in both files
3. Check Firebase Console > Realtime Database > Data tab
4. Ensure security rules allow read/write access

---

**Once configured, products added in admin.html will appear instantly on index.html!** 🎉
