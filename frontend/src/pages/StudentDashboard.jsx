// frontend/src/pages/StudentDashboard.jsx

import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import Layout from "../components/Layout";

const StudentDashboard = () => {
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState("");

  // const StudentDashboard = () => {
  //   return (
  //     <Layout>
  //       <div>
  //         {/* <h1 className="text-3xl font-bold text-gray-800">Student Dashboard</h1> */}
  //         <p className="mt-4 text-gray-600">Welcome to the Student Dashboard.</p>
  //       </div>
  //     </Layout>
  //   );
  // };
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axiosInstance.get("/classes");
      setClasses(response.data.data);
    } catch (err) {
      setError("Failed to fetch your classes.");
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Student Dashboard</h1>

        {error && (
          <div className="p-4 text-red-700 bg-red-100 border border-red-400 rounded">
            {error}
          </div>
        )}

        {/* Enrolled Classes Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-700">My Classes</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-700">Class Name</th>
                  {/* <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-700">Teacher Name</th> */}
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-700">Class Description</th>
                  {/* <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-700">Actions</th> */}
                </tr>
              </thead>
              <tbody>
                {classes.map((classItem) => (
                  <tr key={classItem._id} className="hover:bg-gray-100">
                    <td className="px-6 py-4 border-b border-gray-200">{classItem.name}</td>
                    {/* <td className="px-6 py-4 border-b border-gray-200">{classItem.teacher.name}</td> */}
                    <td className="px-6 py-4 border-b border-gray-200">{classItem.description}</td>
                    {/* <td className="px-6 py-4 border-b border-gray-200">
                      <button className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700">
                        View Details
                      </button>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default StudentDashboard;
