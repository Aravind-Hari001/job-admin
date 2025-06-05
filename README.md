# Job Admin Project

This project is divided into two main folders:
- **job-admin-client** – Frontend (built with Next.js)
- **job-admin-server** – Backend (built with NestJS)

## Getting Started
Follow these steps to set up and run the project locally.

### Folder Structure
├── job-admin-client     # Frontend (Next.js)
└── job-admin-server     # Backend (NestJS)

### 1. Install Dependencies

Navigate to each folder and install the required packages:

cd job-admin-client
npm install

cd job-admin-server
npm install

### 2. Seed the Database
First create DB "JobManagement" in PG Admin then, 
Run the following command in backend folder(job-admin-server) to populate the database by creating table("jobs") with initial data:

node src/database/seed-data.js

### 3. Run the Development Servers
cd job-admin-admin
npm run start:dev
Server Run in url ( http://localhost:5000)

### 4. Run the Development Client
cd job-admin-client
npm run dev
Client Run in url ( http://localhost:3000)


### Notes
Ensure Node.js and npm are installed on your machine.
The backend must be running before using the frontend.

## Logo img for Job
Company Name Amazion, Swiggy and Tesla olny show logo 