# Sri Laxmi Jewellery 💎

A full-stack gold & silver jewellery e-commerce platform built with React + Node.js + Supabase.

---

## 🌐 Live Demo

| Service | URL |
|---|---|
| Frontend | https://sri-laxmi-jewellery.vercel.app |
| Backend API | https://sri-laxmi-jewellery-production.up.railway.app |

---

## 🛠 Tech Stack

### Frontend
- React 19 + Vite
- React Router DOM
- Supabase JS Client
- CSS Modules (custom gold theme)

### Backend
- Node.js + Express
- Supabase (PostgreSQL + Auth + Storage)
- dotenv, cors, node-fetch

### Hosting
- **Frontend** → Vercel
- **Backend** → Railway
- **Database & Auth** → Supabase

---

## 📁 Project Structure

```
sri-laxmi-jewellery/
├── backend/                  # Express API server
│   ├── routes/
│   │   ├── auth.js           # Sign in, Sign up, Google OAuth
│   │   ├── products.js       # Product CRUD + image upload
│   │   ├── orders.js         # Order management
│   │   ├── cart.js           # Shopping cart
│   │   ├── goldPrice.js      # Live gold price proxy
│   │   └── users.js          # Registered users (admin)
│   ├── supabaseClient.js     # Supabase connection
│   ├── server.js             # Express app entry point
│   └── .env                  # Environment variables
│
├── react-app/                # React frontend
│   ├── public/
│   │   └── images/           # Product photos & videos
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx    # Fixed navbar with search, cart, profile
│   │   │   ├── AuthModal.jsx # Sign In / Sign Up modal
│   │   │   ├── CartDrawer.jsx# Slide-out cart
│   │   │   ├── SearchBar.jsx # Global search
│   │   │   └── Loader.jsx    # 3D animated loader
│   │   ├── context/
│   │   │   ├── AuthContext.jsx  # Auth state management
│   │   │   └── CartContext.jsx  # Cart state management
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Landing page
│   │   │   ├── Shop.jsx         # Products catalog
│   │   │   ├── Market.jsx       # Gold price analytics
│   │   │   ├── LivePrices.jsx   # Live gold rate
│   │   │   ├── Customize.jsx    # Custom order form
│   │   │   ├── Buy.jsx          # Product purchase
│   │   │   ├── OrderConfirmation.jsx # Order success + tracker
│   │   │   ├── MyOrders.jsx     # User order history
│   │   │   └── admin/
│   │   │       ├── Admin.jsx        # Admin dashboard
│   │   │       └── AdminLayout.jsx  # Admin sidebar layout
│   │   ├── api.js            # Centralized API client
│   │   └── supabaseClient.js # Supabase frontend client
│   └── .env                  # Frontend environment variables
│
└── README.md
```

---

## 🚀 Local Development

### Prerequisites
- Node.js 18+
- npm

### 1. Clone the repo
```bash
git clone https://github.com/premsai2500030723/sri-laxmi-jewellery.git
cd sri-laxmi-jewellery
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=3000
SUPABASE_URL=https://jouezsefomaryfqchdjl.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_role_key
ADMIN_EMAIL=admin@jewels.com
ADMIN_PASS=Admin@1234
ALLOWED_ORIGIN=http://localhost:5173
```

Start backend:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

### 3. Setup Frontend
```bash
cd react-app
npm install
```

Create `react-app/.env`:
```env
VITE_API_BASE=http://localhost:3000/api
VITE_SUPABASE_URL=https://jouezsefomaryfqchdjl.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Start frontend:
```bash
npm run dev
```

Open http://localhost:5173

---

## 🗄 Database Setup (Supabase)

Run these SQL scripts in your **Supabase SQL Editor**:

### 1. Create all tables
```sql
-- Users table
CREATE TABLE IF NOT EXISTS public.users (
    id         UUID PRIMARY KEY,
    email      TEXT UNIQUE NOT NULL,
    name       TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON public.users FOR ALL USING (true) WITH CHECK (true);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id         BIGSERIAL PRIMARY KEY,
    name       TEXT NOT NULL,
    price      NUMERIC NOT NULL,
    image_url  TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON products FOR ALL USING (true) WITH CHECK (true);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id             BIGSERIAL PRIMARY KEY,
    order_id       TEXT,
    name           TEXT,
    email          TEXT,
    phone          TEXT,
    address        TEXT,
    product_name   TEXT,
    product_price  TEXT,
    product_image  TEXT,
    quantity       INTEGER DEFAULT 1,
    payment_method TEXT,
    org            TEXT,
    booking_date   DATE,
    status         TEXT DEFAULT 'Pending',
    created_at     TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON orders FOR ALL USING (true) WITH CHECK (true);

-- Cart table
CREATE TABLE IF NOT EXISTS cart (
    id           BIGSERIAL PRIMARY KEY,
    user_id      UUID NOT NULL,
    product_name TEXT NOT NULL,
    price        TEXT,
    image_url    TEXT,
    qty          INTEGER DEFAULT 1,
    created_at   TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON cart FOR ALL USING (true) WITH CHECK (true);
```

### 2. Create Storage bucket
- Go to **Supabase → Storage → New Bucket**
- Name: `products`
- Set to **Public**

---

## 🔑 Admin Access

| Field | Value |
|---|---|
| Email | `admin@jewels.com` |
| Password | `Admin@1234` |

Admin can:
- View all orders and update delivery status
- Add / delete products
- View registered users and login activity
- View order statistics

---

## 📦 Features

### Customer
- Browse gold & silver jewellery (Necklaces, Rings, Earrings)
- Search products globally
- Add to cart (requires sign in)
- Buy now with order form (requires sign in)
- Custom jewellery design order
- Live gold price tracker
- Gold & silver price analytics with charts
- My Orders page with live delivery status tracker
- Sign in / Sign up with email or Google OAuth

### Admin Dashboard
- Order management — Approve, Reject, update delivery status
  - Pending → Approved → Packing → Out for Delivery → Delivered
- Product management — Add products with image upload to Supabase Storage
- Registered users list with last login tracking
- Customer list (users who placed orders)
- Dashboard stats — total orders, pending, approved, rejected, users

---

## 🚢 Deployment

### Backend → Railway
1. Connect GitHub repo to Railway
2. Set **Root Directory** to `backend`
3. Add environment variables in Railway dashboard
4. Railway auto-deploys on every push

### Frontend → Vercel
1. Connect GitHub repo to Vercel
2. Set **Root Directory** to `react-app`
3. Set **Framework** to `Vite`
4. Add environment variables:
   ```
   VITE_API_BASE=https://your-railway-url.up.railway.app/api
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
5. Vercel auto-deploys on every push

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signin` | Sign in |
| POST | `/api/auth/signup` | Sign up |
| GET | `/api/products` | List products |
| POST | `/api/products` | Add product (admin) |
| DELETE | `/api/products/:id` | Delete product (admin) |
| GET | `/api/orders` | List all orders |
| GET | `/api/orders?email=x` | List orders by user email |
| POST | `/api/orders` | Place order |
| PATCH | `/api/orders/:id/status` | Update order status (admin) |
| GET | `/api/cart/:userId` | Get user cart |
| POST | `/api/cart` | Add to cart |
| PATCH | `/api/cart/:id` | Update cart qty |
| DELETE | `/api/cart/:id` | Remove from cart |
| GET | `/api/gold-price` | Live gold price |
| GET | `/api/users` | List registered users (admin) |
| GET | `/api/health` | Health check |

---

## 📄 License

MIT — free to use and modify.
