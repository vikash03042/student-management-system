# Student Management System (SMS)

[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5.14-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white)](https://spring.io/projects/spring-security)
[![JWT](https://img.shields.io/badge/JWT-Authentication-black?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![React](https://img.shields.io/badge/React-18.x-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Maven](https://img.shields.io/badge/Maven-3.x-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white)](https://maven.apache.org/)

A secure full-stack web application designed to manage students, courses, attendance, and fee records efficiently.

---

## 🚀 Project Overview

The Student Management System is a full-stack web application developed to simplify academic administration. It enables administrators to manage students, courses, attendance records, and fee transactions through a secure and centralized platform.

The application uses JWT-based authentication and role-based authorization to ensure secure access to system resources.

---

## ✨ Features

### 🔐 Authentication & Security
*   **JSON Web Tokens (JWT)**: Stateless token-based session verification with 10-hour sliding window expiration checks.
*   **Secure Registration**: Direct user registration with automatic validation checks to prevent duplicate signups.
*   **Role-Based Authorization**: Restricts REST APIs using Spring Security's `@PreAuthorize` method annotations based on `ROLE_ADMIN` and `ROLE_STUDENT`.
*   **Password Hashing**: Implements the industry-standard BCrypt hashing function via `BCryptPasswordEncoder`.

### 🎓 Student Management
*   **Administrative CRUD**: Full CRUD support for student profiles. Roll numbers are strictly unique (`existsByRoll` validation).
*   **Search, Pagination & Sorting**: High-speed database searching on student names, roll numbers, or courses, supported by cursor-based sorting and JPA page requests.
*   **Isolated Profile Access**: Students can retrieve and update only their own profile details.

### 📚 Course Management
*   **Course Cataloging**: Admin endpoints to configure new courses, configure fees, set program durations, and update descriptions.
*   **Public Access**: Enables unregistered users or students to view available courses to decide on enrollment during registration.
*   **Automatic Seed Data**: Automatic execution of a `DatabaseSeeder` on startup to seed default courses (e.g. Computer Science, Mechanical, Business Administration) if the catalog is empty.

### 📅 Attendance Management
*   **Batch Attendance Logging**: Multi-record payloads parsed synchronously to mark status (`PRESENT`, `ABSENT`, `LATE`) for multiple students at once.
*   **Stats Dashboard**: Computes attendance ratios, present/absent count, and overall percentage rates.
*   **Date-Level Tracking**: Queries attendance sheets for specific calendar dates to locate absenteeism.

### 💵 Fee Management
*   **Ledger Recording**: Admins can log incoming payment amounts against students.
*   **Outstanding Balances**: Real-time balance calculations subtracting total payment amounts from total expected course fees.
*   **Global Invoice Statistics**: Summary statistics showing expected total revenues vs. actual collected fees vs. outstanding deficits.

---

## 🛠️ Tech Stack

| Technology | Layer | Purpose |
| :--- | :--- | :--- |
| **Java 21** | Language | High-performance OOP development platform using modern language features. |
| **Spring Boot 3.5**| Framework | Microservice framework providing auto-configurations, dependency injection, and embedded Tomcat execution. |
| **Spring Security**| Security | Robust security configuration for CORS, CSRF disable, session filters, and API authorization. |
| **JWT (jjwt)** | Security | Generation, validation, and parsing of stateless HS256 HMAC-signed tokens. |
| **Spring Data JPA**| Data Access | Object-Relational Mapping (ORM) using Hibernate implementation to abstract SQL statements. |
| **MySQL 8.0** | Database | Relational database to persist transactional user records, courses, attendance, and fee logs. |
| **Maven 3.x** | Build Tool | Dependency manager and project lifecycle management tool. |
| **React.js 18** | Frontend | Single-Page Application (SPA) dashboard UI built with reusable declarative components. |
| **Axios** | API Client | Promise-based HTTP client to consume Spring Boot REST API endpoints. |

---

## 📐 System Architecture

The project is designed following a **3-Tier Layered Architecture** pattern ensuring separation of concerns:

```
                  ┌───────────────────────────────┐
                  │          React UI             │
                  └───────────────┬───────────────┘
                                  │ Axios HTTP (JSON + Bearer)
                                  ▼
                  ┌───────────────────────────────┐
                  │       REST Controllers        │
                  │   (DTO Mapping / Auth Check)  │
                  └───────────────┬───────────────┘
                                  │ Data Transfer Objects (DTO)
                                  ▼
                  ┌───────────────────────────────┐
                  │         Service Layer         │
                  │   (Business / Validation)     │
                  └───────────────┬───────────────┘
                                  │ Entities / JPA
                                  ▼
                  ┌───────────────────────────────┐
                  │       Repository Layer        │
                  │      (Spring Data JPA)        │
                  └───────────────┬───────────────┘
                                  │ SQL Queries
                                  ▼
                  ┌───────────────────────────────┐
                  │       MySQL Database          │
                  └───────────────────────────────┘
```

---

## 📁 Project Structure

```
student-management-system/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/sms/
│   │   │   │   ├── SmsApplication.java          # Entry Point
│   │   │   │   ├── DatabaseSeeder.java          # Startup Data Seeding
│   │   │   │   ├── controller/                  # REST Controllers
│   │   │   │   ├── dto/                         # DTOs
│   │   │   │   ├── entity/                      # JPA Entities & Enums
│   │   │   │   ├── exception/                   # Exceptions & Global Handler
│   │   │   │   ├── repository/                  # Spring Data Repositories
│   │   │   │   ├── security/                    # JWT & Security configuration
│   │   │   │   └── service/                     # Service Interfaces & Impl
│   │   │   └── resources/
│   │   │       └── application.properties       # DB Configurations
│   └── pom.xml                                  # Maven Dependencies
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── assets/                              # Images / Global Assets
    │   ├── pages/                               # Dashboard, login, views
    │   │   ├── AttendanceManager.jsx
    │   │   ├── CourseManager.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── FeeManager.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── StudentAttendance.jsx
    │   │   ├── StudentFees.jsx
    │   │   └── StudentManager.jsx
    │   ├── utils/                               # Helper modules
    │   │   └── auth.js                          # LocalStorage & JWT handlers
    │   ├── App.css                              # Custom Styling
    │   ├── App.jsx                              # Route Router Layout
    │   └── main.jsx                             # Dom Binder
    ├── index.html                               # HTML Entry
    ├── package.json                             # Node Scripts & Dependencies
    └── vite.config.js                           # Bundler Config
```

---

## 💾 Database Design

### Relationships & Schemas
*   **`users` ↔ `roles` (Many-to-Many via `users_roles`)**: Maps security permissions.
*   **`users` ↔ `students` (One-to-One)**: Links authentication credentials to profile data.
*   **`courses` ↔ `students` (One-to-Many)**: A course maps to multiple student enrollments.
*   **`students` ↔ `attendance` (One-to-Many)**: Maps historical dates to attendance logs.
*   **`students` ↔ `fees` (One-to-Many)**: Logs multiple partial fee installment payments.

```sql
-- Core users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Roles table
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

-- Students mapping
CREATE TABLE students (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    roll INT UNIQUE NOT NULL,
    address VARCHAR(255) NOT NULL,
    course_id INT,
    user_id INT UNIQUE,
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Attendance tracking
CREATE TABLE attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    UNIQUE KEY (student_id, date),
    FOREIGN KEY (student_id) REFERENCES students(id)
);

-- Fees tracking
CREATE TABLE fees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    amount DOUBLE NOT NULL,
    payment_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id)
);
```

---

## 🔌 API Documentation

### 🔑 Authentication Module (`/auth/**`)
*   `POST /auth/register` - Registers a user (Admin/Student).
*   `POST /auth/login` - Authenticates user. Returns JWT and roles.

### 🎓 Student Module (`/students/**`)
*   `GET /students` - Fetches paginated, sorted, and searchable students.
*   `GET /students/{id}` - Returns profile details (Admin or Owner only).
*   `POST /students` - Manually registers a student (Admin only).
*   `PUT /students/{id}` - Modifies profile data.
*   `DELETE /students/{id}` - Deletes a student profile (Admin only).
*   `GET /students/count` - Returns total count of enrolled students (Admin only).

### 📚 Course Module (`/courses/**`)
*   `GET /courses` - Public retrieval of available courses.
*   `POST /courses` - Adds a course details configuration (Admin only).
*   `PUT /courses/{id}` - Updates course data (Admin only).
*   `DELETE /courses/{id}` - Deletes a course (Admin only).

### 📅 Attendance Module (`/attendance/**`)
*   `POST /attendance/mark` - Saves batch attendance records (Admin only).
*   `GET /attendance/date/{date}` - Fetches logs of a specific date (Admin only).
*   `GET /attendance/student/{studentId}` - Fetches attendance logs of a student (Admin only).
*   `GET /attendance/student/{studentId}/stats` - Returns attendance percentage (Admin only).
*   `GET /attendance/my` - Allows student to view their attendance history.
*   `GET /attendance/my/stats` - Allows student to view their attendance metrics.

### 💵 Fee Module (`/fees/**`)
*   `POST /fees` - Records payment installment logs (Admin only).
*   `GET /fees` - Lists all recorded transactions (Admin only).
*   `GET /fees/stats` - Global dashboard stats (Total Revenue vs Outstanding) (Admin only).
*   `GET /fees/student/{studentId}` - Checks ledger records of a student (Admin only).
*   `GET /fees/my` - Allows student to view their personal payment entries.
*   `GET /fees/my/stats` - Allows student to view their personal fee metrics.

---

## 🔒 Security Implementation

### 🔄 JWT Security Filter Flow
```
[HTTP Request] 
      │ (Includes Bearer Token in Header)
      ▼
[JwtAuthenticationFilter]
      │ Extracts Header -> Checks if valid Bearer prefix.
      │ Decrypts JWT payload using HS256 Secret Key.
      ▼
[Token Validation]
      │ Extracted username -> CustomUserDetailsService.loadUserByUsername()
      │ Validates signature, validity window, and expirations.
      ▼
[Security Context Setup]
      │ Generates UsernamePasswordAuthenticationToken.
      │ Populates role authorities -> SecurityContextHolder.getContext().setAuthentication().
      ▼
[REST Endpoint Controller Routing]
```

### Authorization Levels
*   **Method-Level Guarding**: Secured using `@EnableMethodSecurity`. Access conditions are checked before method invocations via `@PreAuthorize("hasRole('ADMIN')")` or `@PreAuthorize("hasRole('STUDENT')")`.
*   **Row-Level Isolation**: For sensitive routes (like viewing a student's personal fee records or attendance statistics), the backend resolves identifiers using the authenticated token’s name (resolved email) instead of client-supplied parameter parameters.

---

## 🖼️ Screenshots

### Login Page

<img width="1068" height="1146" alt="image" src="https://github.com/user-attachments/assets/c37f8d44-2047-4469-8f8d-f90ae54c00ca" />

### System Dashboard
  <img width="2048" height="1141" alt="5f0a063e-62c5-4e44-bc70-1127598d8b13" src="https://github.com/user-attachments/assets/fc776987-1c56-466e-bacc-79c414d386cb" />



<img width="2048" height="1128" alt="90428df8-516b-4f17-b62e-90d434530953" src="https://github.com/user-attachments/assets/cfa68601-6166-495a-b2ff-b8061712052f" />
 <img width="2047" height="1047" alt="dbeb24ff-b854-4d36-9ac3-371e082310b9" src="https://github.com/user-attachments/assets/fb1ada63-0687-488f-b5ef-ffaa64b4b576" />
<img width="2048" height="1029" alt="dd78fd44-91ed-4322-9ed0-0f09a8295d1e" src="https://github.com/user-attachments/assets/eca3eb3b-4185-4f43-bf0a-65f2332049e4" />


---

## 🛠️ Installation Guide

### Prerequisites
*   Java Development Kit (JDK) 21
*   Maven 3.x
*   Node.js (v18+) & npm
*   MySQL Server 8.0

### Database Setup
1.  Log in to your MySQL command line client or workbench:
    ```sql
    CREATE DATABASE sms;
    ```
2.  Open [backend/src/main/resources/application.properties](file:///Users/vikashkumar/Downloads/sms/backend/src/main/resources/application.properties) and update the database username and password parameters:
    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/sms
    spring.datasource.username=YOUR_MYSQL_USERNAME
    spring.datasource.password=YOUR_MYSQL_PASSWORD
    ```

### Running Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
*   The server will start up on `http://localhost:8080`.
*   On startup, default courses will be seeded automatically by `DatabaseSeeder.java`.

### Running Frontend
```bash
cd frontend
npm install
npm run dev
```
*   The Vite React dev server will spin up on `http://localhost:5173`. Open this URL in your web browser.

---

## 🔮 Future Enhancements
*   **Dashboard Analytics**: Visual data charts showing attendance trends and monthly payment records.
*   **Report Generation**: Option to download student reports, attendance records, and payment receipts in PDF or Excel sheet format.
*   **Profile Images**: Option to upload student profile pictures using AWS S3 storage integration.

---

## 📄 Resume Description
*   Designed and implemented a full-stack **Student Management System** utilizing **Java 21**, **Spring Boot 3.5**, **Spring Security**, and **React.js**.
*   Built a stateless security layer utilizing **JWT (JSON Web Tokens)** and **Role-Based Access Control (RBAC)** to secure sensitive backend APIs.
*   Engineered JPA Hibernate queries (wildcards, aggregate data counters) to calculate revenue metrics and handle paginated searches.
*   Designed custom exception classes and unified error formats mapping to dynamic client alerts using a `@ControllerAdvice` global handler.

---

## 🎙️ Interview Questions & Explanations

### ⏱️ 30-Second Elevator Pitch
> "I developed a secure, full-stack Student Management System using Spring Boot, Spring Security, JWT, and React. It automates administrative tasks like student cataloging, course configurations, daily attendance tracking, and payment logging. It features role-based access control, allowing admins to oversee institutional records while letting students access their personal profiles, fee payments, and attendance ratios."

### ⏱️ 1-Minute Explanation
> "I developed a secure Student Management System using Spring Boot and React. The application targets academic operations like tracking registrations, daily attendance grids, and installment billing. The backend runs on Java 21, Spring Data JPA, and MySQL, while security is implemented using Spring Security filters, BCrypt password hashing, and HMAC-signed JWT tokens.
> I configured method-level security with annotations to secure REST routes based on user roles. The data persistence layer utilizes Hibernate to query paginated records. On the frontend, React components fetch data asynchronously from the API to show real-time stats like outstanding fees and attendance metrics."

### ⏱️ 2-Minute Technical Walkthrough
> "I built a Student Management System using a 3-tier layered architecture consisting of a React.js client, a Spring Boot REST API, and a MySQL database.
> The core focus of the system is security and structural data integrity. I implemented stateless JWT authentication. When a user logs in, the backend authenticates their credentials using an AuthenticationManager, signs a JWT token containing their authorities, and returns it to the client. The React app stores this token and attaches it to the Authorization header of subsequent Axios requests. An interceptor filter decrypts incoming tokens to authenticate sessions.
> On the database layer, I designed relationships to map course enrollments, payments, and attendance. I used Spring Data JPA to write custom queries, such as calculate outstanding balances by checking course rates against logged payment histories.
> To handle exceptions cleanly, I implemented a `@ControllerAdvice` global exception handler. This intercepts database errors, like duplicate rolls, and returns structured API responses. On the frontend, I used React routing to build dynamic pages, allowing admins to manage data grids and students to view personal statistics."

---

## 💡 Key Concepts Demonstrated
*   **Dependency Injection**: Loose coupling using Spring's container IOC.
*   **JPA Bidirectional Mapping**: Modeling entities with `@ManyToOne` and `@OneToMany` relationships.
*   **Stateless Security**: Integrating filters to bypass server-side HTTP session storage.
*   **Pagination & Sorting**: Using `Pageable` and database-level search criteria to optimize queries.
*   **Global Exception Handling**: Mapping errors to clean, structured REST JSON responses.
