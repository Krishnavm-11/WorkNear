# 🔧 WorkNear - Worker Finding Platform

WorkNear is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) application that connects users with trusted local workers. Users can easily find skilled professionals, book their services, submit reviews, and register complaints. Workers can manage their profiles and bookings, while administrators have complete control over the platform through an admin dashboard.

---

## Features

### User
- User Registration & Login
- Secure JWT Authentication
- Browse Local Workers
- Search & Filter Workers
- View Worker Details
- Book Workers
- View Booking History
- Submit Reviews & Ratings
- Register Complaints
- User Dashboard

###  Worker
- Worker Registration & Login
- Create Worker Profile
- Edit Worker Profile
- Upload Profile Image (Cloudinary)
- Accept / Reject Bookings
- Mark Jobs as Completed
- View Booking Requests
- Worker Dashboard

###  Admin
- Secure Admin Login
- Dashboard Overview
- Approve Worker Profiles
- View & Delete Users
- View & Delete Workers
- Manage Bookings
- Manage Complaints

---

##  Tech Stack

### Frontend
- React.js
- React Router DOM
- Tailwind CSS
- Axios
- React Icons

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt.js
- Multer
- Cloudinary

### Database
- MongoDB Atlas

### Deployment
- Frontend – Vercel
- Backend – Render
- Database – MongoDB Atlas
- Image Storage – Cloudinary

---

## Project Structure

```
WorkNear
│
├── client
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── routes
│   │   └── App.jsx
│
├── server
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   └── server.js
│
└── README.md
```

---

## Authentication

The application uses **JWT (JSON Web Token)** for secure authentication.

### Roles

- User
- Worker
- Admin

Each role has access only to its authorized pages and features.

---

##  Image Upload

Worker profile images are uploaded using **Multer** and stored securely in **Cloudinary**.

---

## Main Modules

### User Module
- Register & Login
- Browse Workers
- Book Services
- Review Workers
- Register Complaints

### Worker Module
- Create Profile
- Edit Profile
- Booking Management
- Dashboard

### Admin Module
- Worker Approval
- User Management
- Worker Management
- Booking Management
- Complaint Management

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/Krishnavm-11/WorkNear.git
```

### Install Frontend

```bash
cd client
npm install
```

### Install Backend

```bash
cd server
npm install
```

---

## Environment Variables

### Backend (.env)

```env
PORT=5000

MONGO_URI=YOUR_MONGODB_URI

JWT_SECRET=YOUR_SECRET_KEY

CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME
CLOUDINARY_API_KEY=YOUR_API_KEY
CLOUDINARY_API_SECRET=YOUR_API_SECRET
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

---

##  Run the Project

### Backend

```bash
cd server
npm run dev
```

### Frontend

```bash
cd client
npm run dev
```

## Future Enhancements

- Google Maps Integration
- Live Chat
- Payment Gateway
- Email Notifications
- Password Reset
- Worker Availability Schedule
- Favorite Workers
- Booking Cancellation

---

##  Author

**Krishna**

MERN Stack Developer

GitHub: https://github.com/Krishnavm-11

---

## Support

If you found this project useful, please consider giving it a ⭐ on GitHub.

---

## License

This project is licensed under the MIT License.