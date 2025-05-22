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
        <div className="md:hidden fixed inset-25 right-0 left-130 px-4 pb-4 flex flex-col gap-2 bg-white shadow-lg  w-fit h-fit border border-gray-200 rounded-lg">
          <Link
            to="/dashboard"
            className={`px-3 py-2 rounded-md font-medium transition-colors ${isActive(
              "/dashboard"
            )}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/tasks"
            className={`px-3 py-2 rounded-md font-medium transition-colors ${isActive(
              "/tasks"
            )}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Tasks
          </Link>
          <button
            onClick={() => {
              handleAddTaskClick();
              setIsMenuOpen(false);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Add Task
          </button>
          <button
            onClick={() => {
              handleLogout();
              setIsMenuOpen(false);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Logout
          </button>
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
