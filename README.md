🚀 Weyra Dashboard - Modern Glassmorphism Admin Console

A high-performance, visually stunning dashboard built with Next.js, TanStack Query, and Supabase. This project focuses on superior UI/UX, robust state management, and clean architectural patterns.

✨ Features
- Modern UI/UX: Full Glassmorphism design with backdrop blurs, semi-transparent cards, and vibrant gradients.
- Authentication: Secure Sign Up and Sign In flow powered by Supabase Auth.
- State Management:
  - Server State: Managed via TanStack Query (caching, pagination, and background fetching).
  - Client State: Global Auth and Theme states managed via React Context API.
- Responsive Layout:
  - Collapsible Sidebar with mobile-first overlay logic.
  - Sticky Navbar with user profile dropdown and theme switching.
- Data Integration: Real-time data fetching from DummyJSON API featuring:
  - Interactive Tables with pagination.
  - Detailed Product Modals.
  - User Profile Popovers.
    
🛠️ Tech Stack
- Framework: Next.js (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- Auth: Supabase
- Data Fetching: TanStack Query (React Query)
- Icons: Lucide React
- Avatars: DiceBear API

📂 Architecture

The project follows a modular and scalable folder structure as per architecture expectations:
``` 
├── api/              # Service layer for API calls (DummyJSON)
├── app/              # Next.js App Router (Pages & Layouts)
│   ├── (auth)/       # Login & Register routes
│   ├── dashboard/    # Main Protected View
│   ├── carts/        # Data List & Detail routes
│   └── globals.css   # Theme variables & Glassmorphism utils
├── components/       # Reusable UI components (Sidebar, Navbar, Modals)
├── context/          # Global Contexts (Auth, Theme)
├── hooks/            # Custom TanStack Query hooks
├── lib/              # Third-party client initializations (Supabase)
└── provider/         # App-wide context providers
```
🚀 Getting Started
1. Clone the repository
```
Bash
git clone https://github.com/your-username/modern-dashboard.git
cd modern-dashboard
```
2. Install dependencies
```
Bash
npm install
```
3. Environment Setup
Create a .env.local file in the root directory and add your Supabase credentials:
```
Env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
4. Run the development server
```
Bash
npm run dev
```
📊 Data Implementation
- Pagination: Uses TanStack Query's keepPreviousData to ensure seamless page transitions in the Cart History.
- Skeletons: Custom CSS/Tailwind pulse animations provide visual feedback during data fetching.
- Optimization: API responses are cached for 5-10 minutes to reduce network load.
