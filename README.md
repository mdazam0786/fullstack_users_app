Fullstack Users App

Description:
This is a full-stack user management application with backend and frontend.

Backend: Node.js + Express + MySQL
Frontend: Vue 3 + Vuetify

Quick Start
1. MySQL

Create a database:

CREATE DATABASE users_db;


Update backend/.env with your database credentials:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=users_db
PORT=5001

2. Backend Setup
cd backend
cp .env.example .env        # create your env file
npm install                 # install dependencies
npm run seed                # seed 1000 users (optional)
npm run dev                 # start backend server


Default backend URL: http://localhost:5001

3. Frontend Setup
cd frontend
npm install                 # install dependencies
npm run dev                 # start frontend


Default frontend URL: Usually http://localhost:5173 (if using Vite)

4. Notes

Backend API routes:

GET /api/users → List users

POST /api/users/fetch → Fetch & insert users

PUT /api/users/:uuid → Update user

Frontend displays users in a paginated table with search and edit functionality.
