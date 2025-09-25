# Fullstack Users App

This project contains:
- backend: Node.js + Express + MySQL
- frontend: Vue 3 + Vuetify

## Quick start

1. MySQL:
   - Create database: `CREATE DATABASE users_db;`
   - Update backend/.env with your DB credentials.

2. Backend:
   ```
   cd backend
   cp .env.example .env
   npm install
   # seed 1000 users (optional)
   npm run seed
   npm run dev
   ```

3. Frontend:
   ```
   cd frontend
   npm install
   npm run dev
   ```

Open the frontend dev server (Vite prints the URL, typically http://localhost:5173).
