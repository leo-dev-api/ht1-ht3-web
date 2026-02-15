# HT1-HT3 Settings - Premium PvP Pack Platform

A modern, professional website for hosting and distributing PvP texture packs, overlays, mods, and settings packs. Built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

### User Features
- Browse packs with advanced filtering (by category, sort by newest/downloads/rating)
- Search functionality across pack names, creators, and descriptions
- View detailed pack information with screenshots
- Rate packs (1-5 stars)
- Download tracking
- Featured packs section
- Responsive design for all devices

### Admin Features
- Secure admin authentication using admin keys
- Pack management (create, edit, delete)
- Admin key generator with configurable options:
  - Single-use or multi-use keys
  - Optional usage limits
  - Optional expiration dates
  - Activate/deactivate keys
- Real-time pack statistics

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Authentication + RLS)
- **Build Tool**: Vite
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Supabase:
   - Update `.env` file with your Supabase credentials:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. The database schema has been automatically applied to your Supabase instance

### Running Locally

Development mode runs automatically. Open your browser to view the site.

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Admin Access

### Default Master Key

A default master admin key has been created:
```
HT1-MASTER-KEY-2024
```

Use this key to log in as an admin for the first time. You can then generate additional admin keys with different permissions.

### Generating Admin Keys

1. Log in with an admin key
2. Open the Admin Panel
3. Click "Manage Admin Keys"
4. Click "Generate New Key"
5. Configure the key options:
   - **Created By**: Your name or identifier
   - **Usage Type**: Single-use or Multi-use
   - **Max Uses**: Optional limit on number of uses
   - **Expires At**: Optional expiration date

## Database Schema

### Tables

- **packs**: Stores all pack information
- **admin_keys**: Manages admin authentication keys
- **admin_sessions**: Tracks admin login sessions
- **pack_ratings**: Stores user ratings for packs

### Security

All tables have Row Level Security (RLS) enabled:
- Packs are publicly readable, admin-writable
- Ratings are publicly readable, anyone can submit
- Admin keys are only accessible to authenticated admins
- Sessions are used for admin verification

## Usage

### Adding a Pack

1. Log in as admin
2. Click "Admin Panel"
3. Click "Add New Pack"
4. Fill in the pack details:
   - Name, creator, version
   - Category
   - Description
   - Thumbnail URL (use stock photos from Pexels)
   - Download URL
   - Optional: Mark as featured

### Managing Packs

From the Admin Panel, you can:
- Edit existing packs
- Delete packs
- Toggle featured status

### Pack Categories

- Texture Packs
- Overlays
- Mods
- Settings Packs

## Deployment

This project can be deployed to:
- Vercel (recommended for Vite projects)
- Netlify
- Any static hosting service

Make sure to set your environment variables in the hosting platform.

## Features Roadmap

- [ ] Image upload to Supabase Storage
- [ ] Multiple screenshots per pack
- [ ] User comments and reviews
- [ ] Pack version history
- [ ] Discord webhook notifications
- [ ] Theme switcher (dark/light mode)

## Support

For issues or questions, please open an issue in the repository.

## License

All rights reserved © 2024 HT1-HT3 Settings
