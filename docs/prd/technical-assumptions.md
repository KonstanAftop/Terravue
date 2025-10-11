# Technical Assumptions

## Repository Structure: Monorepo
**MVP Decision Rationale:**
- Single repository containing frontend, backend, and shared utilities
- Simplified deployment and version management for small team
- Easier code sharing between web and potential future mobile development
- Reduced complexity for initial development phase

## Service Architecture: Monolith
**MVP Architecture Decision:**
- Single deployable application with modular internal structure
- Faster initial development and deployment
- Easier debugging and monitoring for MVP phase
- Can be refactored to microservices as platform scales post-MVP
- Separate modules for: authentication, land management, trading, mapping, payments

## Testing Requirements: Unit + Integration
**MVP Testing Strategy:**
- Unit tests for core business logic (carbon calculations, pricing, verification)
- Integration tests for critical user flows (registration, land listing, transactions)
- Manual testing for UI/UX validation
- Automated testing for payment processing and data integrity
- No comprehensive E2E testing in MVP - focus on core functionality validation

## Additional Technical Assumptions and Requests

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

