import { signOut } from "firebase/auth";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { auth } from "../config/firebase";
import { useState } from "react";
import TaskFormModal from "./TaskFormModal";
import { CiMenuBurger } from "react-icons/ci";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const handleAddTaskClick = () => {
    setEditTaskId(null);
    setIsModalOpen(true);
  };

  const isActive = (path: string) =>
    location.pathname.startsWith(path)
      ? "bg-gray-200 text-blue-700"
      : "text-gray-700";

  return (
    <nav className="w-full bg-white shadow-sm mb-6">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <span className="text-xl font-bold text-gray-800">Task Manager</span>
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-2xl text-gray-700 hover:text-blue-700"
          >
            <CiMenuBurger />
          </button>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/dashboard"
            className={`px-3 py-2 rounded-md font-medium transition-colors ${isActive(
              "/dashboard"
            )}`}
          >
            Dashboard
          </Link>
          <Link
            to="/tasks"
            className={`px-3 py-2 rounded-md font-medium transition-colors ${isActive(
              "/tasks"
            )}`}
          >
            Tasks
          </Link>
          <button
            onClick={handleAddTaskClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Add Task
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed top-0 left-0 right-0 w-full h-full bg-white z-50 flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <span className="text-xl font-bold text-gray-800">
              Task Manager
            </span>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-2xl text-gray-700 hover:text-blue-700"
              aria-label="Close menu"
            >
              &times;
            </button>
          </div>
          <div className="flex flex-col items-center gap-6 mt-10">
            <Link
              to="/dashboard"
              className={`w-3/4 text-center px-4 py-3 rounded-lg text-lg font-medium transition-colors ${isActive(
                "/dashboard"
              )} hover:bg-gray-100`}
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/tasks"
              className={`w-3/4 text-center px-4 py-3 rounded-lg text-lg font-medium transition-colors ${isActive(
                "/tasks"
              )} hover:bg-gray-100`}
              onClick={() => setIsMenuOpen(false)}
            >
              Tasks
            </Link>
            <button
              onClick={() => {
                handleAddTaskClick();
                setIsMenuOpen(false);
              }}
              className="w-3/4 px-4 py-3 text-lg bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Add Task
            </button>
            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="w-3/4 px-4 py-3 text-lg bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <TaskFormModal
          taskId={editTaskId ?? undefined}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {}}
        />
      )}
    </nav>
  );
};

export default Navbar;
