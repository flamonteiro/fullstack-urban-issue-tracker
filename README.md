# Fullstack Urban Issue Tracker

> **A full-stack web application built with the PERN stack (PostgreSQL, Express, React, Node.js) for reporting, tracking, and managing urban infrastructure issues.**

The **Fullstack Urban Issue Tracker** is a digital civic platform designed to bridge the gap between citizens and local government. The application allows residents to quickly and intuitively report infrastructure and urban maintenance issues (such as potholes, lack of lighting, sanitation problems, etc.), while providing public administrators with a global dashboard to manage and update the status of these demands in real-time.

---

## ⚙️ Features

The system was architected based on two levels of access privilege, ensuring security and data isolation:

### 👤 Citizen Module (Standard User)
* **Secure Authentication:** System access via email and password validation.
* **Issue Reporting (Create):** Creation of detailed reports with title, description, category, and full address.
* **Personal Tracking (Read):** Exclusive visualization of the user's own created issues, ensuring data privacy.
* **Edit Reports (Update):** Ability to correct or add information to the title and description of a registered issue.
* **Cancel Demands (Delete):** Deletion of the user's own issues, with automatic cascading data removal in the database.

### 🛡️ Administrator Module (Public Management)
* **Global Dashboard (Read):** Centralized panel listing all issues reported by any citizen in the city.
* **Dynamic Filters:** Filtering demands based on specific categories to facilitate triage and routing.
* **Status Update (Update):** Workflow control, changing the status of tickets to "Pending", "In Progress", or "Completed".
* **System Moderation (Delete):** Permanent deletion of inappropriate, duplicated, or test records.

---

## 🛠️ Technologies and Tools

This project was built using the **PERN Stack**, clearly separating responsibilities across the front-end, back-end, and database.

| Category | Technologies Used |
| :--- | :--- |
| **Front-end** | React, JavaScript, HTML, CSS |
| **Back-end** | Node.js, Express.js |
| **Database** | PostgreSQL, SQL |
| **DB Management** | PgAdmin, MySQL Workbench (Modeling) |
| **Tools & IDE** | Visual Studio Code, ASTAH (Use Cases) |
| **Versioning** | Git, GitHub |

---

## 🗄️ Conceptual Modeling

The relational database (PostgreSQL) was structured to ensure data integrity and security. The main entities of the system include:

* **User (`Usuario`):** Stores credentials (with encrypted passwords) and defines the access profile (Citizen or Admin).
* **Issue (`Ocorrencia`):** The central entity that links the author of the report to the problem's details.
* **Address (`Endereco`):** Location data strictly linked to an issue (Street, Neighborhood, Reference).
* **Category & Status (`Categoria` & `Situacao`):** Domain tables used to parameterize the types of problems and their current resolution statuses.

---

## 🚀 How to Run the Project

Follow the steps below to run the application locally in your development environment.

### Pre-requisites
* **Node.js** installed on your machine.
* **PostgreSQL** installed and running locally (or via Docker).
* **Git** to clone the repository.

### Step 1: Clone the Repository
```bash
git clone [https://github.com/YOUR_USERNAME/fullstack-urban-issue-tracker.git](https://github.com/YOUR_USERNAME/fullstack-urban-issue-tracker.git)
cd fullstack-urban-issue-tracker
```

### Step 2: Database Setup
* Open PgAdmin or your PostgreSQL terminal.
* Create a new database.
* Execute the SQL script located in the /database folder of the repository to create the tables and insert the initial seed data (users and categories).

### Step 3: Setup and Run the Back-end (API)
### Navigate to the server folder
```bash
cd backend
```

### Install dependencies
```bash
npm install
```

### Create a .env file in the root of the backend folder with your database credentials
Example:
```bash
DB_HOST=localhost
DB_USER=postgres
DB_PASS=yourpassword
DB_NAME=your_database_name
PORT=3000
```
### Start the server
```bash
npm start
```
### Step 4: Setup and Run the Front-end (React)
Open a new terminal instance and execute:
```bash
# Navigate to the client folder
cd frontend

# Install dependencies
npm install

# Start the React application
npm start
```
