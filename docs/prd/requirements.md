# Requirements

## Functional Requirements

### Dashboard Utama (Homepage)
**FR1:** The platform must display real-time Indonesian carbon prices with automatic updates or simulation data  
**FR2:** The system must provide trending topics and insights section with carbon market news and articles  
**FR3:** Users must see a summary of their land holdings including verification status and carbon potential  
**FR4:** The dashboard must include an interactive mini-map visualization of user's land locations  
**FR5:** The platform must display carbon absorption progress charts with monitoring data  
**FR6:** The system must provide notifications and announcements for verification updates and market events  

### Kelola Lahan (Land Management)
**FR7:** Users must be able to view, search, and sort their complete land portfolio  
**FR8:** The platform must provide functionality to add new land with basic data input forms  
**FR9:** Each land parcel must have a detailed view showing coordinates, area, and verification status  
**FR10:** The system must include final verification forms before land registration  
**FR11:** Interactive mapping for land boundary marking must be available on dedicated map pages  
**FR12:** The platform must maintain activity history and updates for each land parcel  

### Peta Dunia (Global Map)
**FR13:** The system must provide an interactive world map with verified land areas specially marked  
**FR14:** Clicking on regions must display popup details including owner, boundaries, verification status, and carbon estimates  
**FR15:** The platform must include search functionality for specific regions or areas  
**FR16:** Users must be able to filter regions by verification status and land categories  

### Market Karbon (Carbon Market)
**FR17:** The platform must provide a stock-trading-like interface for carbon credit listings  
**FR18:** Landowners must be able to list their carbon credits for sale  
**FR19:** The system must support carbon credit purchase transactions with verification popups  
**FR20:** Real-time or simulated carbon market price charts must be available  
**FR21:** The platform must display recent transaction lists and purchase status tracking  

### Profil & Aktivitas Pengguna (User Profile & Activity)
**FR22:** Users must be able to manage profile data and account settings  
**FR23:** The system must maintain complete transaction history for purchases and sales  
**FR24:** The platform must generate customizable ESG reports based on user requirements  
**FR25:** Documentation and FAQ sections must be accessible to all users  

### Navigation & Authentication
**FR26:** The platform must provide sidebar navigation with Terravue branding and all main sections  
**FR27:** The system must support secure user authentication and logout functionality  

## Non-Functional Requirements

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

