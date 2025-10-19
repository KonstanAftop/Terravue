# Epic 1: Foundation & Authentication

**Epic Goal:** Establish the core Terravue platform infrastructure with user authentication, basic navigation, and a functional dashboard that displays carbon market data and user summaries, creating a deployable foundation that delivers immediate value to users.

## Story 1.1: Project Setup and Infrastructure

As a developer,
I want to establish the core project structure and deployment pipeline,
so that the team can develop and deploy Terravue efficiently.

### Acceptance Criteria
1. Monorepo structure created with frontend (React/TypeScript) and backend (Node.js/Express) folders
2. Mock data generators configured for users, lands, transactions, and market data
3. Package.json scripts configured for easy development startup (npm run dev)
4. Basic health check endpoints return 200 status for both frontend and backend
5. Environment configuration supports local development with .env files
6. Local development servers configured (React dev server + Express server)
7. In-memory data structures initialized with realistic dummy data on server start

## Story 1.2: User Authentication System

As a potential Terravue user,
I want to register and login securely with role-based access,
so that I can access platform features appropriate to my user type.

### Acceptance Criteria
1. Registration form accepts email, password, full name, and user type (Landowner/Buyer)
2. Email verification required before account activation
3. Login form authenticates users and creates secure sessions
4. Password reset functionality via email link
5. Role-based access control distinguishes between landowner and buyer permissions
6. User sessions persist across browser sessions and expire after 7 days of inactivity
7. Authentication state managed consistently across all application pages

## Story 1.3: Core Navigation and Layout

As a Terravue user,
I want to navigate between platform sections easily,
so that I can access all available features efficiently.

### Acceptance Criteria
1. Sidebar navigation displays Terravue logo and all main sections as specified in prompt.md
2. Navigation sections include: Dashboard, Kelola Lahan, Peta Dunia, Market Karbon, Profil & Aktivitas
3. Active navigation state clearly indicates current page location
4. Responsive design maintains navigation usability on mobile devices
5. Logout functionality accessible from navigation with confirmation prompt
6. Navigation permissions hide/show sections based on user role (landowner vs buyer)
7. Loading states display during page transitions

## Story 1.4: Dashboard Implementation

As a Terravue user,
I want to see a comprehensive dashboard with key information and metrics,
so that I can quickly understand market status and my account activity.

### Acceptance Criteria
1. Simulated Indonesian carbon price display with realistic fluctuations (no external API)
2. Trending topics section with placeholder carbon market news and insights
3. User land summary showing count of registered parcels and verification status
4. Interactive mini-map displaying user's land locations (if any)
5. Carbon absorption progress charts with sample monitoring data
6. Notifications panel for system announcements and user-specific updates
7. Quick action buttons for common tasks (Add Land, View Market, etc.)
8. Dashboard data refreshes automatically every 30 seconds
9. Mobile-responsive layout maintains all functionality on smaller screens

