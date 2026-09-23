# 🛒 IIT_PATNA CART

A campus marketplace application designed for students of IIT Patna.

IIT_PATNA CART allows students to buy and sell products within the institute community. Students can create listings, browse products, search by category, maintain a wishlist, make payments, and track purchased or sold items.

---

## 🎯 Project Idea

Students often have books, electronics, sports equipment, accessories, and other items they no longer need.

IIT_PATNA CART provides a single platform where IIT Patna students can:

* 🛍️ Browse products
* 💰 Sell used products
* 🔍 Search for items
* 🗂️ Filter products by category
* ❤️ Save products to a wishlist
* 📸 Upload product images
* 💳 Make payments through Stripe
* 📦 View purchase history
* 💵 View sold items
* 🔐 Login using authenticated accounts
* 📧 Use an IIT Patna college email

Example college email:

```text
abcd2301ee99@iitp.ac.in
```

---

# 📱 Application Screens

## 🏠 Home

The home screen provides:

* Product categories
* Latest products
* Search functionality
* Navigation menu
* Wishlist access
* Seller options
* Purchase history
* Logout

![Home Screen](images/home.jpeg)

---

## 🔐 Login

Students login using their registered credentials.

The backend verifies the password and generates a JWT token for authenticated requests.

![Login Screen](images/login.jpeg)

---

## 🛍️ Product Listing

Products are displayed in a marketplace-style grid.

Students can browse available products and open individual product details.

![Product Listing](images/display.jpeg)

---

## 🛒 Product Details

The product page displays:

* Product images
* Product title
* Description
* Price
* Seller information
* Wishlist option
* Buy Now option
* Contact seller option

![Product Details](images/buy.jpeg)

---

# ✨ Major Features

## 🔐 Authentication

The application uses JWT based authentication.

Flow:

```text
User Login
    ↓
Express Backend
    ↓
Password Verification using bcrypt
    ↓
JWT Token Generated
    ↓
Token Stored on Device
    ↓
Token Sent with Protected Requests
```

Passwords are hashed using bcrypt before being stored in the database.

---

## 📧 IIT Patna Email Support

Users provide their official IIT Patna email directly.

Example:

```text
abc2301ee87@iitp.ac.in
```

The backend does not generate the email from the student's name or roll number.

The official email entered by the student is used directly.

Valid college email domain:

```text
@iitp.ac.in
```

---

## 📸 Product Upload

Sellers can create product listings containing:

* Product title
* Description
* Price
* Category
* Contact information
* Multiple product images

Product images are uploaded using:

```text
React Native Image Picker
        ↓
FormData
        ↓
Express
        ↓
Multer
        ↓
Cloudinary
        ↓
Image URL stored in MySQL
```

---

## 🔍 Product Search

Students can search products using keywords.

The backend searches:

```text
Product Title
OR
Product Description
```

Search queries are handled using Prisma.

---

## 🗂️ Product Categories

Products can be filtered using categories.

Examples include:

* 📚 Books
* 💻 Electronics
* 🏏 Sports
* 👕 Clothing
* 🎧 Accessories
* 📦 Other items

---

## ❤️ Wishlist

Students can save products to their wishlist.

The database prevents duplicate wishlist entries using a composite unique constraint.

```text
User Roll Number + Product ID
```

---

## 💳 Stripe Payment

Stripe is integrated using PaymentIntent and PaymentSheet.

Current payment flow:

```text
Buyer clicks Buy Now
        ↓
Frontend requests PaymentIntent
        ↓
Express Backend
        ↓
Stripe
        ↓
Client Secret returned
        ↓
Stripe PaymentSheet
        ↓
Payment completed
        ↓
Product marked as sold
        ↓
Order created
```

The current implementation is suitable for development and learning.

A production version should verify successful payments through Stripe webhooks before marking products as sold.

---

## 📦 Purchase History

Users can view previously purchased products.

The backend retrieves orders where:

```text
buyer = logged-in user's roll number
```

---

## 💵 Seller History

Sellers can view products they successfully sold.

The backend retrieves orders where:

```text
seller = logged-in user's roll number
```

---

## 🏷️ Unsold Products

Sellers can also view their active product listings that have not been sold.

---

# 🧰 Technology Stack

## 📱 Frontend

* ⚛️ React Native
* 📦 Expo
* 🧭 Expo Router
* 🎨 NativeWind
* 🌐 Axios
* 💾 AsyncStorage
* 💳 Stripe React Native SDK
* 📷 Expo Image Picker

---

## 🖥️ Backend

