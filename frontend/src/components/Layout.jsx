// frontend/src/components/Layout.jsx

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow">
        <div className="container mx-auto px-4">
          {/* <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="font-bold text-xl text-blue-600">School CRM</span>
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {user?.role === 'admin' && (
                  <>
                    <Link to="/admin" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
                    <Link to="/admin/teachers" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">Teachers</Link>
                    <Link to="/admin/students" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">Students</Link>
                    <Link to="/admin/classes" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">Classes</Link>
                    <Link to="/admin/financial" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">Financial Analytics</Link>
                  </>
                )}
                {user?.role === 'teacher' && (
                  <>
                    <Link to="/teacher" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
                    <Link to="/teacher/classes" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">My Classes</Link>
                  </>
                )}
                {user?.role === 'student' && (
                  <>
                    <Link to="/student" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
                    <Link to="/student/classes" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">My Classes</Link>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center">
              {user && (
                <button
                  onClick={logout}
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              )}
            </div>
          </div> */}
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;
