# InviSure Microinsurance Platform

InviSure is a web-based microinsurance platform designed to provide affordable insurance products tailored to low-income users. It offers features such as policy management, claims submission and tracking, and an admin dashboard for monitoring key metrics. This repository includes both frontend and backend components to deliver a responsive and interactive user experience.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Frontend Structure](#frontend-structure)
- [Backend Structure](#backend-structure)
- [Key Components and Pages](#key-components-and-pages)
- [API Documentation](#api-documentation)
- [Styling and Design](#styling-and-design)
- [Acknowledgements](#acknowledgements)

---

## Project Overview

The InviSure Microinsurance Platform provides a digital solution for insurance providers to offer, manage, and monitor microinsurance policies for clients with limited resources. The platform supports both user and admin roles, where users can purchase insurance plans and submit claims, and admins can manage policies and claims via a comprehensive dashboard.

The project is divided into two main modules:
1. **Frontend:** Built with React.js, it offers a responsive UI for users and an admin interface.
2. **Backend:** Developed with Node.js and Express.js, it includes RESTful API endpoints for managing users, policies, claims, and admin actions. MongoDB is used as the database.

---

## Features

### User-Facing Features
- **Insurance Plan Selection**: Users can view and select insurance plans based on their needs.
- **Claims Submission**: Allows users to submit claims, upload necessary documents, and track the status of their claims.
- **User Dashboard**: View purchased policies and claim status updates.

### Admin Dashboard
- **Admin Authentication**: Secure login and authentication for admin users.
- **Policy Management**: Create, edit, delete, and view insurance policies.
- **Claims Management**: View, approve, and reject claims submitted by users.
- **Metrics Dashboard**: Displays key metrics, including total policies, pending claims, and total claims.
- **Insurance Plans Grouping**: Group insurance plans by type, including Health, Life, Car, Home, and Travel.

### Security
- **JWT Authentication**: Secure user and admin sessions with JSON Web Tokens.
- **Access Control**: Restrict access to certain pages and actions based on user roles.

---

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- Axios for API calls
- CSS for styling

### Backend
- Node.js
- Express.js for API handling
- MongoDB for data storage
- Mongoose for MongoDB ORM
- bcrypt for password hashing
- JWT for authentication

### DevOps
- Git for version control
- GitHub for repository management

---

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (local instance or MongoDB Atlas)
- Git

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/invisure.git
    ```

2. Install dependencies for the backend:
    ```bash
    cd backend
    npm install
    ```

3. Install dependencies for the frontend:
    ```bash
    cd ../frontend
    npm install
    ```

4. Set up environment variables as described below.

5. Run the backend server:
    ```bash
    cd ../backend
    npm start
    ```

6. Run the frontend server:
    ```bash
    cd ../frontend
    npm start
    ```

---

## Environment Variables

Create a `.env` file in the backend directory and configure the following variables:

```bash
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
```

---

## Frontend Structure

- **src/pages/Admin/AdminDashboard.js**: The main dashboard page for the admin, displaying key metrics, insurance plans, and actions.
- **src/services/claimsService.js**: Handles API calls related to claims, including fetching all claims, updating claim status, etc.
- **src/services/insurancePlansService.js**: Handles API calls related to insurance plans, including fetching public plans, creating, updating, and deleting plans.

---

## Backend Structure

### Models
- **Claim.js**: Defines the schema and model for claims.
- **Policy.js**: Defines the schema and model for insurance policies.
- **User.js**: Defines the schema and model for users.

### Controllers
- **adminController.js**: Handles admin-specific functionalities, including managing policies and claims, tracking metrics, etc.

### Routes
- **/api/admin**: Routes related to admin functionalities.
- **/api/claims**: Routes related to claims submission, updates, and retrieval.
- **/api/auth**: Authentication routes for login and registration.

---

## Key Components and Pages

### AdminDashboard.js
Displays the admin dashboard with:
- Welcome message and admin name.
- Key metrics like total policies, pending claims, and total claims.
- Grouped insurance plans by type.
- Links to manage policies and claims.

### ManageClaims.js
Page where admins can view, approve, and reject claims. Claims include:
- Policyholder name
- Policy name
- Claim description
- Submitted claim amount (distinct from coverage amount)
- Status of the claim
- Submission date

---

## API Documentation

### Authentication
- **POST /api/auth/login**: Login user/admin and return JWT tokens.
- **POST /api/auth/register**: Register a new user or admin.

### Claims
- **POST /api/claims/submit**: Submit a new claim.
- **GET /api/claims**: Get claims for the logged-in user.
- **GET /api/admin/all-claims**: Admin endpoint to get all claims with user and policy details.
- **PUT /api/admin/update-claim-status/:claimId**: Admin endpoint to update claim status.

### Policies
- **GET /api/admin/policies**: Retrieve all policies.
- **POST /api/admin/create-policy**: Admin endpoint to create a new policy.
- **PUT /api/admin/policies/:policyId**: Admin endpoint to update a policy.
- **DELETE /api/admin/policies/:policyId**: Admin endpoint to delete a policy.

---

## Styling and Design

### **AdminDashboard.css**
Contains styles for the admin dashboard, including:
- Centered container layout for the main content.
- Styled headings and alerts for improved readability.
- Card styling for displaying insurance plans by type.
- Button and action link styles.

### Improvements
To provide a cohesive and elegant look:
- Implemented hovering effects on buttons.
- Styled action links and grouped insurance plans with flexbox to ensure responsiveness.
- Integrated dynamic welcome messages to personalize the dashboard experience.

---

## Acknowledgements

This project is inspired by the need for affordable and accessible insurance options tailored for low-income communities. We extend our gratitude to open-source contributors and online resources that helped shape this platform.

---

## License

This project is licensed under the MIT License.

---

With this README.md, developers and users will have a comprehensive understanding of the InviSure Microinsurance Platform, including setup instructions, features, and architecture. Adjust specific paths, URLs, and details based on your exact configuration and environment.
