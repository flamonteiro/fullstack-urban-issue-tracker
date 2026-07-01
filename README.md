# Fullstack Urban Issue Tracker

> **A server-side rendered web application built with Node.js, Express, EJS, and PostgreSQL for reporting, tracking, and managing urban infrastructure issues.**

The **Fullstack Urban Issue Tracker** is a digital civic platform designed to bridge the gap between citizens and local government[cite: 1]. The application allows residents to quickly and intuitively report infrastructure and urban maintenance issues (such as potholes, lack of lighting, sanitation problems, etc.), while providing public administrators with a global dashboard to manage and update the status of these demands in real-time[cite: 1].

---

## ⚙️ Features

The system was architected based on two levels of access privilege, ensuring security and data isolation[cite: 1]:

### 👤 Citizen Module (Standard User)
* **Secure Authentication:** System access via email and password validation[cite: 1].
* **Issue Reporting (Create):** Creation of detailed reports with title, description, category, and full address[cite: 1].
* **Personal Tracking (Read):** Exclusive visualization of the user's own created issues, ensuring data privacy[cite: 1].
* **Edit Reports (Update):** Ability to correct or add information to the title and description of a registered issue[cite: 1].
* **Cancel Demands (Delete):** Deletion of the user's own issues, with automatic cascading data removal in the database[cite: 1].

### 🛡️ Administrator Module (Public Management)
* **Global Dashboard (Read):** Centralized panel listing all issues reported by any citizen in the city[cite: 1].
* **Dynamic Filters:** Filtering demands based on specific categories to facilitate triage and routing[cite: 1].
* **Status Update (Update):** Workflow control, changing the status of tickets to "Pending", "In Progress", or "Completed"[cite: 1].
* **System Moderation (Delete):** Permanent deletion of inappropriate, duplicated, or test records[cite: 1].

---

## 🛠️ Technologies and Tools

This project was built using a **Monolithic Architecture (Server-Side Rendering)**, ensuring a simplified local execution environment and direct integration with the database.

| Category | Technologies Used |
| :--- | :--- |
| **Front-end (Views)** | EJS (Embedded JavaScript), HTML, Tailwind CSS (via CDN) |
| **Back-end (Server)** | Node.js, Express.js |
| **Database** | PostgreSQL, SQL |
| **DB Management** | PgAdmin, MySQL Workbench (Modeling) |
| **Tools & IDE** | Visual Studio Code, ASTAH (Use Cases) |
| **Versioning** | Git, GitHub |

---

## 🗄️ Conceptual Modeling

The relational database (PostgreSQL) was structured to ensure data integrity and security[cite: 1]. The main entities of the system include:

* **User (`Usuario`):** Stores credentials (with encrypted passwords) and defines the access profile (Citizen or Admin)[cite: 1].
* **Issue (`Ocorrencia`):** The central entity that links the author of the report to the problem's details[cite: 1].
* **Address (`Endereco`):** Location data strictly linked to an issue (Street, Neighborhood, Reference)[cite: 1].
* **Category & Status (`Categoria` & `Situacao`):** Domain tables used to parameterize the types of problems and their current resolution statuses[cite: 1].

---

## Entity Relationship Model
<img width="690" height="644" alt="modelo-t1bd-v1" src="https://github.com/user-attachments/assets/253a8bca-f23c-47ca-8de2-4fefc87d3838" />

---

## Use Cases
<img width="764" height="410" alt="uc-cidadao" src="https://github.com/user-attachments/assets/66b1aaf2-6902-4563-9ff1-77537af49ec6" />
<img width="675" height="394" alt="uc-admin" src="https://github.com/user-attachments/assets/5a3150fd-a5e9-4a51-919a-ed849d7b1e24" />

---

## 🚀 How to Run the Project

Follow the steps below to run the application locally in your development environment.

### Pre-requisites
* **Node.js** installed on your machine.
* **PostgreSQL** installed and running locally.
* **Git** to clone the repository.

### Step 1: Clone the Repository
```bash
git clone [https://github.com/YOUR_USERNAME/fullstack-urban-issue-tracker.git](https://github.com/YOUR_USERNAME/fullstack-urban-issue-tracker.git)
cd fullstack-urban-issue-tracker
