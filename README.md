# 🚀 Order Processing App (Backend API)

A complete backend REST API for an Order Processing System built with Node.js, Express, and MongoDB.  
This project includes authentication, role-based authorization, product management, cart, orders, payments, and Swagger documentation.

---

## ✨ Features

- 🔐 User Registration & Login (JWT Authentication)

- 👥 Role-Based Access Control (Admin & User)

- 📦 Product CRUD with Image Upload

- 🛒 Shopping Cart System

- 📑 Order Management

- 💳 Payment Integration

- ✅ Input Validation using express-validator

- 🛡 Security with Helmet & Rate Limiting

- ⚙ Centralized Error Handling Middleware

- 📖 API Documentation using Swagger (OpenAPI)

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB & Mongoose
- JWT (Authentication)
- Multer (File Upload)
- Swagger (API Docs)
- Helmet (Security)
- Winston (Logging)

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
app.js



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
JWT_SECRET=your_secret_key


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