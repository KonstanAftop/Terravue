# TerraVue - Indonesian Carbon Market Platform Product Requirements Document (PRD)

## Goals and Background Context

### Goals
- Create Indonesia's premier carbon market platform with real-time pricing and transparent trading
- Enable landowners to manage, verify, and monetize their forest carbon assets through digital tools
- Provide interactive global mapping for verified carbon projects and market transparency
- Establish a stock-trading-like interface for carbon credit transactions
- Generate comprehensive ESG reporting and activity tracking for all users
- Achieve market leadership as the go-to platform for Indonesian carbon market participation

### Background Context

TerraVue addresses Indonesia's fragmented carbon market by providing a comprehensive digital platform that combines land management, geospatial verification, and carbon trading in one integrated solution. The platform serves both landowners seeking to monetize their forest carbon and institutional buyers requiring verified, transparent carbon credits.

Unlike general financial platforms, TerraVue focuses exclusively on carbon markets with specialized features including interactive global mapping, satellite-based verification, real-time carbon pricing, and comprehensive ESG reporting capabilities designed specifically for the Indonesian carbon market ecosystem.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|---------|
| 2024-10-10 | 1.0 | Initial PRD creation aligned with TerraVue navigation structure | PM Agent |

## Requirements

### Functional Requirements

#### Dashboard Utama (Homepage)
**FR1:** The platform must display real-time Indonesian carbon prices with automatic updates or simulation data  
**FR2:** The system must provide trending topics and insights section with carbon market news and articles  
**FR3:** Users must see a summary of their land holdings including verification status and carbon potential  
**FR4:** The dashboard must include an interactive mini-map visualization of user's land locations  
**FR5:** The platform must display carbon absorption progress charts with monitoring data  
**FR6:** The system must provide notifications and announcements for verification updates and market events  

#### Kelola Lahan (Land Management)
**FR7:** Users must be able to view, search, and sort their complete land portfolio  
**FR8:** The platform must provide functionality to add new land with basic data input forms  
**FR9:** Each land parcel must have a detailed view showing coordinates, area, and verification status  
**FR10:** The system must include final verification forms before land registration  
**FR11:** Interactive mapping for land boundary marking must be available on dedicated map pages  
**FR12:** The platform must maintain activity history and updates for each land parcel  

#### Peta Dunia (Global Map)
**FR13:** The system must provide an interactive world map with verified land areas specially marked  
**FR14:** Clicking on regions must display popup details including owner, boundaries, verification status, and carbon estimates  
**FR15:** The platform must include search functionality for specific regions or areas  
**FR16:** Users must be able to filter regions by verification status and land categories  

#### Market Karbon (Carbon Market)
**FR17:** The platform must provide a stock-trading-like interface for carbon credit listings  
**FR18:** Landowners must be able to list their carbon credits for sale  
**FR19:** The system must support carbon credit purchase transactions with verification popups  
**FR20:** Real-time or simulated carbon market price charts must be available  
**FR21:** The platform must display recent transaction lists and purchase status tracking  

#### Profil & Aktivitas Pengguna (User Profile & Activity)
**FR22:** Users must be able to manage profile data and account settings  
**FR23:** The system must maintain complete transaction history for purchases and sales  
**FR24:** The platform must generate customizable ESG reports based on user requirements  
**FR25:** Documentation and FAQ sections must be accessible to all users  

#### Navigation & Authentication
**FR26:** The platform must provide sidebar navigation with TerraVue branding and all main sections  
**FR27:** The system must support secure user authentication and logout functionality  

### Non-Functional Requirements

**NFR1:** The platform must achieve 99.9% uptime for reliable market access  
**NFR2:** Real-time data updates must refresh within 30 seconds for pricing and market information  
**NFR3:** Interactive maps must load within 3 seconds and support smooth zooming/panning  
**NFR4:** The system must support up to 10,000 concurrent users during peak trading periods  
**NFR5:** All financial transactions must use simulated payment flows for local development (no real money)  
**NFR6:** The platform must implement basic security practices with local JWT authentication  
**NFR7:** Mobile responsiveness must be maintained across all sections and features  
**NFR8:** The system must use mock satellite imagery and simulated verification data with 100% success rate  
**NFR9:** In-memory data operations must respond within 100ms for all queries  
**NFR10:** The platform architecture must support future database integration without major refactoring

