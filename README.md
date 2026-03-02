# 🚀 Order Processing App (Backend API)

A scalable and secure backend system built with Node.js, Express, and MongoDB for managing users, products, carts, orders, and payments.

This project demonstrates real-world backend architecture, including authentication, role-based access control, email notifications, PDF receipt generation, and full Swagger documentation.

---

## ✨ Features

- 🔐 JWT Authentication System

👥 Role-Based Access Control (User & Admin)

📦 Product Management with Image Upload

🛒 Shopping Cart System

📑 Order Lifecycle Management

💳 Payment Handling

📧 Email Notifications (Welcome, OTP, Order Updates, Refunds)

🔑 Forgot Password with OTP Verification

🧾 PDF Payment Receipt Generation

🛡 Security Best Practices (Helmet, Rate Limiting)

⚙ Centralized Error Handling

📖 Fully Documented API using Swagger (OpenAPI)

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB & Mongoose
- JWT (Authentication)
- Nodemailer (Email Service)
- PDFKit (PDF Generation)
- Multer (File Uploads)
- Swagger (API Documentation)
- Helmet (Security)
- Winston (Logging)
- express-validator (Validation)

---

## 📂 Project Structure

src/
├── config/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── services/
└── utils/
logs/
uploads/
.gitignore
app.js
README.md
package.json

---

## ⚙ Installation & Setup

### 1️⃣ Clone the Repository


git clone https://github.com/SHRUTI-GAJJAR/Order-processing-app.git


### 2️⃣ Install Dependencies


npm install


### 3️⃣ Create `.env` File

Create a `.env` file in the root directory and add:


PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
ADMIN_SECRET=your_admin_secret_key


### 4️⃣ Run the Project

Development mode:


npm run dev


Production mode:


npm start


---

🌐 Live API & Documentation

After starting the server, open:

https://order-processing-app-nedk.onrender.com

Swagger provides interactive API documentation where you can:

View all endpoints

Test APIs directly from the browser

Check request and response formats

Validate authentication flow
---

## 🔐 Authentication

Most routes require JWT authentication.

Use this header:


Authorization: Bearer <your_token>


---

## 🔒 Security Features

- 🛡 Helmet for HTTP security headers

- 🚦 Rate limiting to prevent API abuse

- ✅ Request validation using express-validator

- ⚠ Centralized error handling middleware

- 👮 Role-based authorization for protected resources

---

📧 Email System

Automatic emails are sent for:

User Registration

OTP for Password Reset

Order Placed

Order Accepted

Order Cancelled

Refund Processed

Payment Receipt (PDF Attachment)

---

## 📝 Logging System

Application logs are stored inside the `logs/` folder:

- combined.log
- error.log

---

## 👩‍💻 Author

Shruti Gajjar

Backend Developer Trainee 🌱
Passionate about learning, building, and improving every single day.

Currently exploring the world of Node.js, APIs, and real-world backend systems — turning curiosity into code and practice into confidence 💛

Always excited to grow, collaborate, and create meaningful projects 🚀✨

---

## 📌 Notes

- Built using clean architecture principles.
- Designed for scalability.
- Ready for frontend integration.
- Fully documented using Swagger.