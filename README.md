# ⚡ Talentron '26 Official Entry Form

The official registration portal for **Talentron '26**, a premier inter-college cultural festival hosted at **Zeal College of Engineering and Research (ZCOER), Pune**. This application is designed to handle high-volume registrations for various categories including Music, Dance, Drama, Band, and Street Play.

![Talentron Banner](public/assets/logos/Logo-Star.jpg)

## ✨ Features

- **🎨 Pop-Art Aesthetic**: A bold, modern, and vibrant design language featuring thick borders, multi-colored shadows, and interactive glassmorphism.
- **📱 PWA Ready**: Fully installable as a Progressive Web App for a native mobile experience.
- **🔍 SEO Optimized**: Dynamic meta tags and clean URL structures using `BrowserRouter` for maximum discoverability.
- **🛡️ Secure Implementation**: Zero hardcoded secrets. Environment-based configuration for sensitive API endpoints and payment IDs.
- **📶 Offline Capabilities**: Service worker implementation for basic offline caching and faster load times.
- **💳 Multi-modal Payment**: manual UPI verification with dynamic QR code generation and mobile deep-linking Support.
- **🚦 Smart Validation**: Real-time age calculation (16-35) and field validation to ensure clean data submission.
- **📊 Form Progress Persistence**: 3-step intuitive registration flow with file upload support.

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Vanilla CSS (Premium Design System)
- **Routing**: React Router 7 (`BrowserRouter`)
- **Backend Data**: Google Apps Script (Custom execution engine)
- **Deployment**: Vercel

## 🚀 Getting Started

### Local Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Shravan4507/talentron-entry-form.git
   cd talentron-entry-form
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the example file and fill in your keys:

   ```bash
   cp .env.example .env
   ```

   _Required Variables:_
   - `VITE_UPI_ID`: Your UPI ID for receiving payments.
   - `VITE_SCRIPT_URL`: The endpoint URL for the backend Google App Script.

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

### 🚢 Deployment (Vercel)

This project is optimized for **Vercel**. When deploying:

1. Connect your GitHub repository to Vercel.
2. In the **Environment Variables** settings, add `VITE_UPI_ID` and `VITE_SCRIPT_URL`.
3. Vercel will automatically detect the `vercel.json` config and handle SPA routing.

## 📁 Project Structure

```text
src/
├── components/     # Reusable UI components (Navbar, Footer, SEO, etc.)
├── pages/          # Page views (Home, Competitions, Registration, Legal, 404)
├── data/           # JSON data for colleges and competition details
├── utils/          # Helper functions and asset path managers
└── App.tsx         # Main routing and global layout
```

## 📜 License & Author

Handcrafted by **[Shrvan](https://www.instagram.com/069.f5/)**.

© 2026 Talentron. All rights reserved.
Official Initiative of Zeal College of Engineering and Research, Pune.
