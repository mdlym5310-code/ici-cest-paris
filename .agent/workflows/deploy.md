---
description: How to deploy the DLMSTREET website
---

# Deployment Workflow

To deploy your site, follow these simple steps:

### Option 1: Drag & Drop (Fastest)
1. Open your browser and go to [vercel.com/import/deploy](https://vercel.com/import/deploy).
2. Open the folder `c:\Users\dalim\OneDrive\Desktop\DLMSTREET` in your File Explorer.
3. Drag the **entire folder** onto the Vercel upload area.
4. Wait for the deployment to finish (~1 minute).
5. Your site will be live at a custom `vercel.app` URL!

### Option 2: Using Git & GitHub (Recommended)
1. Create a new repository on GitHub named `dlmstreet`.
2. Run these commands in your terminal:
   ```bash
   cd c:\Users\dalim\OneDrive\Desktop\DLMSTREET
   git init
   git add .
   git commit -m "Initial commit of DLMSTREET"
   git branch -M main
   git remote add origin https://github.com/mdlym5310/dlmstreet.git
   git push -u origin main
   ```
3. Go to **Settings > Pages** on your GitHub repository.
4. Select the `main` branch and `/root` folder, then click **Save**.