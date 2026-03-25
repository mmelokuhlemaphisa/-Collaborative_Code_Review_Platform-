<img src="https://socialify.git.ci/mmelokuhlemaphisa/-Collaborative_Code_Review_Platform-/image?language=1&owner=1&name=1&stargazers=1&theme=Light" alt="-Collaborative_Code_Review_Platform-" width="640" height="320" />

# Collaborative Code Review Platform

## Project Overview

The **Collaborative Code Review Platform** is an API-driven backend service that allows developers to upload code snippets, request reviews, and collaborate on feedback in a structured environment.

Instead of relying only on pull requests, this platform provides a dedicated system where teams can review code, comment on specific lines, approve submissions, and track review progress.

The platform is designed to improve collaboration and streamline the peer review process.

---

# Features

## 1. Authentication & User Management

* User registration
* User login with **JWT authentication**
* Role-based access control (**Reviewer** and **Submitter**)
* User profile management

## 2. Projects / Repositories

* Create new projects
* List projects
* Assign users to projects
* Remove users from projects

## 3. Code Submissions

* Upload code snippets or files (text)
* Associate submissions with a project
* Track submission status:

  * `pending`
  * `in_review`
  * `approved`
  * `changes_requested`
* View and delete submissions

## 4. Comments

* Add comments to submissions
* Inline comments for specific lines of code
* Update or delete comments
* Only **Reviewers** can comment

## 5. Review Workflow

* Reviewers can approve submissions
* Reviewers can request changes
* Track review history for each submission

## 6. Notifications

* Activity feed for users
* Notifications for comments and review actions
* Real-time updates using **WebSockets**

## 7. Analytics Dashboard

Project statistics including:

* Average review time
* Percentage of approved vs rejected submissions
* Most active reviewers
* Submission with the most comments

---

# Tech Stack

### Backend

* Node.js
* Express.js
* TypeScript

### Database

* PostgreSQL

### Authentication

* JWT (JSON Web Token)
* bcrypt (password hashing)

### Real-time Communication

* WebSockets / Socket.IO

### Testing

* thunder client
* postman

---

# Project Structure

```
collaborative-code-review-platform
│
├── src
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── config
│   └── utils
│
├── sql
│   └── schema.sql
│
├── tests
│
├── package.json
├── tsconfig.json
└── README.md
```

---

# API Endpoints

## Authentication

| Method | Endpoint           | Description       |
| ------ | ------------------ | ----------------- |
| POST   | /api/auth/register | Register new user |
| POST   | /api/auth/login    | Login user        |

---

## Projects

| Method | Endpoint                | Description              |
| ------ | ----------------------- | ------------------------ |
| POST   | /api/projects           | Create project           |
| GET    | /api/projects           | List projects            |
| POST   | /api/projects//members  | Assign user to project   |
| DELETE | /api/projects//members/ | Remove user from project |

---

## Submissions

| Method | Endpoint                   | Description                  |
| ------ | -------------------------- | ---------------------------- |
| POST   | /api/submissions           | Create submission            |
| GET    | /api/projects//submissions | List submissions for project |
| GET    | /api/submissions/          | View submission              |
| PATCH  | /api/submissions//status   | Update submission status     |
| DELETE | /api/submissions/          | Delete submission            |

---

## Comments

| Method | Endpoint                   | Description    |
| ------ | -------------------------- | -------------- |
| POST   | /api/submissions//comments | Add comment    |
| GET    | /api/submissions//comments | List comments  |
| PATCH  | /api/comments/             | Update comment |
| DELETE | /api/comments/             | Delete comment |

---

# Installation

### 1. Clone the repository

```
git clone https://github.com/yourusername/collaborative-code-review-platform.git
```

### 2. Navigate to the project folder

```
cd collaborative-code-review-platform
```

### 3. Install dependencies

```
npm install
```

### 6. Run the server

```
npm run dev
```

Server will start at:

```
http://localhost:4000
```

---
# Database Name
Collaborative_Code _Review _Platform

---

# Testing

Run automated tests using:

```
npm test
```

---

# Future Improvements

* Add file uploads for code files
* Implement advanced analytics
* Add frontend dashboard
* Improve notification system
* Add CI/CD pipeline

---

# Author

Developed as part of the **Collaborative Code Review Platform Assessment Project**.
