import { signOut } from "firebase/auth";

import { useNavigate } from "react-router-dom";

import { auth } from "../config/firebase";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="bg-white shadow-sm rounded-lg p-4 mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Welcome, {user?.email}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </header>
      </div>
    </div>
  );
};

export default Dashboard;
