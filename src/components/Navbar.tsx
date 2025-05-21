import { signOut } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../config/firebase";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <nav className="w-full bg-white shadow-sm mb-6">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <span className="text-xl font-bold text-gray-800">Task Manager</span>
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to="/tasks"
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
          >
            Tasks
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
