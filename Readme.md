
# 🏥 Clinic Front Desk Management System

A full-stack web application for managing **patient queues** and **doctor appointments** at a clinic.

## 📌 Overview
The **Front Desk Staff** can:
- Securely log in to the system
- Manage patient queues (assign queue numbers, update status: Waiting / With Doctor / Completed)
- Book, reschedule, or cancel appointments
- Search/filter doctors by specialization, location, and availability
- View all patient appointments

---

## 🛠 Technology Stack

**Backend**
- [NestJS](https://nestjs.com/) (Node.js Framework)
- [TypeORM](https://typeorm.io/) ORM
- [MySQL](https://www.mysql.com/) Database
- [JWT Authentication](https://jwt.io/)  

**Frontend**
- [Next.js](https://nextjs.org/) (React framework)
- [Tailwind CSS](https://tailwindcss.com/) styling

---

## 📂 Folder Structure

```

clinic-frontdesk-system/
│
├── frontend/               \# Next.js + Tailwind UI
│   ├── pages/               \# Page components (Dashboard, Queue, Appointment)
│   ├── components/          \# UI components
│   ├── public/               \# Static files (index.html, style.css, images)
│   ├── package.json          \# Frontend dependencies \& scripts
│   └── .env.local.example    \# Example API URL config
│
├── backend/                \# NestJS API with MySQL
│   ├── src/
│   │   ├── app.module.ts     \# Root NestJS module
│   │   ├── main.ts           \# App bootstrap (entry point)
│   │   ├── auth/             \# Authentication (controller, service, module)
│   │   ├── doctor/           \# Doctor management
│   │   ├── queue/            \# Patient queue management
│   │   ├── appointment/      \# Appointment scheduling
│   ├── package.json          \# Backend dependencies \& scripts
│   ├── .env.example          \# Example DB/JWT configuration
│
└── README.md                \# This documentation

```

---

## ⚙ Installation & Setup

### 1️⃣ Clone the Repository
```

git clone <your-repo-url> clinic-frontdesk-system
cd clinic-frontdesk-system

```

---

### 2️⃣ Backend Setup (NestJS API)

#### Prerequisites:
- Node.js >= 18
- MySQL >= 8.0

```

cd backend

# Install dependencies

npm install

# Create database

# In MySQL CLI:

CREATE DATABASE clinic_management;

# Configure environment

cp .env.example .env

# update DB credentials, JWT secret, etc.

# Run backend

npm run start:dev

```
The backend will run on **http://localhost:3001** by default.

---

### 3️⃣ Frontend Setup (Next.js UI)

```

cd frontend

# Install dependencies

npm install

# Configure API URL

cp .env.local.example .env.local

# Set API_URL=http://localhost:3001

# Run frontend

npm run dev

```
The frontend will run on **http://localhost:3000**.

---

## 🔑 Authentication
- Login endpoint: `/auth/login`  
- Uses **JWT tokens** for secure access.  
- Default role in system: `front-desk-staff`.

---

## 📋 Features

### **Authentication**
- Login/logout with JWT
- Role-based access (front desk only)

### **Queue Management**
- Add walk-in patients to queue
- Assign queue numbers & update status
- Filter/search patients in queue

### **Appointment Management**
- Book/reschedule/cancel appointments
- View all appointments
- Filter/search doctors by specialization/availability

---

## 🖥 Running in Production

- **Frontend**: Build and serve static files
```

cd frontend
npm run build
npm run start

```

- **Backend**: Run compiled NestJS code
```

cd backend
npm run build
npm run start:prod

```

---

## 📦 Package Notes

**`package.json`**  
- **frontend/package.json** → Contains React/Next.js/Tailwind dependencies  
- **backend/package.json** → Contains NestJS/TypeORM/MySQL dependencies  

---

## ❓ Common Questions

### 1. If I open the `YSDev/index.html` file, is it the backend too?
No — opening an HTML file locally only renders the **frontend**. The backend (NestJS API) must be running separately to handle authentication, database, and business logic.

### 2. Why are there Python files?
If present, they're likely utility/migration scripts and **not** part of the running app. Place them in a `/scripts/` folder if you keep them.

### 3. Will the project run if I move files into frontend/backend folders?
Yes, **if** you update all import paths and configs accordingly. Otherwise, it won't work.

---

## 📜 License
MIT License – free to use and modify.

---

## 👨‍💻 Author
**Syed Khaja Moinuddin**
```