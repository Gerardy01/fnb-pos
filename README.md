# 🍽️ FnB POS — Point of Sale for Food & Beverage

A full-stack, **multi-tenant Point of Sale (POS)** system purpose-built for the **Food & Beverage industry**. Each tenant (organization) operates in complete data isolation — managing their own outlets, staff, roles, menus, and financial configurations — all from a single shared platform. The system is designed from the ground up to scale from a single café to a restaurant chain with dozens of locations.

> **Status:** Actively in development — the management back-office is feature-rich; the live POS terminal and customer-facing ordering are in the roadmap.

---

## 📌 Project Vision

Most generic POS systems bolt food-service features on top of retail logic. This project takes the opposite approach: **every design decision, every data model, every workflow is tailored for F&B**.

**End-state goals:**

- **Customer self-ordering** — Guests scan a QR/barcode at their table and order directly from their phone.
- **Staff tablet ordering** — Servers take orders on a tablet, assigned to specific tables and sales types.
- **Server POS terminal** — A full cashier station for dine-in, take-away, and delivery order entry.
- **Multi-outlet management** — A single organization manages multiple outlets, each with independent configurations for tables, taxes, gratuities, and more.

---

## 🏠 Multi-Tenant Architecture

The application is designed as a **multi-tenant system** where each tenant is an **Organization**:

```
                          ┌──────────────────┐
                          │     Platform     │
                          │  (Shared Infra)  │
                          └────────┬─────────┘
                    ┌──────────────┼──────────────┐
                    ▼              ▼              ▼
           ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
           │  Org A       │ │  Org B       │ │  Org C       │
           │  (Tenant)    │ │  (Tenant)    │ │  (Tenant)    │
           └──────┬───────┘ └──────┬───────┘ └──────────────┘
            ┌─────┼─────┐    ┌─────┼─────┐
            ▼     ▼     ▼    ▼     ▼     ▼
          Out1  Out2  Out3  Out1  Out2   ...
```

- **Tenant isolation** — Every data query is scoped to the authenticated user's `organizationId`. An organization can never access another tenant's data.
- **Independent configuration** — Each organization defines its own roles, permissions, outlets, tax rules, gratuities, sales types, menu categories, and modifiers.
- **Shared infrastructure** — All tenants share the same PostgreSQL database, Express server, and RabbitMQ instance, keeping operational costs low.
- **Auto-provisioned identity** — New organizations receive an auto-incrementing organization number via a dedicated counter service.

---

## 🏛️ Architecture Overview

The project follows a **monorepo structure** with clearly separated client and server applications, communicating over a RESTful API.

```
fnb-pos/
├── client/          → React SPA (Vite + TypeScript)
├── server/          → Express REST API (TypeScript)
└── docker-compose.yml → RabbitMQ infrastructure
```

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT (React)                      │
│  Vite · TypeScript · Ant Design · Redux · React Router  │
│  i18next (EN / ID) · Axios                              │
└──────────────────────┬──────────────────────────────────┘
                       │ REST API (JSON)
                       ▼
┌─────────────────────────────────────────────────────────┐
│                    SERVER (Express)                     │
│  TypeScript · Zod Validation · JWT Auth · RBAC          │
│                                                         │
│  Controllers → Services → Repositories → Sequelize ORM  │
│                                                         │
│  Providers: Email (Nodemailer) · Hash (bcrypt) · JWT    │
│  Queue: RabbitMQ (amqplib) — async email delivery       │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
              ┌─────────────────┐
              │   PostgreSQL    │
              └─────────────────┘
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Vite |
| **UI Library** | Ant Design 5 |
| **State Management** | Redux Toolkit |
| **Routing** | React Router v6 |
| **Internationalization** | i18next (English & Bahasa Indonesia) |
| **HTTP Client** | Axios (with interceptor config) |
| **Backend** | Node.js, Express 4, TypeScript |
| **ORM** | Sequelize 6 (with CLI migrations & seeders) |
| **Database** | PostgreSQL |
| **Validation** | Zod |
| **Authentication** | JWT (access + refresh tokens), OTP-based email verification |
| **Password Security** | bcryptjs |
| **Email** | Nodemailer with EJS templates |
| **Message Queue** | RabbitMQ (via amqplib) — decoupled email processing |
| **Rate Limiting** | express-rate-limit |
| **Device Detection** | ua-parser-js |
| **Containerization** | Docker Compose |

---

## ✅ Implemented Features

### 🔐 Authentication & Security
- JWT-based authentication with **access & refresh token** rotation
- **OTP email verification** for account registration
- **Forgot-password flow** with secure token-based password reset
- **Password hashing** with bcryptjs
- Device detection via User-Agent parsing
- API rate limiting to prevent brute force attacks

