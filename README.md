# WorkNear – Local Worker Finding Platform

WorkNear is a full-stack **MERN web application** that helps users find and book trusted local workers such as electricians, plumbers, carpenters, cleaners, tutors, painters, and other service providers.

The platform provides separate features for **users, workers, and administrators**, making it easier to discover services, manage bookings, review completed work, and manage the platform.

## 🚀 Live Demo

**[View WorkNear Live Demo]** https://work-near-3jw4.vercel.app

---

## 📌 Project Overview

WorkNear connects customers with skilled local workers through a simple and user-friendly platform.

Users can search for workers by **name or category**, view worker profiles, make bookings, track booking status, submit reviews, and register complaints.

Workers can create their profiles, upload profile images, submit their profiles for approval, manage bookings, and update booking status.

Administrators can manage users, workers, bookings, and complaints from an admin dashboard.

---

## ✨ Features

### 👤 User Features

* User registration and login
* JWT-based authentication
* Browse approved workers
* Search workers by name
* Search workers by category
* View worker details
* View worker profile information
* Book workers
* View booking history
* Track booking status
* Review completed bookings
* Register complaints
* Responsive user interface

---

### 🧰 Worker Features

* Worker registration and login
* Create worker profile
* Select service category
* Add skills and experience
* Add pricing information
* Add location
* Upload profile image
* Cloudinary image storage
* Submit profile for admin approval
* Edit worker profile
* View booking requests
* Accept bookings
* Reject bookings
* Mark accepted bookings as completed
* Worker dashboard

---

### 🛠️ Admin Features

* Admin login
* Admin dashboard
* View platform statistics
* View all users
* View all workers
* Approve worker profiles
* View all bookings
* Manage complaints
* Delete users
* Delete workers
* Monitor platform activity

---

## 🔄 Booking Flow

```text
User
  │
  ▼
Search Worker
  │
  ▼
View Worker Profile
  │
  ▼
Create Booking
  │
  ▼
Worker Receives Request
  │
  ├── Accept
  │     │
  │     ▼
  │   Complete Job
  │     │
  │     ▼
  │   User Gives Review
  │
  └── Reject
```

---

## 🔐 Authentication & Authorization

WorkNear uses **JWT authentication** to secure user accounts and protected routes.

The application supports different user roles:

* User
* Worker
* Admin

Protected routes ensure that users can only access the features available to their role.

Passwords are securely stored using **bcrypt.js**.

---

## ⭐ Review System

Users can submit a review after a worker completes their booking.

The review system includes:

* Rating
* Comment
* Worker reference
* Booking reference
* Prevention of duplicate reviews for the same booking

---

## 📢 Complaint System

Users can register complaints related to their bookings.

The complaint system allows administrators to view and manage submitted complaints.

---

## 🖼️ Image Upload

Worker profile images are uploaded using:

* Multer
* Cloudinary
* multer-storage-cloudinary

Images are stored securely in Cloudinary instead of the local server.

---

## 🛠️ Technologies Used

### Frontend

* React.js
* Vite
* JavaScript
* React Router
* Tailwind CSS
* Axios
* React Icons

### Backend

* Node.js
* Express.js
* REST API

### Database

* MongoDB
* MongoDB Atlas
* Mongoose

### Authentication

* JWT
* bcrypt.js

### Image Upload

* Cloudinary
* Multer
* multer-storage-cloudinary

### Development Tools

* VS Code
* Git
* GitHub
* Postman
* Vite
* Nodemon

### Deployment

* Vercel
* Render
* MongoDB Atlas
* Cloudinary

---

## 📂 Project Structure

