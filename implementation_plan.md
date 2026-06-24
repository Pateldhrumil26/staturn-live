# LED Lighting Product Portfolio Website

Build a premium, modern LED Lighting Product Portfolio Website inspired by the high-tech, sustainable aesthetics of Rentalite. The application features a public-facing website highlighting energy-efficient products, a backend server powered by Node.js, Express, and MongoDB, and specialized portals for both regular Users and Administrators (with detailed analytics, inquiries, and CRUD interfaces).

## User Review Required

> [!IMPORTANT]
> **Tailwind CSS Version**: We plan to use **Tailwind CSS v4** (integrated directly with Vite via `@tailwindcss/vite` plugin), as it offers native performance and simplified imports. If you prefer **Tailwind CSS v3** with a standard configuration file, please let us know.
>
> **Asset Storage**: Uploaded images will be stored locally in the backend's `/uploads` folder and served statically by the Express application.
>
> **Development Environment**: We will configure local MongoDB (e.g., `mongodb://127.0.0.1:27017/led-portfolio`) as the default database, which can be configured via a `.env` file on both the frontend and backend.

## Open Questions

- **Seed Data**: Do you want a database seeder script to populate default categories (COB, Downlights, Track Lights, etc.), mock products with high-quality descriptions, and sample admin/user accounts for instant demo capability? *(Proposed: Yes, we will build a seeder script.)*
- **Aesthetic Accents**: We propose a sleek, futuristic dark-mode default interface with neon cyan (`#00f2fe`) and amber/gold (`#f59e0b`) accents representing electrical energy and warm lighting. Let us know if you prefer a clean architectural white/gray look instead.

---

## Proposed Changes

### Database & Backend Services

We will implement a Node.js + Express + TypeScript backend.

#### [NEW] [backend/package.json](file:///c:/Users/patel/OneDrive/Desktop/New%20folder/backend/package.json)
Contains backend dependencies: `express`, `mongoose`, `jsonwebtoken`, `bcryptjs`, `cors`, `dotenv`, `multer`, and TypeScript dev dependencies.

#### [NEW] [backend/tsconfig.json](file:///c:/Users/patel/OneDrive/Desktop/New%20folder/backend/tsconfig.json)
TypeScript configuration for backend compiling.

#### [NEW] [backend/src/server.ts](file:///c:/Users/patel/OneDrive/Desktop/New%20folder/backend/src/server.ts)
Entry point of the backend application. Initializes connection to MongoDB, sets up middleware (CORS, Express JSON, Static folders for uploads), and registers routes.

#### [NEW] [backend/src/config/db.ts](file:///c:/Users/patel/OneDrive/Desktop/New%20folder/backend/src/config/db.ts)
MongoDB connection logic using Mongoose.

#### [NEW] [backend/src/models/User.ts](file:///c:/Users/patel/OneDrive/Desktop/New%20folder/backend/src/models/User.ts)
Mongoose Schema for Users (Admin/User) with bcrypt password hashing middleware.

#### [NEW] [backend/src/models/Category.ts](file:///c:/Users/patel/OneDrive/Desktop/New%20folder/backend/src/models/Category.ts)
Mongoose Schema for Categories (name, slug, description, image).

#### [NEW] [backend/src/models/Product.ts](file:///c:/Users/patel/OneDrive/Desktop/New%20folder/backend/src/models/Product.ts)
Mongoose Schema for Products (name, description, images, category, specifications key-value store, status, featured, etc.).

#### [NEW] [backend/src/models/Project.ts](file:///c:/Users/patel/OneDrive/Desktop/New%20folder/backend/src/models/Project.ts)
Mongoose Schema for Project Gallery (title, description, image, location, year, client).

#### [NEW] [backend/src/models/Contact.ts](file:///c:/Users/patel/OneDrive/Desktop/New%20folder/backend/src/models/Contact.ts)
Mongoose Schema for Contact Inquiries (name, email, phone, subject, message, status, notes).

#### [NEW] [backend/src/models/Dealer.ts](file:///c:/Users/patel/OneDrive/Desktop/New%20folder/backend/src/models/Dealer.ts)
Mongoose Schema for Dealer inquiries (company name, contact name, business details, location, status).

#### [NEW] [backend/src/middleware/auth.ts](file:///c:/Users/patel/OneDrive/Desktop/New%20folder/backend/src/middleware/auth.ts)
JWT validation middleware, extracting payload to determine role access (User, Admin).

#### [NEW] [backend/src/middleware/upload.ts](file:///c:/Users/patel/OneDrive/Desktop/New%20folder/backend/src/middleware/upload.ts)
Multer disk storage configuration for handling image uploads.

#### [NEW] [backend/src/controllers/](file:///c:/Users/patel/OneDrive/Desktop/New%20folder/backend/src/controllers/)
Controllers mapping HTTP requests to model logic:
- `authController.ts` - Login, registration, profile fetch/update
- `productController.ts` - CRUD operations for products (supporting filtering/pagination)
- `categoryController.ts` - CRUD operations for categories
- `projectController.ts` - CRUD operations for projects
- `contactController.ts` - Handling user contact submissions, status changes
- `dealerController.ts` - Handling user dealer inquiries, status reviews

