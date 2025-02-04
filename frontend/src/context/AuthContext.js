
import React, { createContext, useState, useEffect } from "react";
import axios from "../api/axios"; // Ensure this path is correct

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User state
  const [loading, setLoading] = useState(true); // Loading state

  // On component mount, check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        localStorage.removeItem("user"); // Remove invalid data
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "/auth/login",
        { email, password },
        { withCredentials: true } // Ensure cookies are sent
      );

      console.log("Login Response:", response.data); // Debugging

      if (response.data != null && response.data != undefined) {
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
        return response.data; // Ensure userData is returned
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  // Signup function
  const signup = async (name, email, password, role) => {
    try {
      const response = await axios.post(
        "/auth/signup",
        { name, email, password, role },
        { withCredentials: true } // Ensure cookies are sent if needed
      );

      console.log("Signup Response:", response.data); // Debugging

      if (response.data.success && response.data.data) {
        // Optionally, automatically log in the user after signup
        setUser(response.data.data);
        localStorage.setItem("user", JSON.stringify(response.data.data));
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      throw new Error(error.response?.data?.message || "Signup failed");
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const response = await axios.post(
        "/auth/logout",
        {},
        { withCredentials: true }
      );

      if (response.data.message=="Logged out successfully") {
        setUser(null);
        localStorage.removeItem("user");
      } else {
        throw new Error(response.data.message || "Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Optionally, handle logout errors
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
