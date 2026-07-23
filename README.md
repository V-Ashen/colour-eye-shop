# 🌿 Colour Eye - Modern E-Commerce Platform & Admin Dashboard

Welcome to the official repository for **Colour Eye**, a full-stack, mobile-first e-commerce ecosystem built for handcrafted frames, custom photo products, and aesthetic accessories. 

The repository is structured as a monorepo containing two distinct Next.js applications sharing a single, centralized Firebase database and Cloudinary storage environment.

---

## 🌟 Live Deployments

- 🛒 **Customer Storefront**: [colour-eye-shop.vercel.app](https://colour-eye-shop.vercel.app/)
- 🔐 **Admin Management Panel**: [colour-eye-admin.vercel.app](https://colour-eye-admin.vercel.app/)

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Framework** | [Next.js 16 App Router](https://nextjs.org/) (React 19, TypeScript) |
| **Styling** | Vanilla CSS + Tailwind CSS (Custom HSL Light Green Theme Architecture) |
| **State Management** | [Zustand](https://github.com/pmndrs/zustand) (Cart, Order State, Admin Auth & Permissions) |
| **Database** | [Firebase Cloud Firestore](https://firebase.google.com/docs/firestore) (Atomic Transactions, Real-time WebSockets) |
| **Authentication** | [Firebase Auth](https://firebase.google.com/docs/auth) (Email/Password, Customer Account Creation) |
| **Media Storage** | [Cloudinary API](https://cloudinary.com/) (Direct Frontend Preset Uploads for Custom Product References & Bank Slips) |
| **Icons & UI** | Lucide React |

---

## 📂 Project Structure

```text
colour-eye-shop/
├── website/                    # Customer-Facing Storefront Application
│   ├── src/
│   │   ├── app/                # Next.js App Router (Shop, Products, Cart, Checkout, Order Tracking)
│   │   ├── components/         # HeroSlider, ProductGrid, CustomFramesGuide, Contact, Navbar, CartDrawer
│   │   ├── lib/                # Firebase Client Initialization
│   │   └── store/              # Zustand Cart & Auth Stores
│   └── next.config.ts          # Includes automatic /admin -> Admin Panel redirect rule
│
└── admin-panel/                # Secure Back-End Management Dashboard
    ├── src/
    │   ├── app/                # Dashboard, Orders, Products, Messages, Staff, Roles Management
    │   ├── components/         # AdminGuard, Sidebar, OrderNotifier (Real-Time WebSocket Alerts)
    │   ├── lib/                # Firebase Client & Admin Config
    │   └── store/              # Admin Auth & Permission Control Store
    └── next.config.ts
```

---

## ✨ Key Features & Architecture

### 1. 🖼️ Custom Frame Sizes & Dynamic Price Matrix
- Admins can toggle frame size support for specific products and select supported sizes (`Mini Frame`, `5x5 Inch`, `6x8 Inch`, `A4 Frame`, `A3 Frame`, `Polaroid Photo`) along with individual custom prices.
- Storefront dynamically switches prices based on size selections on the product page and preserves the size choice throughout the cart and checkout pipeline.

### 2. ⚡ Real-Time Order Notification Engine
- The Admin Panel runs an active Firebase `onSnapshot` listener (`OrderNotifier.tsx`) attached to incoming `Pending` orders.
- When a customer submits an order on the website, a persistent notification card slides in at the top right of the admin screen. It stays securely visible until explicitly dismissed by staff.

### 3. 🛍️ Atomic Stock & Transactional Checkout
- Uses Firestore `runTransaction` to prevent overselling. Before creating an order, stock is locked, verified, decremented, and the order document is recorded in a single atomic database operation.
- Supports **Cash on Delivery (COD)**, **Bank Transfer** (with slip upload), and **Card Payments**.
- Allows guest checkouts with optional inline account creation for tracking order status.

### 4. 📬 Customer Inquiry & Custom Orders Messaging System
- Integrated contact & custom inquiry form pushing customer messages to the database.
- Dedicated Admin Messages view (`/messages`) with read/unread statuses, filtering, and a live unread badge count in the admin sidebar.
- Protected by a granular `"view messages"` RBAC permission.

### 5. 🛡️ Dynamic Role-Based Access Control (RBAC)
- Multi-tier administrative user system:
  - **Level 0 (Master Admin)**: Full system control, role creation, and permission configuration.
  - **Level 1 (Admin)** & **Level 2 (Staff)**: Granular permission checking (e.g., `view dashboard`, `manage orders`, `manage products`, `manage staff`, `manage roles`, `view messages`).

---

## 💻 Local Development Setup

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

### 1. Clone Repository
```bash
git clone https://github.com/V-Ashen/colour-eye-shop.git
cd colour-eye-shop
```

### 2. Install Dependencies
```bash
# Install Website Dependencies
cd website
npm install

# Install Admin Panel Dependencies
cd ../admin-panel
npm install
```

### 3. Environment Variables
Create a `.env.local` file inside both `website/` and `admin-panel/` with your Firebase and Cloudinary credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### 4. Run Development Servers
```bash
# Run Website (Port 3000)
cd website
npm run dev

# Run Admin Panel (Port 3001)
cd ../admin-panel
npm run dev
```

Open `http://localhost:3000` for the Storefront and `http://localhost:3001` for the Admin Dashboard.

---

## 📜 License

This project is proprietary and maintained for **Colour Eye**. All rights reserved.