## User Interface Design Goals

### Overall UX Vision
TerraVue MVP will provide a clean, intuitive interface that prioritizes core carbon market functionality while maintaining the professional feel of financial trading platforms. The design emphasizes simplicity and clear information hierarchy to ensure users can quickly understand carbon pricing, manage their land assets, and execute transactions without confusion.

### Key Interaction Paradigms
- **Dashboard-first approach**: Users land on a comprehensive dashboard showing key metrics and actions
- **Map-centric navigation**: Interactive maps serve as primary navigation tools for land and market exploration
- **Trading-style interactions**: Familiar buy/sell interfaces similar to stock trading platforms
- **Progressive disclosure**: Complex features revealed gradually to avoid overwhelming new users
- **Mobile-first responsive design**: Optimized for field use on mobile devices

### Core Screens and Views (MVP Priority)
**Essential Screens:**
- **Login/Registration Screen**: Simple authentication with landowner vs buyer role selection
- **Main Dashboard**: Carbon prices, user land summary, recent activity, and quick actions
- **Land Management List**: Simple table view of user's land parcels with basic details
- **Add New Land Form**: Streamlined form for land registration with map picker
- **Basic Global Map**: Interactive map showing verified land areas (read-only for MVP)
- **Simple Carbon Market**: Basic listing view with buy/sell functionality
- **User Profile**: Account settings and basic transaction history

**Post-MVP Screens:**
- Advanced land detail pages with full verification workflows
- Comprehensive ESG reporting dashboard
- Advanced market analytics and charting
- Detailed mapping tools for boundary marking

### Accessibility: WCAG AA
MVP will implement WCAG AA compliance focusing on:
- Keyboard navigation for all interactive elements
- Screen reader compatibility for critical functions
- Color contrast ratios meeting AA standards
- Alt text for all map and chart visualizations

### Branding
**TerraVue MVP Branding Guidelines:**
- Clean, modern design with earth-tone color palette (greens, browns, blues)
- Professional typography suitable for financial data display
- Consistent iconography emphasizing sustainability and technology
- Logo placement in sidebar navigation as specified in prompt.md
- Trust-building visual elements to establish credibility in financial transactions

### Target Device and Platforms: Web Responsive
**MVP Platform Strategy:**
- **Primary**: Responsive web application optimized for desktop and mobile
- **Desktop focus**: Trading and detailed land management features
- **Mobile optimization**: Field data collection and basic monitoring
- **Browser support**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **No native mobile apps in MVP** - responsive web app sufficient for initial launch

## Technical Assumptions

### Repository Structure: Monorepo
**MVP Decision Rationale:**
- Single repository containing frontend, backend, and shared utilities
- Simplified deployment and version management for small team
- Easier code sharing between web and potential future mobile development
- Reduced complexity for initial development phase

### Service Architecture: Monolith
**MVP Architecture Decision:**
- Single deployable application with modular internal structure
- Faster initial development and deployment
- Easier debugging and monitoring for MVP phase
- Can be refactored to microservices as platform scales post-MVP
- Separate modules for: authentication, land management, trading, mapping, payments

### Testing Requirements: Unit + Integration
**MVP Testing Strategy:**
- Unit tests for core business logic (carbon calculations, pricing, verification)
- Integration tests for critical user flows (registration, land listing, transactions)
- Manual testing for UI/UX validation
- Automated testing for payment processing and data integrity
- No comprehensive E2E testing in MVP - focus on core functionality validation

### Additional Technical Assumptions and Requests

**Frontend Technology:**
- **React.js with TypeScript** for type safety and maintainable code
- **Material-UI or Tailwind CSS** for rapid UI development
- **Mapbox or Google Maps API** for interactive mapping features
- **Chart.js or D3.js** for carbon price visualization and progress charts

**Backend Technology:**
- **Node.js with Express.js** for rapid development and JavaScript consistency
- **In-memory data storage** using JavaScript objects and arrays for all data
- **Mock data generators** for realistic carbon market, land, and user data
- **JSON files** for static configuration and seed data only

