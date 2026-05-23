# Role-Based Approval & Workflow Management System

A production-grade, full-stack workflow automation engine engineered using the **MERN Stack** (Node.js, Express, React) backed by a relational **MySQL** storage layer. The architecture implements a strict state-machine design pattern to govern multi-tier role permissions, secure relational transactions, and provide an immutable visual audit trail.


# 🚀 Local Deployment Instructions

## 1. Database Initialization

CREATE DATABASE approval_system_db;

## 2. Backend Environment Variables Setup

Create a `.env` file inside `backend/`:

DB_HOST=localhost  
DB_USER=root  
DB_PASS=your_local_mysql_password  
DB_NAME=approval_system_db  
PORT=5000  
JWT_SECRET=production_level_secure_node_string_2026!

## 3. Dependency Installation & Database Seeding

cd backend  
npm install  
npm run seed  
npm start  

Backend Server:  
http://localhost:5000

## 4. Frontend Execution

cd frontend  
npm install  
npm run dev  

Frontend URL:  
http://localhost:5173



# 🔑 Evaluation Login Parameters

| Account Role | Email Parameter | Password | Core Evaluation Focus |

| **Standard User** | user@company.com | password123 | Can initiate, write, and resubmit requests. |
| **Manager** | manager@company.com | password123 | Can approve, reject, and review requests. |
| **Administrator** | admin@company.com | password123 | Full system visibility and override permissions. |

# ⚙️ Tech Stack

## Frontend

- React.js
- Tailwind CSS
- Axios
- React Router DOM
- Lucide React

## Backend

- Node.js
- Express.js
- Sequelize ORM
- JWT Authentication
- bcrypt.js

## Database

- MySQL

# 👨‍💻 Author

Developed as a full-stack workflow automation and approval management platform demonstrating enterprise-grade authorization systems, relational database management, workflow orchestration, and audit-trail engineering principles.