```text
WorkNear/
│
├── client/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   │
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── WorkerRoute.jsx
│   │   │   └── AdminRoute.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Workers.jsx
│   │   │   ├── WorkerDetails.jsx
│   │   │   ├── Booking.jsx
│   │   │   ├── UserProfile.jsx
│   │   │   ├── WorkerDashboard.jsx
│   │   │   ├── CreateWorkerProfile.jsx
│   │   │   ├── EditWorkerProfile.jsx
│   │   │   ├── AddReview.jsx
│   │   │   └── RegisterComplaint.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── server/
│   │
│   ├── config/
│   │   ├── db.js
│   │   └── cloudinary.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── workerController.js
│   │   ├── bookingController.js
│   │   ├── reviewController.js
│   │   ├── complaintController.js
│   │   └── adminController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── upload.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Worker.js
│   │   ├── Booking.js
│   │   ├── Review.js
│   │   └── Complaint.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── workerRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── complaintRoutes.js
│   │   └── adminRoutes.js
│   │
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Move into the project folder:

```bash
cd WorkNear
```

---

## 💻 Frontend Setup

Open the client folder:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

---

## 🖥️ Backend Setup

Open another terminal and move to the server folder:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

PORT=5000

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start the backend:

```bash
npm start
```

For development with Nodemon:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

---

## 🔑 Environment Variables

The following environment variables are required:

| Variable                | Purpose                     |
| ----------------------- | --------------------------- |
| `MONGO_URI`             | MongoDB database connection |
| `JWT_SECRET`            | JWT authentication secret   |
| `PORT`                  | Backend server port         |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name       |
| `CLOUDINARY_API_KEY`    | Cloudinary API key          |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret       |
| `VITE_API_URL`          | Frontend API URL            |

> **Note:** Never upload your `.env` file or expose your database password, JWT secret, or Cloudinary secret in GitHub.

---

## 🌐 Deployment

### Frontend

The frontend is deployed using **Vercel**.

```text
Vercel
   ↓
React + Vite Frontend
```

### Backend

The backend is deployed using **Render**.

```text
Render
   ↓
Node.js + Express API
```

### Database

MongoDB Atlas is used for the production database.

```text
MongoDB Atlas
   ↓
Users
Workers
Bookings
Reviews
Complaints
```

### Image Storage

Cloudinary is used to store worker profile images.

```text
Worker Image
     ↓
Multer
     ↓
Cloudinary
     ↓
Image URL stored in MongoDB
```

---

## 🔗 Application Architecture

```text
                WorkNear
                   │
        ┌──────────┴──────────┐
        │                     │
     Frontend              Backend
        │                     │
     React.js              Node.js
     Vite                  Express.js
     Tailwind CSS          REST API
        │                     │
        └──────────┬──────────┘
                   │
              MongoDB Atlas
                   │
             Cloudinary
```

---

## 📱 Responsive Design

WorkNear is designed to provide a responsive experience across:

* Desktop
* Laptop
* Tablet
* Mobile devices

---

## 🎯 Project Goals

The main goals of WorkNear are:

* Make it easy for users to find local workers.
* Help workers showcase their skills and services.
* Provide a simple booking system.
* Allow users to review completed services.
* Provide administrators with tools to manage the platform.
* Build a practical real-world MERN stack application.

---

## 🚀 Future Improvements

Some possible future improvements include:

* Online payment integration
* Real-time notifications
* Worker availability calendar
* Location-based worker search
* Google Maps integration
* Advanced worker filtering
* Worker rating display
* Real-time chat
* Email notifications
* Booking cancellation system
* Worker earnings dashboard

---

## 📚 What I Learned

While building WorkNear, I worked with:

* React component development
* React Router
* REST API integration
* Node.js and Express.js
* MongoDB and Mongoose
* JWT authentication
* Role-based authorization
* CRUD operations
* File uploads
* Cloudinary integration
* Booking management
* Review systems
* Admin dashboards
* API testing with Postman
* Git and GitHub
* Vercel deployment
* Render deployment

---

## 👩‍💻 Developer

**Krishna**

MERN Stack Developer

Built as a full-stack MERN project to demonstrate practical web development skills.

---