#### [NEW] [backend/src/routes/](file:///c:/Users/patel/OneDrive/Desktop/New%20folder/backend/src/routes/)
Route definitions forwarding API requests to corresponding controllers.

#### [NEW] [backend/src/utils/seeder.ts](file:///c:/Users/patel/OneDrive/Desktop/New%20folder/backend/src/utils/seeder.ts)
Seed database script to initialize the portfolio.

---

### Frontend Single Page Application (SPA)

We will implement a React + Vite + TypeScript + Tailwind CSS frontend.

#### [NEW] [frontend/package.json](file:///c:/Users/patel/OneDrive/Desktop/New%20folder/frontend/package.json)
Frontend configurations with dependencies like `react-router-dom`, `axios`, `lucide-react` (icons), `recharts` (dashboard analytics charts), `tailwindcss`, and `@tailwindcss/vite`.

#### [NEW] [frontend/vite.config.ts](file:///c:/Users/patel/OneDrive/Desktop/New%20folder/frontend/vite.config.ts)
Vite server configuration incorporating the Tailwind CSS plugin and path aliases if necessary.

#### [NEW] [frontend/src/index.css](file:///c:/Users/patel/OneDrive/Desktop/New%20folder/frontend/src/index.css)
Tailwind imports, custom fonts (Inter/Outfit), glowing effect utilities, and glassmorphism styling classes.

#### [NEW] [frontend/src/context/AuthContext.tsx](file:///c:/Users/patel/OneDrive/Desktop/New%20folder/frontend/src/context/AuthContext.tsx)
State provider managing login, token caching, role detection, and profile updates globally.

#### [NEW] [frontend/src/services/api.ts](file:///c:/Users/patel/OneDrive/Desktop/New%20folder/frontend/src/services/api.ts)
Axios client setup with request interceptors to automatically append JWT bearer tokens.

#### [NEW] [frontend/src/components/](file:///c:/Users/patel/OneDrive/Desktop/New%20folder/frontend/src/components/)
Reusable interface controls:
- `Navbar.tsx` - Responsive navbar with dynamic links changing per role state.
- `Footer.tsx` - Styled footer featuring site map and contact links.
- `ProductCard.tsx` - Premium visual card for items, including energy ratings/badges.
- `ProjectCard.tsx` - Overlay card for installation galleries.
- `ProtectedRoute.tsx` - Route wrapper preventing access based on authentication role.

#### [NEW] [frontend/src/pages/PublicPages](file:///c:/Users/patel/OneDrive/Desktop/New%20folder/frontend/src/pages/)
- `Home.tsx` - Dynamic sections including Hero, featured lighting, dealer CTA, interactive galleries.
- `About.tsx` - Premium brand statement, sustainability metrics, and technology focus.
- `Categories.tsx` - Display grid showing categories (COB, Downlights, Track Lights, etc.).
- `Products.tsx` - High-fidelity catalog with dynamic category filters and search options.
- `ProductDetails.tsx` - Technical specifications table, product image viewer, inquiry launcher.
- `Projects.tsx` - Case studies showcase with high-end LED design layouts.
- `Contact.tsx` - Map placeholder and structured inquiry submission form.
- `BecomeDealer.tsx` - Comprehensive business partnership intake questionnaire.
- `Login.tsx` - Sleek auth dashboard landing with visual transitions.

#### [NEW] [frontend/src/admin/](file:///c:/Users/patel/OneDrive/Desktop/New%20folder/frontend/src/admin/)
- `AdminDashboard.tsx` - Key metrics, dynamic charts for inquiries, recent activities log.
- `CategoryManagement.tsx` - Create/Read/Update/Delete category terms and images.
- `ProductManagement.tsx` - Comprehensive product data list, creation modal (with dynamic specification key-value inputs), image uploads.
- `ProjectManagement.tsx` - Managing showcase catalog and details.
- `InquiryManagement.tsx` - Detail viewers and status update tools for dealer & contact submissions.

#### [NEW] [frontend/src/user/](file:///c:/Users/patel/OneDrive/Desktop/New%20folder/frontend/src/user/)
- `UserDashboard.tsx` - Portal displaying active categories/products, custom client profile edits, and historical submitted inquiries tracker.

---

## Verification Plan

### Automated Tests
We will build manual testing steps and validation endpoints. We can run lint and compilation checks:
- Backend compile: `npm run build` or `npx tsc --noEmit` inside `/backend`
- Frontend compile: `npm run build` or `npx tsc --noEmit` inside `/frontend`

### Manual Verification
1. **Database Seeding**: Run seeder to verify standard structure imports perfectly.
2. **Auth Verification**: Confirm authentication flow redirects users based on user roles (`Admin` to `/admin/dashboard`, `User` to `/user/dashboard`).
3. **Inquiry Tracking**: Submit an inquiry as a regular guest/user, verify that it updates in real-time in the admin dashboard, and check the status update flows.
4. **Product Management**: Perform complete product creation, specifying rich custom technical lists, upload an image, modify it, and verify it updates in the public grid.
5. **Responsive Layouts**: Validate desktop, tablet, and mobile presentation.
