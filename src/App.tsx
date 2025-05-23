// src/App.tsx
import {
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import TaskDetailPage from "./pages/TaskDetailPage";
import TasksPage from "./pages/TasksPage";
import NotFound from "./pages/NotFound";

function AppRoutes() {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location } ;

  return (
    <>
      <Routes location={state?.backgroundLocation || location}>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<TasksPage/>} />
        <Route path="/tasks/:id" element={<TaskDetailPage />} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </>
  );
}

export default AppRoutes;