### 👥 Account Management
- Full CRUD for user accounts with profile management
- Multi-outlet account assignment — assign staff to specific outlets
- Account creation scoped to the authenticated user's organization

### 🛡️ Role-Based Access Control (RBAC)

The permission system is one of the most thoroughly implemented features in this project, built with a **dual-layer authorization model**:

**Layer 1 — API Permissions (read / write granularity)**

Each role is assigned a set of **API-level permissions** with independent `read` and `write` flags. This means a role can be granted read-only access to a module (e.g., view accounts) without write access (e.g., create/edit accounts).

| Permission | Scope |
|---|---|
| Organization Management | Org settings |
| Account Management | User accounts |
| Role Management | Roles & permissions |
| Outlet Management | Outlet CRUD |
| Table Management | Tables & table groups |
| Gratuity Management | Service charges |
| Sales Type Management | Order channels |
| Tax Management | Tax rules |
| Category Management | Menu categories |
| Modifier Management | Item modifiers |

> A hidden `SUPER_PERMISSION` exists for the Super Admin role, which is excluded from all user-facing role creation/editing — ensuring it can never be accidentally assigned.

**Layer 2 — Page Access Permissions**

Separate from API permissions, **page-level permissions** control which pages/routes a role can access. This keeps frontend navigation in sync with backend authorization:
- Server validates page access during token generation and includes the permitted pages in the JWT payload.
- Client uses `<PermissionProtectedRoutes>` wrapper components to gate route access based on the user's page permission list.

**Enforcement across the stack:**

| Layer | Mechanism |
|---|---|
| **API middleware** | `validatePermission(permission, 'read' \| 'write')` — checks the user's JWT-embedded permissions on every protected route |
| **Client routing** | `<PermissionProtectedRoutes requiredPermission={[...]} />` — conditionally renders routes based on page access |
| **Role lifecycle** | Roles support full CRUD with soft-delete (archive). A role cannot be deleted if active accounts are still assigned to it |
| **Default roles** | Seeded `Super Admin` and `Admin` roles are marked as `is_default` and cannot be edited or deleted by tenants |
| **Custom roles** | Each organization can create unlimited custom roles with any combination of permissions |

### 🏢 Organization & Outlet Management
- Multi-tenant **organization** model with full tenant data isolation
- Full outlet CRUD with individual configuration (address, phone, operating hours, etc.)
- Outlet-specific settings for taxes, sales types, and staff assignments
- Auto-incrementing organization numbers via a counter service

### 🪑 Table & Floor Management
- **Table Groups** — organize tables by zones/floors/sections per outlet
- Individual **table** management within groups (table number, capacity, QR assignment, status)
- Cascading status updates and deletions via event-driven architecture

### 💰 Financial Configuration
- **Tax management** — create tax rules (percentage/fixed) and assign them per outlet
- **Gratuity management** — configurable service charges (percentage or fixed amount) linked to outlets
- **Sales Types** — define order channels (Dine-In, Take-Away, Delivery, etc.) with associated gratuities and outlet assignments

### 🍔 Menu Configuration
- **Category management** — organize menu items into categories per organization
- **Modifier management** — create modifiers (e.g., "Extra Cheese", "Spice Level") with multiple options, each with individual pricing
- Menu page structure is scaffolded and routed, ready for item management

### 🌐 Internationalization (i18n)
- Full i18next integration with namespace separation per module
- Supported languages: **English** (full coverage) and **Bahasa Indonesia** (partial, in progress)

### 📧 Async Email System
- **RabbitMQ-powered** email queue for non-blocking email delivery
- EJS-templated emails for OTP and forgot-password flows
- Separate consumer process (`npm run consume`) for processing the email queue

### 🛡️ Backend Architecture Patterns
- **Layered architecture:** Controller → Service → Repository → Model
- **Zod schemas** for request validation at the controller level
- **TypeScript interfaces** shared between layers for type safety
- **Provider pattern** for cross-cutting concerns (email, hashing, JWT, event publishing)
- **Event-driven updates** — e.g., disabling an outlet cascades status to its table groups and tables

---

## 📁 Project Structure

### Server (`/server/src`)

```
src/
├── config/            # Database, RabbitMQ, and environment configuration
├── controllers/       # Route handlers — validates input, orchestrates services
├── services/          # Business logic layer
├── repositories/      # Data access layer (Sequelize queries)
├── models/            # Sequelize model definitions (26 models)
├── interfaces/        # TypeScript interfaces for each domain entity
├── schema/            # Zod validation schemas per module
├── routes/v1/         # Versioned API routes (14 route files)
├── providers/         # Utility providers (email, hash, JWT, UA parser, events)
├── queue/             # RabbitMQ producer & consumer for async email
├── templates/         # EJS email templates (OTP, forgot password)
├── migrations/        # Sequelize migrations (27 migration files)
├── seeders/           # Seed data (permissions, roles, organizations)
├── utility/           # Shared enums, exceptions, middleware
├── index.ts           # Express app entry point
└── index.consumer.ts  # RabbitMQ consumer entry point
```

