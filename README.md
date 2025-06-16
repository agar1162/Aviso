
# 🚀 Fullstack Development Setup

This project includes a **FastAPI** backend and a **Next.js** frontend. Follow the instructions below to set everything up for local development.

---

## 📁 Project Structure

```
project-root/
├── backend/
│   └── app/
│       ├── main.py
│       └── ... (other FastAPI files)
├── frontend/
│   └── ... (Next.js app)
└── README.md
```

---

## 🛠 Step-by-Step Development Setup

### ✅ 1. Start the FastAPI Backend

1. **Navigate to the backend app folder**:
   ```bash
   cd backend/app
   ```

2. **Create a Python virtual environment**:
   ```bash
   python3 -m venv .venv
   ```

3. **Activate the virtual environment**:

   - On macOS/Linux:
     ```bash
     source .venv/bin/activate
     ```

   - On Windows (CMD):
     ```cmd
     .venv\Scripts\activate
     ```

   - On Windows (PowerShell):
     ```powershell
     .venv\Scripts\Activate.ps1
     ```

4. **Go back to the backend root directory**:
   ```bash
   cd ..
   ```

5. **Run the FastAPI development server**:
   ```bash
   uvicorn app.main:app --reload
   ```

   This will start the FastAPI backend at:  
   📍 http://localhost:8000

---

### ✅ 2. Start the Frontend

1. **Open a new terminal** (leave the backend running in the old one).

2. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

3. **Install frontend dependencies** (only needed the first time):
   ```bash
   npm install
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

   This will start the frontend at:  
   📍 http://localhost:3000

---

## 🧪 Summary

| Service   | Command to Start                             | URL                   |
|-----------|-----------------------------------------------|------------------------|
| Backend   | `uvicorn app.main:app --reload`              | http://localhost:8000 |
| Frontend  | `npm run dev` (inside `/frontend`)           | http://localhost:3000 |

> 🔁 Keep both servers running in **separate terminal tabs or windows**.

---

## ✅ Done!

You’re now ready to develop and test both the backend and frontend locally. Any changes to your Python or frontend code will automatically reload the respective servers in dev mode.
