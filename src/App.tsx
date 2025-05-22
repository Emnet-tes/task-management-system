// src/App.tsx
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import TaskDetailPage from "./pages/TaskDetailPage";
import TaskFormPage from "./pages/TaskFormPage";
import TasksPage from "./pages/TasksPage";

function AppRoutes() {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location } ;

  return (
    <>
      <Routes location={state?.backgroundLocation || location}>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/tasks/:id" element={<TaskDetailPage />} />
      </Routes>
      {state?.backgroundLocation && (
        <Routes>
          <Route path="/tasks/add" element={<TaskFormPage />} />
          <Route path="/tasks/edit/:id" element={<TaskFormPage />} />
        </Routes>
      )}
    </>
  );
}

export default AppRoutes;