**Third-Party Integrations (Local Development):**
- **Mock satellite imagery** using static images and simulated verification data
- **Simulated payment processing** with fake transaction flows (no real payments)
- **Local authentication** using JWT tokens and bcrypt password hashing
- **Local email simulation** using console logging or local SMTP testing tools

**Infrastructure & Deployment (Native Local Development):**
- **Native local development** using npm/yarn for package management
- **No database required** - all data stored in memory during runtime
- **Local file storage** for static assets (images, documents) only
- **HTTP development server** (no SSL complexity for local development)
- **Mock data resets** on server restart (no persistence needed)

**MVP Constraints (Dummy Data Only Focus):**
- **No external dependencies**: All services run locally without internet connectivity requirements
- **Dummy data only**: All data generated in-memory using mock data generators
- **No database setup**: Zero database configuration or installation required
- **Native development**: No containerization - direct npm/yarn and Node.js execution
- **Rapid prototyping**: Focus on UI/UX demonstration with realistic mock data
- **Easy startup**: Entire application runs with simple npm commands
- **Data resets on restart**: Fresh mock data generated each time server starts

## Epic List

Based on the TerraVue MVP requirements, I've structured the development into 4 sequential epics that each deliver significant value:

**Epic 1: Foundation & Authentication**  
Establish core project infrastructure, user authentication, and basic dashboard functionality to create a deployable foundation with initial user value.

**Epic 2: Land Management System**  
Enable landowners to register, manage, and view their land parcels with basic verification capabilities and interactive mapping.

**Epic 3: Carbon Market Trading**  
Implement the core trading functionality with carbon credit listings, basic market interface, and transaction processing.

**Epic 4: Global Mapping & Analytics**  
Add the interactive world map, market analytics, and user activity tracking to complete the MVP feature set.

### Rationale for Epic Structure:

**Why 4 Epics:**
- Each epic delivers a complete, testable increment of functionality
- Epic 1 establishes foundation while delivering immediate user value (dashboard)
- Epic 2 enables core landowner functionality (land management)
- Epic 3 delivers the key business value (carbon trading)
- Epic 4 completes the MVP with transparency and analytics features

**Sequential Dependencies:**
- Epic 1 provides authentication and UI foundation needed by all subsequent epics
- Epic 2 creates land data required for trading in Epic 3
- Epic 3 generates transaction data needed for analytics in Epic 4
- Each epic can be deployed independently and provides value

**MVP Focus:**
- Prioritizes core functionality over advanced features
- Balances landowner needs (land management) with buyer needs (trading)
- Includes essential transparency features (global map) for market trust
- Defers complex features like advanced ESG reporting to post-MVP

## Epic 1: Foundation & Authentication

**Epic Goal:** Establish the core TerraVue platform infrastructure with user authentication, basic navigation, and a functional dashboard that displays carbon market data and user summaries, creating a deployable foundation that delivers immediate value to users.

### Story 1.1: Project Setup and Infrastructure

As a developer,
I want to establish the core project structure and deployment pipeline,
so that the team can develop and deploy TerraVue efficiently.

#### Acceptance Criteria
1. Monorepo structure created with frontend (React/TypeScript) and backend (Node.js/Express) folders
2. Mock data generators configured for users, lands, transactions, and market data
3. Package.json scripts configured for easy development startup (npm run dev)
4. Basic health check endpoints return 200 status for both frontend and backend
5. Environment configuration supports local development with .env files
6. Local development servers configured (React dev server + Express server)
7. In-memory data structures initialized with realistic dummy data on server start

### Story 1.2: User Authentication System

As a potential TerraVue user,
I want to register and login securely with role-based access,
so that I can access platform features appropriate to my user type.

#### Acceptance Criteria
1. Registration form accepts email, password, full name, and user type (Landowner/Buyer)
2. Email verification required before account activation
3. Login form authenticates users and creates secure sessions
4. Password reset functionality via email link
5. Role-based access control distinguishes between landowner and buyer permissions
6. User sessions persist across browser sessions and expire after 7 days of inactivity
7. Authentication state managed consistently across all application pages

