// frontend/src/components/Navbar.jsx

import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
    // user.name=null;
    // user.role=null;
    navigate("/");
  };

  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between">
      <h1 className="text-xl font-bold">School CRM</h1>
      {/* <div>
        {user ? (
          <>
            <span className="mr-4">{user.name} ({user.role})</span>
            <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">
              Logout
            </button>
          </>
        ) : (
          <Link to="/" className="bg-green-500 px-3 py-1 rounded">
            Login
          </Link>
        )}
      </div> */}
      {user && (
  <div>
    <span className="mr-4">{user.name} ({user.role})</span>
    <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">
      Logout
    </button>
  </div>
)}

    </nav>
  );
};

export default Navbar;
