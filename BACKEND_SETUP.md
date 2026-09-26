# 🎬 RK Broken Halo — Backend Setup Guide

Welcome to the backend setup documentation for **RK Broken Halo** (Editor • Creator Cinematic Portfolio).

This backend is built using **Node.js**, **Express.js**, **Mongoose (MongoDB)**, **CORS**, and **dotenv**. It provides RESTful APIs for retrieving editing projects and handling contact form inquiries with automatic data validation and error handling.

---

## 📁 Project Structure

```text
Youtube2/
├── index.html                  # Cinematic Portfolio HTML (Preserved)
├── index.css                   # Custom styles & design system (Preserved)
├── index.js / script.js        # Frontend script with API integration
├── avatar.jpeg                 # Profile avatar asset
├── BACKEND_SETUP.md            # This documentation guide
└── backend/
    ├── server.js               # Express server entry point (Port 5000)
    ├── package.json            # Node.js dependencies & scripts
    ├── .env                    # Local environment variables
    ├── .env.example            # Template for environment configuration
    ├── models/
    │   ├── Contact.js          # Mongoose schema for contact messages
    │   └── Project.js          # Mongoose schema for portfolio projects
    ├── controllers/
    │   ├── contactController.js# Contact form validation & DB handler
    │   └── projectController.js# Projects API & auto-seeding handler
    └── routes/
        ├── contact.js          # /api/contact routes
        └── projects.js         # /api/projects routes
```

---

## 🛠️ Prerequisites & Installation

