# Student Directory Application

## Project Description

The Student Directory Application is a React frontend connected to an Express.js and MongoDB backend in a unified monorepo structure. It allows users to register an account, log in, and view the student directory after successful authentication.

The application uses JWT (JSON Web Token) authentication to protect student data and prevent unauthorized access.

## Technologies Used

- React
- Vite
- React Router DOM
- JavaScript
- CSS
- Express.js
- MongoDB Atlas
- JWT Authentication

## Features

- User registration
- User login and logout
- JWT authentication
- Token persistence using localStorage
- Protected student directory
- Automatic redirect for unauthenticated users
- Student list with loading and error states
- Authorization header when requesting student data

## Project Setup

### Prerequisites

Make sure you have installed:

- Node.js and npm
- Visual Studio Code
- MongoDB Atlas account

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd student-directory-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure the Backend

The application requires the Express student index.js backend to be running.

In the backend project folder, create or check your `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
```

Do not upload your actual `.env` file or expose your database credentials.

Make sure the backend has CORS configured to allow requests from:

```text
http://localhost:5173
```

The backend should also expose these routes:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/students`

### 4. Start the Backend

Open a terminal in the backend folder and run:

```bash
node index.js
```

### 5. Start the React Frontend

Open another terminal in the frontend folder and run:

```bash
npm run dev
```

Open the local URL displayed by Vite, usually:

```text
http://localhost:5173
```

## Application Routes

| Route | Description |
|---|---|
| `/` | Redirects based on authentication status |
| `/login` | User login page |
| `/register` | User registration page |
| `/students` | Protected student directory |

## Authentication

The application uses an AuthContext to manage the user's authentication state.

After a successful login, the JWT is saved in localStorage. The token is then included in the Authorization header when requesting student data.

If the token is missing, invalid, or expired, the backend rejects the request and the frontend redirects the user to the login page.

## Project Screenshots

Screenshots are saved in the `screenshots` folder.

1. Login Page: `screenshots/login.png`
2. Registration Page: `screenshots/register.png`
3. Successful Student Directory: `screenshots/students.png`
4. Failed Login: `screenshots/failed-login.png`
5. Protected Route Redirect: `screenshots/protected-route.png`
6. Authorization Header: `screenshots/network-token.png`

## Reflection Questions

### 1. Why is localStorage used to store the JWT? What is one risk of this approach, and what is a more secure alternative?

Storing the token in localStorage allows the client application to easily persist authentication state across page refreshes and browser sessions without requiring repeated logins. However, a major security risk of this approach is vulnerability to Cross-Site Scripting (XSS) attacks, as any injected malicious script can read the token. A more secure alternative is storing the JWT inside an HTTP-only cookie, which prevents client-side script access entirely.

### 2. What is the purpose of AuthContext, and why is it better than passing authentication data through props?

The purpose of AuthContext is to provide a global state management mechanism that shares authentication data and methods across the entire component tree without prop drilling. Passing the token manually as a prop to every single component would make the code heavily cluttered, rigid, and extremely difficult to maintain as the application scales. Context allows any nested component to cleanly consume or update authentication state directly.

### 3. What should happen in the frontend when a JWT expires?

When a JWT expires, subsequent API requests made with that token are rejected by the backend with a 401 Unauthorized response code. For a seamless user experience, the frontend should catch this response, automatically clear the expired token from storage, and redirect the user back to the login page. Additionally, displaying a friendly notification message explaining that the session has expired helps guide the user smoothly back into signing in.

### 4. What is the difference between backend requireAuth middleware and frontend ProtectedRoute? Why are both needed?

The backend's requireAuth middleware executes on the server to verify JWT signatures and block unauthorized API requests directly at the database level. In contrast, the frontend's ProtectedRoute is a client-side router guard that controls page-level view rendering based on local authentication status. We need both because client-side routing guards can easily be bypassed or manipulated by users in the browser, making server-side validation mandatory for real data security.

## Author
Christopher Borlaza
Student Directory Application Project