* 🟢 Node.js
* 🚂 Express.js
* 🔑 JSON Web Token
* 🔒 bcrypt
* 📤 Multer
* ☁️ Cloudinary
* 💳 Stripe
* 📧 Nodemailer
* ⚡ Socket.IO

---

## 🗄️ Database

* 🐬 MySQL
* 🔷 Prisma ORM

---

# 🏗️ Application Architecture

```text
┌─────────────────────────────┐
│     React Native App        │
│       Expo Frontend         │
└──────────────┬──────────────┘
               │
               │ Axios HTTP Requests
               ↓
┌─────────────────────────────┐
│       Express Backend       │
│                             │
│ Routes                      │
│ Authentication Middleware   │
│ Controllers                 │
└──────────────┬──────────────┘
               │
               │ Prisma
               ↓
┌─────────────────────────────┐
│          MySQL              │
│         Database            │
└─────────────────────────────┘

External Services

☁️ Cloudinary → Product Images
💳 Stripe → Payments
📧 Nodemailer → Email OTP
⚡ Socket.IO → Real-time Messaging
```

---

# 🗃️ Database Models

The application currently contains these primary Prisma models.

## 👤 User

Stores:

```text
roll_number
name
email
password
```

---

## 📦 Product

Stores:

```text
productId
title
description
images
price
seller
category
contact
buyer
status
createdAt
```

---

## ❤️ Wishlist

Stores products saved by users.

```text
roll_number
productId
```

---

## 🧾 Order

Stores completed transactions.

```text
productId
buyer
seller
createdAt
```

---

## 💬 ChatMessage

Designed to store messages between students.

```text
sender
receiver
message
createdAt
```

---

# 📁 Project Structure

```text
IIT_PATNA_CART
│
├── backend
│   │
│   ├── config
│   │   ├── cloudinary.js
│   │   ├── db.js
│   │   └── mail.js
│   │
│   ├── controllers
│   │   ├── authController.js
│   │   └── userController.js
│   │
│   ├── middleware
│   │   ├── authMiddleware.js
│   │   └── upload.js
│   │
│   ├── routes
│   │   ├── authRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── prisma
│   │   └── schema.prisma
│   │
│   ├── server.js
│   └── package.json
│
├── frontend
│   │
│   ├── app
│   │   ├── index.tsx
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   ├── home.tsx
│   │   ├── allItems.tsx
│   │   ├── category-products.tsx
│   │   ├── search-results.tsx
│   │   ├── product-details.tsx
│   │   ├── upload-product.tsx
│   │   ├── wishlist.tsx
│   │   ├── past-orders.tsx
│   │   ├── past-sold-items.tsx
│   │   ├── unsold-items.tsx
│   │   └── _layout.tsx
│   │
│   ├── config
│   │   └── api.ts
│   │
│   ├── .env.example
│   └── package.json
│
├── images
│   ├── home.jpeg
│   ├── login.jpeg
│   ├── display.jpeg
│   └── buy.jpeg
│
└── README.md
```

---

# 🌐 API Configuration

The frontend does not use a hardcoded local IP address.

The API URL is controlled using an environment variable.

Create:

```text
frontend/.env
```

Add:

```env
EXPO_PUBLIC_API_URL=http://YOUR_PC_IP:3000
```

Example:

```env
EXPO_PUBLIC_API_URL=http://192.169.3.5:3000
```

The frontend reads the URL from:

```text
frontend/config/api.ts
```

This allows the same frontend code to work across different environments.

---

## 📱 Physical Android Device

When testing using a phone connected to the same Wi-Fi network:

```env
EXPO_PUBLIC_API_URL=http://YOUR_PC_LOCAL_IP:3000
```

Example:

```env
EXPO_PUBLIC_API_URL=http://162.164.1.3:3000
```

---

## 🤖 Android Emulator

Use:

```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000
```

---

## 💻 Web Development

Use:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

---

## ☁️ Production

After backend deployment:

```env
EXPO_PUBLIC_API_URL=https://your-backend-domain.com
```

No frontend source file needs an IP address change.

---

# ⚙️ Local Setup

## 1️⃣ Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
```

Enter the project:

```bash
cd IIT_PATNA_CART
```

---

# 🖥️ Backend Setup

Enter the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create:

```text
backend/.env
```

Add:

```env
DATABASE_URL="mysql://USERNAME:PASSWORD@localhost:3306/iit_patna_cart"

JWT_KEY="YOUR_JWT_SECRET"

CLOUDINARY_CLOUD_NAME="YOUR_CLOUDINARY_NAME"
CLOUDINARY_API_KEY="YOUR_CLOUDINARY_API_KEY"
CLOUDINARY_API_SECRET="YOUR_CLOUDINARY_SECRET"

STRIPE_KEY="YOUR_STRIPE_SECRET_KEY"