### 1. Install Node.js
If you don't already have Node.js installed:
- Download the LTS version from [https://nodejs.org/](https://nodejs.org/).
- Verify installation in your terminal / PowerShell:
  ```powershell
  node -v
  npm -v
  ```

### 2. Install Backend Dependencies
Open your terminal in the `backend/` directory and install the packages:

```powershell
cd backend
npm install
```

> **Note on Windows PowerShell**: If PowerShell displays an execution policy error on `npm`, run:
> ```powershell
> npm.cmd install
> ```

---

## ⚙️ Environment Configuration (`.env`)

Inside the `backend/` folder, a `.env` file is already created from `.env.example`:

```env
# Server Port
PORT=5000

# MongoDB Connection String (Local MongoDB or MongoDB Atlas)
MONGODB_URI=mongodb://127.0.0.1:27017/rk_broken_halo
```

### Configuring MongoDB (2 Options)

#### Option A: Free MongoDB Atlas (Cloud Database — Recommended)
1. Go to [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free account.
2. Create a free **M0 Shared Cluster**.
3. Under **Database Access**, create a database user (e.g. `rk_admin`) with a secure password.
4. Under **Network Access**, add IP `0.0.0.0/0` (Allow access from anywhere).
5. Click **Connect** > **Drivers** > Copy the connection string.
6. Replace `MONGODB_URI` in `backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/rk_broken_halo?retryWrites=true&w=majority
   ```

#### Option B: Local MongoDB
If you have MongoDB Community Server installed locally on your computer:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/rk_broken_halo
```

> **💡 Resilient Offline Mode**: If MongoDB is not running or is disconnected, the server runs in resilient mode. It serves cached default projects and records contact requests without crashing!

---

## 🚀 Starting the Backend Server

### Development Mode (with automatic reload via Nodemon):
```powershell
cd backend
npm run dev
```

### Production Mode:
```powershell
cd backend
npm start
```

When started, you will see:
```text
══════════════════════════════════════════════════════════
🎬 RK BROKEN HALO BACKEND SERVER STARTED
📡 URL: http://localhost:5000
🩺 Health Check: http://localhost:5000/api/health
📂 Projects API: http://localhost:5000/api/projects
📩 Contact API:  http://localhost:5000/api/contact
══════════════════════════════════════════════════════════
```

---

## 📡 API Endpoints Reference

### 1. Health Check
- **URL**: `GET /api/health`
- **Description**: Verifies that the server is alive and reports MongoDB connection state.
- **Example Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "RK Broken Halo Backend is running!",
    "timestamp": "2026-09-25T16:56:39.895Z",
    "database": "connected"
  }
  ```

---

### 2. Get All Projects
- **URL**: `GET /api/projects`
- **Description**: Returns all editing projects for the portfolio. Automatically seeds the database if empty.
- **Example Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "count": 4,
    "data": [
      {
        "_id": "679500000000000000000001",
        "title": "ANIME EDIT",
        "category": "Anime Edit",
        "description": "High-octane anime sequence synchronized with heavy beat timing, seamless velocity transitions, and cinematic color grading.",
        "thumbnail": "ec-bg-anime",
        "video": "https://youtube.com/@rk._brokenhalo",
        "tools": ["CapCut", "Alight Motion"],
        "tags": ["ANIME", "BEAT SYNC"],
        "style": "Velocity · Color Grading · Impact Effects",
        "featured": true,
        "order": 1
      },
      {
        "_id": "679500000000000000000002",
        "title": "MOVIE EDIT",
        "category": "Movie Edit",
        "description": "Dramatic film narrative with immersive audio sound design, cinematic slow-motion curves, and atmospheric color grading.",
        "thumbnail": "ec-bg-movie",
        "video": "https://youtube.com/@rk._brokenhalo",
        "tools": ["CapCut", "Picsart"],
        "tags": ["MOVIES", "DRAMATIC"],
        "style": "Cinematic Transitions · Color · Slow-Mo",
        "featured": true,
        "order": 2
      }
    ]
  }
  ```

---

### 3. Get Project by ID
- **URL**: `GET /api/projects/:id`
- **Description**: Returns details for a single project.
- **Example Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "679500000000000000000001",
      "title": "ANIME EDIT",
      "category": "Anime Edit",
      "description": "High-octane anime sequence synchronized with heavy beat timing, seamless velocity transitions, and cinematic color grading.",
      "tools": ["CapCut", "Alight Motion"]
    }
  }
  ```
- **Error Response (`404 Not Found`)**:
  ```json
  {
    "success": false,
    "message": "Project not found with ID: 679500000000000000000099"
  }
  ```

---

### 4. Submit Contact Message
- **URL**: `POST /api/contact`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "name": "Alex Carter",
    "email": "alex@example.com",
    "message": "I have an anime sequence from Demon Slayer that needs velocity editing and color grading."
  }
  ```
- **Success Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "message": "Thank you! Your message has been received. RK will get back to you soon!",
    "data": {
      "id": "67950a98f123456789012345",
      "name": "Alex Carter",
      "email": "alex@example.com",
      "createdAt": "2026-09-25T17:00:00.000Z"
    }
  }
  ```
- **Validation Error (`400 Bad Request`)**:
  ```json
  {
    "success": false,
    "message": "Please provide a valid email address (e.g., name@example.com)."
  }
  ```

---

## 🎨 How Frontend Connects to the Backend

The frontend (`index.js` / `script.js`) communicates with the backend via standard `fetch()`:

1. **Dynamic Edits Grid**:
   - On page load, `loadProjects()` calls `GET http://localhost:5000/api/projects`.
   - It dynamically renders the project cards inside `.edits-grid` with all existing tags, badges, and hover animations.
   - If the backend is loading or offline, it gracefully falls back to the original static HTML cards.

2. **Contact Form**:
   - When the user fills `#c-name`, `#c-email`, and `#c-details` and clicks **SEND**, the script sends `POST http://localhost:5000/api/contact`.
   - The submit button displays an animated `"SENDING..."` status followed by `"SENT ✓"` and an inline status message.

---

## 🧪 Testing Frontend + Backend Together

1. **Start the Backend**:
   ```powershell
   cd backend
   npm.cmd run dev
   ```
2. **Open Frontend**:
   - Open `index.html` in your browser or run Live Server in Antigravity IDE.
3. **Verify**:
   - Scroll to **Selected Edits**: cards are loaded dynamically from the backend API.
   - Scroll to **Contact**: enter your name, email, and clip details, then click **SEND** to test real-time form submission.
