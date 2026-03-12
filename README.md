# Hostel Management System (MSE 1)

**A modern, responsive, and dynamic Hostel Management Dashboard.**

This project was built as part of an academic requirement (MSE 1) to demonstrate full-stack web development integration using HTML, CSS, JavaScript, Node.js, Express, and MongoDB.

## 🚀 Features

- **Modern Glassmorphism UI**: A visually stunning and responsive dashboard interface.
- **RESTful API Backend**: A Node.js and Express backend handling full CRUD operations.
- **Database Integration**: Mongoose Schema defined for MongoDB.
- **Zero-Config Fallback**: If a local MongoDB instance is not running on port `27017`, the Node server automatically falls back to an **In-Memory Array**, allowing instant plug-and-play testing without database configuration errors.
- **Dynamic Frontend Rendering**: Fetch API used to seamlessly load, add, and delete student data without page reloads.

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS (Vanilla + CSS Variables), Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose API) + In-Memory Fallback
- **Other Tools**: CORS, Dotenv

## 📦 Installation & Setup

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.
Optional: MongoDB installed and running on `localhost:27017` (If not installed, the app will run from temporary memory).

### 1. Clone the Repository
```bash
git clone https://github.com/Priyesh288/mse-1-aifsd-priyesh-kumar.git
cd mse-1-aifsd-priyesh-kumar
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Application

You will need to run two servers for this full-stack app.

**Start the Backend API Server:**
```bash
node index.js
```
*The backend server will run on `http://localhost:5000`.*

**Start the Frontend UI (Simple HTTP Server):**
If you have Python installed:
```bash
python -m http.server 8000
```
Or simply open `index.html` in your browser. (Note: using a local server like Live Server or Python is recommended to avoid CORS issues).

*The interface will be available at `http://localhost:8000`.*

## 📋 File Structure

- `/index.html` - The main dashboard layout and UI forms.
- `/style.css` - Custom styling using glassmorphism effects.
- `/script.js` - Frontend logic for fetching APIs, animating numbers, and toggling forms.
- `/index.js` - Express backend server and CRUD logic.
- `/model.js` - Mongoose database schema definitions.
- `/.env` - Environment variables (Port & MongoDB URI).

## 👤 Author
**Priyesh Kumar**