### Story 1.3: Core Navigation and Layout

As a TerraVue user,
I want to navigate between platform sections easily,
so that I can access all available features efficiently.

#### Acceptance Criteria
1. Sidebar navigation displays TerraVue logo and all main sections as specified in prompt.md
2. Navigation sections include: Dashboard, Kelola Lahan, Peta Dunia, Market Karbon, Profil & Aktivitas
3. Active navigation state clearly indicates current page location
4. Responsive design maintains navigation usability on mobile devices
5. Logout functionality accessible from navigation with confirmation prompt
6. Navigation permissions hide/show sections based on user role (landowner vs buyer)
7. Loading states display during page transitions

### Story 1.4: Dashboard Implementation

As a TerraVue user,
I want to see a comprehensive dashboard with key information and metrics,
so that I can quickly understand market status and my account activity.

#### Acceptance Criteria
1. Simulated Indonesian carbon price display with realistic fluctuations (no external API)
2. Trending topics section with placeholder carbon market news and insights
3. User land summary showing count of registered parcels and verification status
4. Interactive mini-map displaying user's land locations (if any)
5. Carbon absorption progress charts with sample monitoring data
6. Notifications panel for system announcements and user-specific updates
7. Quick action buttons for common tasks (Add Land, View Market, etc.)
8. Dashboard data refreshes automatically every 30 seconds
9. Mobile-responsive layout maintains all functionality on smaller screens

## Epic 2: Land Management System

**Epic Goal:** Enable landowners to register, manage, and track their land parcels with basic verification capabilities and interactive mapping, creating the foundational data needed for carbon credit trading while providing immediate value to landowners.

### Story 2.1: Land Portfolio Management

As a landowner,
I want to view and manage all my registered land parcels in one place,
so that I can track my carbon assets efficiently.

#### Acceptance Criteria
1. Land list displays all user's parcels with key information (name, area, location, status)
2. Search functionality filters lands by name, location, or verification status
3. Sort functionality orders lands by date added, area size, or verification status
4. Pagination supports large numbers of land parcels (50+ per page)
5. Quick status indicators show verification progress for each parcel
6. Bulk actions allow selection and status updates for multiple parcels
7. Export functionality generates CSV report of land portfolio

### Story 2.2: Add New Land Registration

As a landowner,
I want to register new land parcels with basic information,
so that I can begin the carbon credit verification process.

#### Acceptance Criteria
1. Land registration form captures: name, coordinates, area size, land type, ownership documents
2. Interactive map picker allows users to select land location by clicking or coordinate entry
3. File upload supports ownership documents (PDF, images) with size limits
4. Form validation ensures all required fields completed before submission
5. Coordinate validation confirms location is within Indonesian territory
6. Area calculation automatically computed from coordinate boundaries when possible
7. Success confirmation displays with next steps for verification process
8. Draft save functionality allows users to complete registration later

### Story 2.3: Land Detail and Verification

As a landowner,
I want to view detailed information about my land parcels and complete verification,
so that I can qualify for carbon credit trading.

#### Acceptance Criteria
1. Land detail page displays comprehensive information: coordinates, area, ownership docs, history
2. Verification status clearly indicates current stage and required actions
3. Mock satellite imagery display shows simulated land cover (using local image files)
4. Verification form allows submission of additional documentation and information
5. Activity timeline tracks all changes and updates to land parcel
6. Verification progress indicator shows completion percentage
7. Estimated carbon potential calculation based on land area and type
8. Edit functionality allows updates to land information before verification completion

### Story 2.4: Basic Interactive Mapping

As a landowner,
I want to use interactive maps for land boundary marking and visualization,
so that I can accurately define my land parcels.

#### Acceptance Criteria
1. Full-screen map interface with zoom, pan, and layer controls
2. Drawing tools for marking land boundaries (polygon creation)
3. Coordinate display updates in real-time as boundaries are drawn
4. Area calculation automatically updates as boundaries are modified
5. Save and load functionality for boundary data
6. Satellite and terrain layer options for better land visualization
7. GPS coordinate import functionality for precise boundary definition
8. Boundary validation ensures polygons are closed and non-overlapping

