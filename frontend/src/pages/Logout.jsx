// frontend/src/pages/Logout.jsx

import React, { useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Logout = () => {
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    logout();
  }, [logout]);

  return <Navigate to="/" />;
};

export default Logout;