### Client (`/client/src`)

```
src/
├── api/               # Axios API service layer (13 API modules)
├── components/        # Reusable UI components organized by domain
│   ├── global/        #   Layout, ProtectedRoutes, PermissionProtectedRoutes
│   ├── account/       #   Account management components
│   ├── category/      #   Category management components
│   ├── gratuity/      #   Gratuity components
│   ├── modifier/      #   Modifier components
│   ├── outlet/        #   Outlet management components
│   ├── role/          #   Role & permission components
│   ├── salesType/     #   Sales type components
│   ├── table/         #   Table & table group components
│   ├── tax/           #   Tax components
│   └── loading/       #   Loading states
├── hooks/             # Custom hooks per domain + shared (cache, notification, modal, token)
├── pages/             # Page components (19 pages)
├── redux/             # Redux Toolkit store + slices (auth, account, organization)
├── models/            # TypeScript interfaces for client-side data
├── config/            # Axios interceptor configuration
├── constants/         # i18n locale JSON files (EN full, ID partial)
├── utils/             # Client-side enums, utilities, intermediary services
├── i18n.ts            # i18next initialization
├── App.tsx            # Root component with complete routing tree
└── main.tsx           # App bootstrap
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **PostgreSQL** database
- **RabbitMQ** (or use Docker Compose)
- **npm**

### 1. Clone the repository

```bash
git clone https://github.com/your-username/fnb-pos.git
cd fnb-pos
```

### 2. Start RabbitMQ

```bash
docker-compose up -d
```

This starts RabbitMQ with the management UI at `http://localhost:15672` (admin/password).

### 3. Set up the Server

```bash
cd server
cp .env.sample .env
# Fill in your PostgreSQL credentials, JWT secrets, SMTP config, and RabbitMQ host
npm install
```

**Run database migrations & seeders:**

```bash
npm run migrate
npm run seed
```

**Start the API server:**

```bash
npm run dev
```

**Start the email consumer (separate terminal):**

```bash
npm run consume
```

### 4. Set up the Client

```bash
cd client
npm install
npm run dev
```

The client will be available at `http://localhost:5173` (default Vite port).

### Environment Modes

The client supports multiple environment modes:

```bash
npm run dev              # default
npm run dev:dev          # development
npm run dev:staging      # staging
npm run dev:production   # production
```

---

## 🗄️ Database Schema

The system currently has **26 models** covering the following domains:

| Domain | Models |
|---|---|
| **Organization** | Organization, AdminOrganization, Counter |
| **Auth** | Account, RefreshToken, OtpAuth, TokenAuth |
| **Access Control** | Role, Permission, RolePermission, PageAccessPermission, RolePageAccessPermission |
| **Outlet** | Outlet, AccountOutlet |
| **Table** | TableGroup, Table |
| **Financial** | Tax, TaxOutlet, Gratuity, SalesType, SalesTypeGratuity, SalesTypeOutlet |
| **Menu** | Category, Modifier, ModifierOption |

---

## 🛠️ Useful Commands

### Database Migrations

```bash
# Generate a new migration
npx sequelize-cli migration:generate --name <migration-name> --migrations-path src/migrations

# Run all pending migrations
npm run migrate

# Undo a specific migration
npx sequelize-cli db:migrate:undo --name <migration-file-name>

# Seed the database
npm run seed
```

### Development

```bash
# Server
npm run dev          # Start API with nodemon (hot-reload)
npm run consume      # Start RabbitMQ email consumer
npm run build        # Compile TypeScript

# Client
npm run dev          # Start Vite dev server
npm run build        # Production build
npm run lint         # Run ESLint
```

---

## 🗺️ Roadmap

- [ ] **Menu Item management** — full CRUD for menu items with pricing, images, and modifier assignments
- [ ] **POS Terminal** — cashier interface for order entry, payment processing, and receipt printing
- [ ] **Customer QR Ordering** — guests scan a barcode at their table to browse the menu and place orders from their phone
- [ ] **Staff Tablet Ordering** — servers use a tablet to take orders tableside, synced in real-time
- [ ] **Order Management** — kitchen display system (KDS) and order lifecycle tracking
- [ ] **Payment Integration** — cash, card, and digital wallet support
- [ ] **Reporting & Analytics** — sales reports, popular items, peak hours analysis
- [ ] **Real-time Updates** — WebSocket integration for live order status across devices
- [ ] **Inventory Management** — stock tracking with low-stock alerts
- [ ] **Complete ID (Bahasa Indonesia) translations**

---

## 📄 License

This project is a personal portfolio project and is not currently licensed for open-source distribution.