## Epic 3: Carbon Market Trading

**Epic Goal:** Implement the core carbon credit trading functionality with listings, market interface, and transaction processing, enabling the primary business value of connecting landowners with buyers through transparent carbon credit transactions.

### Story 3.1: Carbon Credit Listing Creation

As a verified landowner,
I want to list my carbon credits for sale in the marketplace,
so that I can monetize my forest carbon assets.

#### Acceptance Criteria
1. Listing form captures: credit quantity, price per credit, project description, validity period
2. Only verified land parcels appear as options for credit generation
3. Carbon credit calculation based on verified land area and forest type
4. Pricing guidance shows current market rates and suggested pricing ranges
5. Listing preview shows how the offer will appear to potential buyers
6. Publication controls allow draft saving and scheduled listing activation
7. Listing management allows price updates and quantity adjustments
8. Automatic expiration handling for time-limited listings

### Story 3.2: Carbon Market Browse and Search

As a carbon credit buyer,
I want to browse and search available carbon credits,
so that I can find credits that meet my requirements.

#### Acceptance Criteria
1. Market listing page displays all available carbon credits in grid/list view
2. Filter options include: price range, location, credit quantity, land type, verification status
3. Search functionality finds listings by keywords, location, or landowner name
4. Sort options include: price (low to high), quantity, date listed, location proximity
5. Listing cards show key information: price, quantity, location, verification badge, landowner rating
6. Detailed listing view displays comprehensive project information and verification details
7. Favorite/watchlist functionality allows buyers to track interesting listings
8. Real-time availability updates prevent overselling of limited credits

### Story 3.3: Trading Interface and Transactions

As a carbon credit buyer,
I want to purchase carbon credits through a secure trading interface,
so that I can acquire verified credits for my sustainability goals.

#### Acceptance Criteria
1. Stock-trading-style interface with buy/sell buttons and quantity selectors
2. Transaction confirmation popup displays total cost, fees, and purchase details
3. Simulated payment processing with fake transaction flows (no real money transfer)
4. Transaction status tracking from initiation to completion
5. Automatic credit transfer to buyer account upon successful payment
6. Simulated email notifications logged to console (no actual email sending)
7. Transaction history records all purchase and sale activities
8. Dispute resolution system for transaction issues
9. Refund processing for failed or disputed transactions

### Story 3.4: Market Analytics and Pricing

As a TerraVue user,
I want to see market analytics and pricing trends,
so that I can make informed trading decisions.

#### Acceptance Criteria
1. Simulated carbon price charts with generated historical data (no external market feeds)
2. Market volume indicators showing daily/weekly trading activity
3. Price trend analysis with moving averages and volatility indicators
4. Regional pricing variations displayed on interactive charts
5. Market depth information showing buy/sell order quantities at different price levels
6. Recent transaction feed displays latest completed trades (anonymized)
7. Price alerts allow users to set notifications for target price levels
8. Market summary statistics updated every 15 minutes during trading hours

## Epic 4: Global Mapping & Analytics

**Epic Goal:** Complete the MVP with interactive world mapping, comprehensive analytics, and user activity tracking that provides market transparency, builds trust, and delivers the full TerraVue experience as outlined in the platform specification.

### Story 4.1: Interactive Global Map

As a TerraVue user,
I want to explore verified carbon projects on an interactive world map,
so that I can understand the global distribution and impact of carbon initiatives.

#### Acceptance Criteria
1. Interactive world map displays all verified land areas with special markers
2. Clickable regions show popup details: owner info, boundaries, verification status, carbon estimates
3. Map layers toggle between satellite, terrain, and political boundary views
4. Zoom functionality supports global view down to individual land parcel detail
5. Search functionality finds specific regions, countries, or project names
6. Filter controls show/hide projects by verification status, land type, and availability
7. Legend clearly explains map symbols, colors, and status indicators
8. Performance optimization ensures smooth interaction with 1000+ land markers

### Story 4.2: User Profile and Activity Management

As a TerraVue user,
I want to manage my profile and view my platform activity,
so that I can track my engagement and update my account information.

