# 📝 Task Management Web Application

A full-featured task management web application that allows users to efficiently manage their daily tasks with priority levels, due dates, and real-time interactions.

## 📌 Features

- User authentication with Firebase
- Create, edit, and delete tasks
- Mark tasks as completed
- Task categorization based on due date (e.g. Today’s Tasks, Upcoming)
- Priority labeling (High, Medium, Low)
- Overdue task indication
- Responsive UI with Tailwind CSS

---

## 🛠 Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore)
- **Routing**: React Router
- **State Management**: useState, useEffect, useContext (optional)
- **Deployment**: Vercel / Netlify (specify your platform)

---

## 🧠 Installation & Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/task-manager-app.git
   cd task-manager-app
   ```
2. ** Install dependencies **
   ```bash
   npm install
    ```
3.Configure Firebase
Create a .env file and add your Firebase config:
```bash
VITE_API_KEY=your_api_key
VITE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_PROJECT_ID=your_project_id
VITE_STORAGE_BUCKET=your_bucket
VITE_MESSAGING_SENDER_ID=your_id
VITE_APP_ID=your_app_id
```
4. Run the app
   ```bash
   npm run dev
   ```

