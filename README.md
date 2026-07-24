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


<img width="1280" height="832" alt="Screenshot 2026-07-24 at 10 28 05" src="https://github.com/user-attachments/assets/74ea1493-cd7e-4d3a-a4eb-3b974ea6a0fc" />
<img width="1280" height="832" alt="Screenshot 2026-07-24 at 10 34 27" src="https://github.com/user-attachments/assets/548e85ea-2ee8-4c81-85f5-f168e5e55e0d" />
<img width="1280" height="832" alt="Screenshot 2026-07-24 at 10 34 36" src="https://github.com/user-attachments/assets/83e0625a-eef8-4f9e-b463-04fa7dcd3c2f" />
<img width="1280" height="832" alt="Screenshot 2026-07-24 at 10 35 00" src="https://github.com/user-attachments/assets/5def33cb-58dd-4d10-8260-f606cd4a47c8" />
<img width="1280" height="832" alt="Screenshot 2026-07-24 at 10 35 17" src="https://github.com/user-attachments/assets/7534cade-baf8-43ad-bbb5-2d2354480ed4" />
<img width="1280" height="832" alt="Screenshot 2026-07-24 at 10 35 23" src="https://github.com/user-attachments/assets/c0959e04-6700-43c1-ab71-2928c8e5ea34" />
<img width="1280" height="832" alt="Screenshot 2026-07-24 at 10 35 31" src="https://github.com/user-attachments/assets/f5d39634-f637-4fa6-a73a-9fbf4a273cd7" />
<img width="1280" height="832" alt="Screenshot 2026-07-24 at 10 35 47" src="https://github.com/user-attachments/assets/b6da83b6-74bd-4481-8540-67b0cfb3cec3" />
<img width="1280" height="832" alt="Screenshot 2026-07-24 at 10 35 56" src="https://github.com/user-attachments/assets/1311b2b1-e2a3-4371-a909-4f9197c3f2cd" />
<img width="1280" height="832" alt="Screenshot 2026-07-24 at 10 36 24" src="https://github.com/user-attachments/assets/089d1c5c-ffaa-4c14-93fc-a3769a9598cd" />
<img width="1280" height="832" alt="Screenshot 2026-07-24 at 10 37 11" src="https://github.com/user-attachments/assets/b47ca7ac-b829-4a6b-9868-b06bde1819dd" />
<img width="1280" height="832" alt="Screenshot 2026-07-24 at 10 37 21" src="https://github.com/user-attachments/assets/0ac87782-c1c2-41a7-8a97-78e3da3520f0" />

