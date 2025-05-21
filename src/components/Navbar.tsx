import { signOut } from "firebase/auth";

import { useNavigate } from "react-router-dom";

import { auth } from "../config/firebase";
const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };
  return (
    <div className="items-end flex justify-end">
      <div className="flex space-x-2">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
