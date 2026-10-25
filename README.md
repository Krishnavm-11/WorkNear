# WorkNear --- Local Worker Finding Platform

WorkNear is a full-stack MERN application that helps customers discover
and book local service professionals. It brings customers, workers, and
administrators together in one platform for service discovery, booking
management, reviews, and complaints.

**Live Demo:** https://work-near-iota.vercel.app/
**Backend API:** https://worknear-1.onrender.com

------------------------------------------------------------------------

## Table of Contents

-   [Overview](#overview)
-   [Features](#features)
-   [Booking Workflow](#booking-workflow)
-   [Technology Stack](#technology-stack)
-   [Application Architecture](#application-architecture)
-   [Project Structure](#project-structure)
-   [Getting Started](#getting-started)
-   [Environment Variables](#environment-variables)
-   [Deployment](#deployment)
-   [Learning Outcomes](#learning-outcomes)
-   [Future Improvements](#future-improvements)
-   [Developer](#developer)

------------------------------------------------------------------------

## Overview

Finding a suitable local professional can be difficult. WorkNear aims to
make the process simpler by letting customers browse service categories,
view worker profiles, request bookings, and follow booking progress.

The platform supports three roles:

-   **User:** Discover workers, create bookings, review completed
    services, and submit complaints.
-   **Worker:** Create a service profile, submit it for approval, and
    manage incoming bookings.
-   **Admin:** Review worker profiles and oversee users, bookings, and
    complaints.

## Features

### Customer Features

-   Register and log in
-   Browse approved workers
-   Search workers by name or service category
-   View worker details, skills, experience, pricing, and location
-   Book a worker
-   View booking history and booking status
-   Review completed bookings
-   Submit complaints
-   Use a responsive interface on desktop and mobile

### Worker Features

-   Register and log in as a worker
-   Create and edit a worker profile
-   Select a service category
-   Add skills, experience, pricing, and location
-   Upload a profile image
-   Submit a profile for administrator approval
-   View incoming booking requests
-   Accept or reject bookings
-   Mark accepted bookings as completed
-   Manage bookings through a worker dashboard

### Admin Features

-   Access the admin dashboard
-   View platform statistics
-   View users and workers
-   Approve worker profiles
-   View bookings
-   View and manage customer complaints
-   Delete users and workers
-   Monitor platform activity

### Reviews and Complaints

-   Customers can review completed bookings with a rating and comment.
-   Reviews reference the relevant worker and booking.
-   The application is designed to prevent duplicate reviews for the
    same booking.
-   Customers can submit complaints, which administrators can review and
    manage.

### Image Uploads

Worker profile images are handled using **Multer** and **Cloudinary**.
Image files are uploaded to Cloudinary, and the resulting image URL can
be stored with the worker profile in MongoDB.

## Booking Workflow

1.  A customer searches for a worker by name or service category.
2.  The customer views the worker's profile.
3.  The customer creates a booking request.
4.  The worker receives the request and accepts or rejects it.
5.  If accepted, the worker can mark the job as completed.
6.  The customer can submit a review after completion.

## Technology Stack

  Area                Technologies
  ------------------- -----------------------------------------------
  Frontend            React, Vite, JavaScript, React Router
  Styling             Tailwind CSS
  HTTP requests       Axios
  Icons               React Icons
  Backend             Node.js, Express.js
  API                 REST API
  Database            MongoDB, MongoDB Atlas, Mongoose
  Authentication      JSON Web Token (JWT), bcrypt.js
  Image uploads       Multer, Cloudinary, multer-storage-cloudinary
  Development tools   VS Code, Git, GitHub, Postman, Nodemon
  Deployment          Vercel, Render, MongoDB Atlas, Cloudinary

## Application Architecture

``` text
Customer / Worker / Admin
          |
          v
 React + Vite Frontend
          |
       Axios
          |
          v
   Express REST API
          |
     --------------
     |            |
     v            v
 MongoDB       Cloudinary
 Atlas         (profile images)
```

The frontend communicates with the Express backend through API requests.
MongoDB Atlas stores application data, while Cloudinary stores worker
profile images.

## Project Structure

The following is a high-level structure of the project. Exact files may
vary as the application develops.

``` text
WorkNear/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── WorkerRoute.jsx
│   │   │   └── AdminRoute.jsx
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
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── server/
│   ├── config/
│   │   ├── db.js
│   │   └── cloudinary.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── workerController.js
│   │   ├── bookingController.js
│   │   ├── reviewController.js
│   │   ├── complaintController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── upload.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Worker.js
│   │   ├── Booking.js
│   │   ├── Review.js
│   │   └── Complaint.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── workerRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── complaintRoutes.js
│   │   └── adminRoutes.js
│   ├── server.js
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

Install the following before running the project locally:

-   Node.js and npm
-   A MongoDB Atlas database or local MongoDB instance
-   A Cloudinary account for worker profile image uploads
-   Git

### 1. Clone the repository

``` bash
git clone https://github.com/Krishnavm-11/WorkNear
cd WorkNear
```

### 2. Configure the backend

Open a terminal in the project directory:

``` bash
cd server
npm install
```

Create a `.env` file inside the `server` folder and add the environment
variables listed below.

Start the backend using the script available in `server/package.json`.
Common commands are:

``` bash
npm start
```

For development, if the project defines a `dev` script:

``` bash
npm run dev
```

The backend is configured to use port `5000` in the local setup
described here.

### 3. Configure the frontend

Open a second terminal:

``` bash
cd client
npm install
```

Create a `.env` file inside the `client` folder:

``` env
VITE_API_URL=http://localhost:5000/api
```

Start the Vite development server:

``` bash
npm run dev
```

Open the local URL shown in the terminal. The default Vite URL is
usually:

``` text
http://localhost:5173
```

> **Note:** Check the scripts in each `package.json` if a command
> differs from your local setup. Keep the frontend API URL aligned with
> the backend's actual API base path.

## Environment Variables

### Backend --- `server/.env`

``` env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_jwt_secret
PORT=5000

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Frontend --- `client/.env`

``` env
VITE_API_URL=http://localhost:5000/api
```

  Variable                  Purpose
  ------------------------- ----------------------------------------------
  `MONGO_URI`               Connects the backend to MongoDB
  `JWT_SECRET`              Signs and verifies JWT authentication tokens
  `PORT`                    Sets the backend server port
  `CLOUDINARY_CLOUD_NAME`   Cloudinary account cloud name
  `CLOUDINARY_API_KEY`      Cloudinary API key
  `CLOUDINARY_API_SECRET`   Cloudinary API secret
  `VITE_API_URL`            Backend API base URL used by the frontend

**Security:** Never commit `.env` files or expose database credentials,
JWT secrets, or Cloudinary API secrets in a public repository. Configure
production environment variables in the hosting provider's settings.

## Deployment

-   **Frontend:** Deployed on Vercel\
    https://work-near-iota.vercel.app
-   **Backend:** Deployed on Render\
    https://worknear-1.onrender.com
-   **Database:** MongoDB Atlas
-   **Image storage:** Cloudinary

Production frontend and backend URLs must be configured correctly in the
environment variables and CORS settings.

## Learning Outcomes

Working on WorkNear provides practical experience with:

-   Building reusable React components and pages
-   Client-side routing
-   Integrating a frontend with REST APIs
-   Developing APIs with Node.js and Express
-   Designing MongoDB schemas with Mongoose
-   JWT authentication and role-based authorization
-   Implementing CRUD operations
-   Uploading files with Multer and Cloudinary
-   Managing service bookings and booking status
-   Creating reviews and complaint workflows
-   Building role-specific dashboards
-   Testing APIs with Postman
-   Using Git and GitHub
-   Deploying a full-stack application with Vercel and Render

## Future Improvements

Potential enhancements include:

-   Online payment integration
-   Real-time notifications
-   Worker availability calendar
-   Location-based worker search and map integration
-   Advanced worker filters and sorting
-   Worker rating summaries
-   Real-time chat
-   Email notifications
-   Booking cancellation workflow
-   Worker earnings dashboard

## Developer

**Krishna**\
*MERN Stack Developer*

WorkNear is a full-stack project built to practise and demonstrate
practical web development skills using the MERN stack.
