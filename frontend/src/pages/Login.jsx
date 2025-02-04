// // frontend/src/pages/Login.jsx

// import React, { useState, useContext } from "react";
// import AuthContext from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     try {
//       const userData = await login(form.email, form.password);

//       if (userData && userData._id) {
//         // User is already stored in AuthContext and localStorage via AuthContext's login
//         navigate(`/${userData.role}`); // Redirect based on user role
//       } else {
//         setError("Invalid response from server.");
//       }
//     } catch (err) {
//       setError(err.message || "Invalid email or password");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-md p-8 space-y-3 bg-white rounded shadow">
//         <h1 className="text-2xl font-bold text-center">Login</h1>
//         {error && (
//           <div className="p-3 text-red-700 bg-red-100 border border-red-400 rounded">
//             {error}
//           </div>
//         )}
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
//               value={form.email}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div>
//             <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
//               value={form.password}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
//           >
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;

// frontend/src/pages/Login.jsx

import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login, signup } = useContext(AuthContext); // Destructure signup
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true); // Toggle state
  const [form, setForm] = useState({
    name: "", // Only for Signup
    email: "",
    password: "",
    role: "teacher", // Default role for Signup
  });
  const [error, setError] = useState("");

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    // Reset form fields when toggling
    setForm({
      name: "",
      email: "",
      password: "",
      role: "teacher",
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isLogin) {
      // Handle Login
      try {
        const userData = await login(form.email, form.password);

        if (userData && userData._id) {
          navigate(`/${userData.role}`); // Redirect based on user role
        } else {
          setError("Invalid response from server.");
        }
      } catch (err) {
        setError(err.message || "Invalid email or password");
      }
    } else {
      // Handle Signup
      try {
        const userData = await signup(form.name, form.email, form.password, form.role);

        if (userData && userData._id) {
          navigate(`/${userData.role}`); // Redirect based on user role
        } else {
          setError("Invalid response from server.");
        }
      } catch (err) {
        setError(err.message || "Signup failed");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow">
        <h1 className="text-2xl font-bold text-center">{isLogin ? "Login" : "Sign Up"}</h1>
        {error && (
          <div className="p-3 text-red-700 bg-red-100 border border-red-400 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          {!isLogin && (
            <div>
              <label htmlFor="role" className="block mb-1 text-sm font-medium text-gray-700">
                Select Role
              </label>
              <select
                id="role"
                name="role"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                value={form.role}
                onChange={handleChange}
                required
              >
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </select>
            </div>
          )}
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <div className="text-center">
          {isLogin ? (
            <>
              Don't have an account?{" "}
              <button onClick={toggleMode} className="text-blue-600 hover:underline">
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button onClick={toggleMode} className="text-blue-600 hover:underline">
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;