EMAIL_USER="YOUR_EMAIL"
EMAIL_PASS="YOUR_EMAIL_APP_PASSWORD"
```

---

## 🗄️ Prisma Setup

Generate Prisma Client:

```bash
npx prisma generate
```

Run database migrations:

```bash
npx prisma migrate deploy
```

Optional database viewer:

```bash
npx prisma studio
```

---

## ▶️ Start Backend

```bash
node server.js
```

Backend runs on:

```text
http://localhost:3000
```

---

# 📱 Frontend Setup

Open another terminal.

Enter:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create:

```text
frontend/.env
```

Add your backend URL:

```env
EXPO_PUBLIC_API_URL=http://YOUR_PC_IP:3000
```

Start Expo:

```bash
npx expo start
```

Scan the QR code using a compatible Expo Go application.

---

# 🔐 Authentication Flow

```text
Email + Password
       ↓
POST /api/auth/login
       ↓
User searched in MySQL
       ↓
bcrypt compares password
       ↓
JWT generated
       ↓
JWT returned to frontend
       ↓
Token stored locally
       ↓
Authorization header
       ↓
Protected API access
```

Example request header:

```text
Authorization: Bearer <JWT_TOKEN>
```

---

# 📤 Product Upload Flow

```text
Seller selects images
        ↓
Expo Image Picker
        ↓
FormData created
        ↓
POST request
        ↓
JWT authentication
        ↓
Multer
        ↓
Cloudinary
        ↓
Image URLs generated
        ↓
Prisma
        ↓
Product stored in MySQL
```

---

# 🔒 Security Features

The project currently includes:

* 🔑 JWT based authentication
* 🔐 Password hashing with bcrypt
* 🛡️ Protected backend routes
* ☁️ Environment variables for backend secrets
* 🎓 IIT Patna email support
* ❤️ Duplicate wishlist prevention
* 💳 Stripe based payment integration

---

# ⚠️ Current Development Status

Some features still need improvement before production deployment.

## 💬 Chat

The backend contains Socket.IO and ChatMessage logic.

The complete frontend messaging interface still needs implementation.

---

## 📧 OTP Verification

Email OTP generation exists.

A complete verification flow should include:

```text
Send OTP
↓
User enters OTP
↓
Server verifies OTP
↓
Registration allowed
```

---

## 💳 Payment Verification

The current application confirms a transaction through the frontend after payment.

A production implementation should use:

```text
Stripe Webhook
↓
Server verifies payment
↓
Database transaction
↓
Product marked sold
↓
Order created
```

---

## 🔐 Token Storage

The current application uses AsyncStorage.

A production mobile application should move authentication tokens to secure device storage such as Expo SecureStore.

---

# 🚀 Planned Improvements

Future development can include:

* 💬 Complete real-time student chat
* 🔔 Push notifications
* ✅ Complete OTP verification
* 💳 Stripe webhook verification
* ⭐ Seller ratings and reviews
* 🖼️ Better image management
* 🧾 Detailed order pages
* 🔄 Product editing
* 🗑️ Product deletion
* 📊 Seller dashboard
* 🛡️ Better request validation
* 🔐 Secure token storage
* 📄 Pagination
* ⚡ Redis caching
* 🧪 Unit and integration testing
* ☁️ Production deployment
* 📱 Android release build

---

# 🌍 Suggested Deployment Architecture

```text
                    📱 Mobile App
                         │
                         ↓
                    Expo / EAS
                         │
                         ↓
               🌐 HTTPS REST API
                         │
                         ↓
                🟢 Express Backend
                         │
            ┌────────────┼─────────────┐
            ↓            ↓             ↓
         🐬 MySQL    ☁️ Cloudinary   💳 Stripe
```

---


# 🧠 Key Concepts Demonstrated

This project demonstrates practical implementation of:

```text
⚛️ React Native Development
🟢 Node.js Backend Development
🚂 REST API Design
🔑 JWT Authentication
🔒 Password Hashing
🗄️ Relational Databases
🔷 Prisma ORM
📤 Multipart File Upload
☁️ Cloud Storage
💳 Payment Gateway Integration
📱 Mobile Application Development
🌐 Client Server Architecture
❤️ Database Constraints
⚡ Real-time Communication Concepts
```

---

# 🛒 IIT_PATNA CART

Built as a full stack campus marketplace project focused on learning practical mobile development, backend development, database integration, authentication, third-party services, and production-oriented software design.

```text
🎓 Students
   ↓
📱 IIT_PATNA CART
   ↓
♻️ Buy • Sell • Reuse
```
---

```text
Made with ❤️ by Ritesh
```



