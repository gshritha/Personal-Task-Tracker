# Personal Task Tracker

A full-stack task management application with user authentication, built with Spring Boot and React.

## Features

- User registration and login (JWT authentication)
- Create, delete, and toggle status (Pending/Completed) for tasks
- Task priority levels (Low, Medium, High)
- Task categories (Work, Personal, Health, Finance, Other)
- Progress bar showing completed vs total tasks
- Forgot password / reset password (email + new password, no email verification)
- Browser notifications for tasks due today or overdue
- Role field (User/Admin) on user accounts (currently for future use — no admin-only features yet)

## Tech Stack

**Backend:** Java, Spring Boot, Spring Security, JWT, MySQL, Hibernate/JPA

**Frontend:** React, Vite, React Router, Axios

## Project Structure

- `Personal-Task-Tracker-Backend` — Spring Boot REST API
- `Personal-Task-Tracker-Frontend` — React frontend

## Running the project

### Backend
1. Open `Personal-Task-Tracker-Backend` in IntelliJ (or your preferred IDE)
2. Set up a MySQL database and update `application.properties` with your credentials
3. Run `PersonalTaskTrackerApplication.java`
4. Backend runs on `http://localhost:8080`

### Frontend
1. Open a terminal in `Personal-Task-Tracker-Frontend`
2. Run `npm install`
3. Run `npm run dev`
4. Frontend runs on `http://localhost:5173`

## Known limitations / next steps

- Task editing (title, description, priority, etc.) is supported by the backend (`PUT /api/v1/tasks/{id}`) but not yet wired up on the frontend
- Password reset does not verify identity via email — anyone with an account's email can reset its password
- Reminders/notifications only fire while the Tasks page is open in the browser; there's no background or push notification system yet
