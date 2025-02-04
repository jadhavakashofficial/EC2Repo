// frontend/src/pages/TeacherDashboard.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import Layout from "../components/Layout";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const TeacherDashboard = () => {
  // Active tab: "classes", "students", or "analysis"
  const [activeTab, setActiveTab] = useState("classes");

  // Data states
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");

  // Modal state for adding a student (Students tab)
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    gender: "Male",
    assignedClass: "",
    feesPaid: "",
    dob: "",
    contactNumber: "",
  });

  // Modal state for editing a class (Classes tab)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [classToEdit, setClassToEdit] = useState({
    _id: "",
    name: "",
    description: "",
    maxStudents: "",
  });

  // Fetch data when activeTab changes
  useEffect(() => {
    if (activeTab === "classes") {
      fetchClasses();
    } else if (activeTab === "students" || activeTab === "analysis") {
      fetchStudents();
    }
  }, [activeTab]);

  // Fetch classes data
  const fetchClasses = async () => {
    try {
      const response = await axiosInstance.get("/classes");
      setClasses(response.data.data);
    } catch (err) {
      setError("Failed to fetch classes.");
    }
  };

  // Fetch students data
  const fetchStudents = async () => {
    try {
      const response = await axiosInstance.get("/students");
      setStudents(response.data.data);
    } catch (err) {
      setError("Failed to fetch students.");
    }
  };

  const getMaxDOB = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 6);
    return today.toISOString().split("T")[0];
  };

  // ----- CLASSES TAB FUNCTIONS -----

  // Open Edit Class Modal
  const openEditModal = (classItem) => {
    setClassToEdit(classItem);
    setIsEditModalOpen(true);
  };

  // Close Edit Class Modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  // Handle input changes for editing class
  const handleEditInputChange = (e) => {
    setClassToEdit({ ...classToEdit, [e.target.name]: e.target.value });
  };

  // Submit edited class data
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/classes/${classToEdit._id}`, classToEdit);
      closeEditModal();
      fetchClasses();
    } catch (err) {
      setError("Failed to update class.");
    }
  };

  // ----- STUDENTS TAB FUNCTIONS -----

  // Open Add Student Modal
  const openAddStudentModal = () => {
    setIsAddStudentModalOpen(true);
    setNewStudent({
      name: "",
      email: "",
      gender: "Male",
      assignedClass: "",
      feesPaid: "",
      dob: "",
    });
  };

  // Close Add Student Modal
  const closeAddStudentModal = () => {
    setIsAddStudentModalOpen(false);
  };

  // Handle input changes for adding student
  const handleStudentInputChange = (e) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
  };

  // Submit new student data
  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/students", newStudent);
      closeAddStudentModal();
      fetchStudents();
    } catch (err) {
      setError("Failed to add student.");
    }
  };

  // Delete a student
  const handleDeleteStudent = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await axiosInstance.delete(`/students/${studentId}`);
        fetchStudents();
      } catch (err) {
        setError("Failed to delete student.");
      }
    }
  };

  // ----- ANALYSIS TAB FUNCTION -----

  // Compute gender ratio for students (for analysis tab)
  const getGenderRatioData = () => {
    const maleCount = students.filter((s) => s.gender === "Male").length;
    const femaleCount = students.filter((s) => s.gender === "Female").length;
    return {
      labels: ["Male", "Female"],
      datasets: [
        {
          label: "Number of Students",
          data: [maleCount, femaleCount],
          backgroundColor: ["#3490dc", "#e3342f"],
        },
      ],
    };
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Teacher Dashboard</h1>
        {error && (
          <div className="p-4 text-red-700 bg-red-100 border border-red-400 rounded">
            {error}
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab("classes")}
            className={`px-4 py-2 font-semibold ${
              activeTab === "classes"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            Classes
          </button>
          <button
            onClick={() => setActiveTab("students")}
            className={`px-4 py-2 font-semibold ${
              activeTab === "students"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            Students
          </button>
          <button
            onClick={() => setActiveTab("analysis")}
            className={`px-4 py-2 font-semibold ${
              activeTab === "analysis"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            Class Analysis
          </button>
        </div>

        {/* CONTENT FOR EACH TAB */}

        {/* --- Classes Tab --- */}
        {activeTab === "classes" && (
          <section>
            <h2 className="text-2xl font-semibold text-gray-700">My Classes</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full bg-white rounded shadow">
                <thead>
                  <tr>
                    <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">Description</th>
                    <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">Max Students</th>
                    {/* <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">Actions</th> */}
                  </tr>
                </thead>
                <tbody>
                  {classes.map((classItem) => (
                    <tr key={classItem._id} className="hover:bg-gray-100">
                      <td className="px-6 py-4 border-b">{classItem.name}</td>
                      <td className="px-6 py-4 border-b">{classItem.description}</td>
                      <td className="px-6 py-4 border-b">{classItem.maxStudents}</td>
                      {/* <td className="px-6 py-4 border-b">
                        <button
                          onClick={() => openEditModal(classItem)}
                          className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                        >
                          Edit
                        </button>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Edit Class Modal */}
            {isEditModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                  <h2 className="text-xl font-bold mb-4">Edit Class</h2>
                  <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={classToEdit.name || ""}
                        onChange={handleEditInputChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <input
                        type="text"
                        name="description"
                        value={classToEdit.description || ""}
                        onChange={handleEditInputChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Max Students</label>
                      <input
                        type="number"
                        name="maxStudents"
                        value={classToEdit.maxStudents || ""}
                        onChange={handleEditInputChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                      />
                    </div>
                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={closeEditModal}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </section>
        )}

        {/* --- Students Tab --- */}
        {activeTab === "students" && (
          <section>
            <h2 className="text-2xl font-semibold text-gray-700">My Students</h2>
            <div className="flex justify-end">
              <button
                onClick={openAddStudentModal}
                className="px-4 py-2 mb-4 font-semibold text-white bg-green-600 rounded hover:bg-green-700"
              >
                Add Student
              </button>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full bg-white rounded shadow">
                <thead>
                  <tr>
                    <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">Gender</th>
                    {/* <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">Fees Paid</th> */}
                    <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">DOB</th>
                    <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id} className="hover:bg-gray-100">
                      <td className="px-6 py-4 border-b">{student.name}</td>
                      <td className="px-6 py-4 border-b">{student.email}</td>
                      <td className="px-6 py-4 border-b">{student.gender}</td>
                      {/* <td className="px-6 py-4 border-b">{student.feesPaid}</td> */}
                      <td className="px-6 py-4 border-b">{new Date(student.dob).toLocaleDateString()}</td>
                      <td className="px-6 py-4 border-b">
                        <button
                          onClick={() => handleDeleteStudent(student._id)}
                          className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Student Modal */}
            {isAddStudentModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                  <h2 className="text-xl font-bold mb-4">Add Student</h2>
                  <form onSubmit={handleStudentSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={newStudent.name}
                        onChange={handleStudentInputChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={newStudent.email}
                        onChange={handleStudentInputChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Gender</label>
                      <select
                        name="gender"
                        value={newStudent.gender}
                        onChange={handleStudentInputChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Assigned Class</label>
                      <select
                        name="assignedClass"
                        value={newStudent.assignedClass}
                        onChange={handleStudentInputChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                      >
                        <option value="">Select Class</option>
                        {classes.map((cls) => (
                          <option key={cls._id} value={cls.name}>
                            {cls.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Fees Paid</label>
                      <input
                        type="number"
                        name="feesPaid"
                        value={newStudent.feesPaid}
                        onChange={handleStudentInputChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                      <input
                        type="date"
                        name="dob"
                        value={newStudent.dob}
                        onChange={handleStudentInputChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                        max={getMaxDOB()}
                      />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Contact Number
                    </label>
                    <input
                      type="text"
                      // id="contactNumber"
                      name="contactNumber"
                      className="w-full px-3 py-2 border rounded"
                      value={newStudent.contactNumber}
                      onChange={handleStudentInputChange}
                      required
                    />
                  </div>
                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={closeAddStudentModal}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </section>
        )}

        {/* --- Analysis Tab --- */}
        {activeTab === "analysis" && (
          <section>
            <h2 className="text-2xl font-semibold text-gray-700">Class Analysis</h2>
            <div className="bg-white p-4 rounded shadow">
              <Bar data={getGenderRatioData()} />
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default TeacherDashboard;
