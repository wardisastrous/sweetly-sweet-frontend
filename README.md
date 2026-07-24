# 🍫 Sweetly Sweet

A full-stack premium chocolate e-commerce web application built using **Spring Boot**, **React**, and **PostgreSQL**. The platform provides customers with a seamless shopping experience while offering administrators a comprehensive dashboard to manage products, orders, inventory, coupons, users, and sales analytics.

---

## 📸 Screenshots

> Add screenshots of your application here.

- Home Page
- Product Listing
- Product Details
- Shopping Cart
- Checkout
- Admin Dashboard
- Analytics Dashboard
- Inventory Management

---

# ✨ Features

## 👤 Customer Features

- User Registration & Login (JWT Authentication)
- Browse Products
- Search Products
- Filter by Categories
- Product Details Page
- Shopping Cart
- Coupon Code Support
- Secure Razorpay Payment Integration
- Order Placement
- Order History
- Product Reviews & Ratings
- Responsive Design

---

## 👨‍💼 Admin Features

- Admin Dashboard
- Sales Analytics Dashboard
- Monthly Revenue Charts
- Order Status Charts
- Product Management (CRUD)
- Inventory Management
- User Management
- Order Management
- Coupon Management
- Review Management
- Product Stock Updates

---

# 📊 Analytics Dashboard

The admin dashboard provides real-time business insights including:

- Total Revenue
- Total Orders
- Total Customers
- Products Sold
- Average Order Value
- Monthly Revenue Graph
- Order Status Distribution
- Top Selling Products
- Recent Orders

---

# 🛠 Tech Stack

## Frontend

- React.js
- React Router
- React Query
- Axios
- Tailwind CSS
- Recharts
- Lucide React

---

## Backend

- Spring Boot
- Spring Security
- JWT Authentication
- Spring Data JPA
- Hibernate
- Flyway Migration
- Bean Validation

---

## Database

- PostgreSQL

---

## Payment Gateway

- Razorpay

---

## Cloud Storage

- Cloudinary

---

# 📂 Project Structure

```
SweetlySweet/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── api/
│   └── hooks/
│
├── backend/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── model/
│   ├── dto/
│   ├── config/
│   └── security/
│
└── database/
    └── Flyway Migrations
```

---

# 🔐 Authentication

- JWT Based Authentication
- Password Encryption using BCrypt
- Role-Based Authorization
- Protected API Endpoints

---

# 💳 Payment

Integrated with **Razorpay** for secure online payments.

Features include:

- Payment Verification
- Order Confirmation
- Transaction Handling

---

# 📦 Inventory Management

Admins can:

- Add Products
- Update Products
- Delete Products
- Manage Stock Quantity
- View Low Stock Items

---

# ⭐ Product Reviews

Customers can:

- Rate Products
- Write Reviews
- Edit Reviews
- Delete Reviews

Only verified purchasers can review products.

---

# 🎟 Coupon System

Admins can:

- Create Coupons
- Update Coupons
- Delete Coupons

Customers can apply coupons during checkout.

---

# 📈 Sales Analytics

The admin dashboard displays:

- Revenue Trends
- Orders
- Customers
- Products Sold
- Average Order Value
- Top Selling Products
- Order Status Statistics

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/sweetly-sweet.git
```

---

## Backend

```bash
cd backend
```

Configure PostgreSQL database credentials inside

```
application.properties
```

Run

```bash
./mvnw spring-boot:run
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# 📚 API Highlights

## Authentication

- POST /api/auth/register
- POST /api/auth/login

---

## Products

- GET /api/products
- GET /api/products/{id}

---

## Cart

- GET /api/cart
- POST /api/cart

---

## Orders

- POST /api/orders
- GET /api/orders/my-orders

---

## Reviews

- POST /api/products/{id}/reviews
- GET /api/products/{id}/reviews

---

## Coupons

- POST /api/coupons/apply

---

## Admin

- CRUD Products
- CRUD Coupons
- Manage Orders
- Manage Users
- Inventory Management
- Sales Analytics

---

# 🔒 Security Features

- JWT Authentication
- BCrypt Password Encryption
- Role-Based Access Control
- Input Validation
- Protected Admin Routes

---

# 🌟 Future Improvements

- Email Notifications
- Wishlist
- Multiple Product Images
- Product Recommendations
- Pagination
- Advanced Filtering
- Sales Reports (PDF)
- Multi-language Support

---

# 👨‍💻 Author

**Uday Kapila**

B.Tech Computer Science (AI & ML)

Chandigarh University

GitHub: https://github.com/yourusername

LinkedIn: https://linkedin.com/in/yourprofile

---

# 📄 License

This project is intended for educational and portfolio purposes.