#### Acceptance Criteria
1. Profile management form allows updates to personal information, contact details, and preferences
2. Account settings include notification preferences, privacy controls, and security options
3. Complete transaction history displays all purchases and sales with filtering and search
4. Activity timeline shows all platform interactions: logins, listings, transactions, verifications
5. Performance metrics display user-specific statistics: total credits traded, carbon impact, etc.
6. Document management system stores and organizes uploaded verification documents
7. Account verification status clearly indicates completion level and required actions
8. Data export functionality allows users to download their activity and transaction data

### Story 4.3: Basic ESG Reporting

As a carbon credit buyer,
I want to generate basic ESG reports based on my carbon credit purchases,
so that I can demonstrate my sustainability commitments to stakeholders.

#### Acceptance Criteria
1. Report generation interface allows selection of date ranges and report parameters
2. Basic ESG report template includes: total credits purchased, carbon impact, project locations
3. Visual charts display carbon offset progress toward sustainability goals
4. Project impact summaries describe environmental benefits of purchased credits
5. PDF export functionality generates professional reports for external sharing
6. Report customization allows company branding and logo inclusion
7. Automated report scheduling sends regular updates via email
8. Report data validation ensures accuracy of carbon impact calculations

### Story 4.4: Notifications and Communication System

As a TerraVue user,
I want to receive relevant notifications and updates about platform activity,
so that I can stay informed about important events and opportunities.

#### Acceptance Criteria
1. In-app notification center displays system announcements, transaction updates, and market alerts
2. Simulated email notifications logged to console for: successful transactions, verification status changes, price alerts
3. Notification preferences allow users to customize frequency and types of alerts
4. Push notification support for mobile browsers (progressive web app functionality)
5. Notification history maintains record of all sent communications
6. Urgent notification system for critical updates (security, regulatory changes)
7. Notification templates support multiple languages (Indonesian and English for MVP)
8. Unsubscribe functionality allows users to opt out of non-essential communications

## Next Steps

### Architect Prompt

**Ready for Architecture Phase:** This PRD provides comprehensive requirements for TerraVue MVP with dummy data only. Please review the technical assumptions, epic structure, and detailed user stories to create the technical architecture document. Focus on the monorepo structure, React/TypeScript frontend, Node.js/Express backend with in-memory data storage, mock data generators, and simulated integrations for all external services. The architecture should be completely self-contained, runnable with simple npm commands, and support the 4-epic development sequence without any databases, external dependencies, or containerization.

### UX Expert Prompt

**Ready for Design Phase:** The PRD defines TerraVue's complete user experience requirements including navigation structure, core screens, and interaction paradigms. Please create the design system and wireframes based on the specified earth-tone branding, stock-trading interface patterns, and mobile-responsive requirements. Focus on the 6 main navigation sections (Dashboard, Kelola Lahan, Peta Dunia, Market Karbon, Profil & Aktivitas) with emphasis on clarity and trust-building for financial transactions.

---

## Summary

**TerraVue MVP PRD Complete**

This PRD defines a comprehensive MVP for Indonesia's premier carbon market platform, structured around 4 sequential epics delivering:

1. **Foundation & Authentication** - Core infrastructure and user management
2. **Land Management System** - Landowner tools for asset registration and verification  
3. **Carbon Market Trading** - Core trading functionality and transaction processing
4. **Global Mapping & Analytics** - Market transparency and user activity tracking

**Key MVP Features:**
- Real-time carbon pricing and market analytics
- Interactive land management with satellite verification
- Stock-trading-style carbon credit marketplace
- Global mapping for project transparency
- Comprehensive user profiles and ESG reporting

**Technical Foundation (Dummy Data Only):**
- Monorepo with React/TypeScript frontend and Node.js backend
- In-memory data storage using JavaScript objects and arrays
- Mock data generators for realistic carbon market simulation
- Mock integrations for satellite imagery and simulated payment systems
- Mobile-responsive design with progressive web app capabilities
- Simple npm commands for development startup (npm run dev)
- No databases, external dependencies, containerization, or internet connectivity required

The PRD provides detailed user stories and acceptance criteria for all 16 stories across 4 epics, ensuring clear development guidance while maintaining focus on MVP delivery and post-launch scalability.

