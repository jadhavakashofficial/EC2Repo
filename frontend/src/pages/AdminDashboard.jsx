// frontend/src/pages/AdminDashboard.jsx

import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import Table from "../components/Table";
import { Bar, Pie, Doughnut } from "react-chartjs-2";
import "chart.js/auto";

const AdminDashboard = () => {
  // Active tab: "teachers", "students", "classes", "financial", "analysis"
  const [activeTab, setActiveTab] = useState("teachers");
  // Financial period: "monthly" or "yearly"
  const [financialPeriod, setFinancialPeriod] = useState("monthly");

  // Data states
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [financialData, setFinancialData] = useState(null);

  // Modal and Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [currentItem, setCurrentItem] = useState(null); // For Edit
  const [formData, setFormData] = useState({});

  // Error state
  const [error, setError] = useState("");

  // --- Pagination, Filtering & Sorting States for Teachers, Students, Classes ---
  const [teacherSearch, setTeacherSearch] = useState("");
  const [teacherSortField, setTeacherSortField] = useState("name");
  const [teacherSortOrder, setTeacherSortOrder] = useState("asc");
  const [teacherCurrentPage, setTeacherCurrentPage] = useState(1);
  const teacherPageSize = 5;

  const [studentSearch, setStudentSearch] = useState("");
  const [studentSortField, setStudentSortField] = useState("name");
  const [studentSortOrder, setStudentSortOrder] = useState("asc");
  const [studentCurrentPage, setStudentCurrentPage] = useState(1);
  const studentPageSize = 5;

  const [classSearch, setClassSearch] = useState("");
  const [classSortField, setClassSortField] = useState("name");
  const [classSortOrder, setClassSortOrder] = useState("asc");
  const [classCurrentPage, setClassCurrentPage] = useState(1);
  const classPageSize = 5;

  // Fetch data when activeTab or financialPeriod changes
  useEffect(() => {
    if (activeTab === "teachers") {
      fetchTeachers();
    } else if (activeTab === "students" || activeTab === "analysis") {
      fetchStudents();
    } else if (activeTab === "classes") {
      fetchClasses();
    } else if (activeTab === "financial") {
      fetchFinancialData();
    }
  }, [activeTab, financialPeriod]);

  // --- Data Fetching Functions ---
  const fetchTeachers = async () => {
    try {
      const response = await axiosInstance.get("/teachers");
      setTeachers(response.data.data);
    } catch (err) {
      setError("Failed to fetch teachers.");
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axiosInstance.get("/students");
      // Map contactNumber as needed (if stored under profile, adjust accordingly)
      const mappedStudents = response.data.data.map((student) => ({
        ...student,
        contactNumber: student.contactNumber,
      }));
      setStudents(mappedStudents);
    } catch (err) {
      setError("Failed to fetch students.");
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axiosInstance.get("/classes");
      setClasses(response.data.data);
    } catch (err) {
      setError("Failed to fetch classes.");
    }
  };

  const fetchFinancialData = async () => {
    try {
      // Pass the financial period as a query parameter
      const response = await axiosInstance.get(`/financial/analytics?period=${financialPeriod}`);
      setFinancialData(response.data.data);
    } catch (err) {
      setError("Failed to load financial analytics.");
    }
  };

  // --- Modal Handling ---
  const openModal = (type, item = null) => {
    setError("");
    setCurrentItem(item);
    if (type === "add") {
      setModalTitle(`Add New ${capitalize(activeTab.slice(0, -1))}`);
      setFormData(getInitialFormData(activeTab, null));
    } else if (type === "edit") {
      setModalTitle(`Edit ${capitalize(activeTab.slice(0, -1))}`);
      setFormData(getInitialFormData(activeTab, item));
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
    setFormData({});
  };

  // --- Form Handling ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let val = value;
    if (type === "checkbox") {
      val = checked ? 1 : 0;
    }
    setFormData({ ...formData, [name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (activeTab === "financial" || activeTab === "analysis") {
        return;
      }
      if (currentItem) {
        await axiosInstance.put(`/${activeTab}/${currentItem._id}`, formData);
      } else {
        await axiosInstance.post(`/${activeTab}`, formData);
      }
      fetchDataAfterChange();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axiosInstance.delete(`/${activeTab}/${id}`);
        fetchDataAfterChange();
      } catch (err) {
        setError(err.response?.data?.message || "Delete failed.");
      }
    }
  };

  const fetchDataAfterChange = () => {
    if (activeTab === "teachers") {
      fetchTeachers();
    } else if (activeTab === "students") {
      fetchStudents();
    } else if (activeTab === "classes") {
      fetchClasses();
    } else if (activeTab === "financial") {
      fetchFinancialData();
    } else if (activeTab === "analysis") {
      fetchStudents();
    }
  };

  // --- Utility Functions ---
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  // Helper to format DOB in "DD/MM/YYYY" format.
  const formatDOB = (dobString) => {
    if (!dobString) return "No";
    const dateObj = new Date(dobString);
    if (isNaN(dateObj.getTime())) return "No";
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // getInitialFormData: Set initial values based on tab and item.
  const getInitialFormData = (tab, item) => {
    if (tab === "teachers") {
      return item
        ? { name: item.name, email: item.email, salary: item.salary }
        : { name: "", email: "", salary: "", role: "teacher" };
    } else if (tab === "students") {
      return item
        ? {
            name: item.name,
            email: item.email,
            gender: item.gender,
            feesPaid: item.feesPaid,
            // Use formatDOB to convert dob to "DD/MM/YYYY". If no dob, display "No"
            dob: item.dob ? formatDOB(item.dob) : "No",
            contactNumber: item.contactNumber ? item.contactNumber : "No",
          }
        : { name: "", email: "", gender: "", feesPaid: 0, dob: "No", contactNumber: "No" };
    } else if (tab === "classes") {
      return item
        ? { name: item.name, description: item.description,  maxStudents: item.maxStudents, fee: item.fee }
        : { name: "", description: "", teacherId: "", maxStudents: "", fee: "" };
    }
  };

  // Define table headers based on activeTab
  const getTableHeaders = () => {
    if (activeTab === "teachers") {
      return [
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "salary", label: "Salary (₹)" },
      ];
    } else if (activeTab === "students") {
      return [
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "contactNumber", label: "Contact Number" },
        { key: "gender", label: "Gender" },
        { key: "feesPaid", label: "Fees Paid (₹)" },
        // { key: "dob", label: "DOB" },
      ];
    } else if (activeTab === "classes") {
      return [
        { key: "name", label: "Class Name" },
        // { key: "teacherName", label: "Teacher" },
        { key: "maxStudents", label: "Max Students" },
        { key: "fee", label: "Fee (₹)" },
      ];
    }
    return [];
  };

  // Prepare data for Classes table (including teacher name)
  const getClassesData = () => {
    return classes.map((cls) => ({
      ...cls,
      teacherName: cls.teacher.name,
    }));
  };

  // Prepare data for Students table, using formatDOB for proper display.
  const getStudentsData = () => {
    return students.map((student) => ({
      ...student,
      feesPaid: student.feesPaid > 0 ? student.feesPaid : "No",
      dob: student.dob ? formatDOB(student.dob) : "No",
    }));
  };

  // Prepare data for Financial Analytics using Doughnut chart
  const getFinancialDoughnutData = () => {
    if (!financialData) return {};
    return {
      labels: ["Salary Paid", "Fees Collected", "Profit"],
      datasets: [
        {
          data: [financialData.salary, financialData.feesCollected, financialData.profit],
          backgroundColor: ["#f87171", "#34d399", "#60a5fa"],
        },
      ],
    };
  };

  // Helper for Class Analysis: compute gender ratio from students
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

  // Helper: maximum allowed DOB (for minimum age 6)
  const getMaxDOB = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 6);
    return today.toISOString().split("T")[0];
  };

  // --- Pagination, Filtering & Sorting for Teachers ---
  const filteredTeachers = teachers.filter((t) =>
    t.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
    t.email.toLowerCase().includes(teacherSearch.toLowerCase())
  );
  const sortedTeachers = [...filteredTeachers].sort((a, b) => {
    let fieldA = a[teacherSortField];
    let fieldB = b[teacherSortField];
    if (typeof fieldA === "string") {
      fieldA = fieldA.toLowerCase();
      fieldB = fieldB.toLowerCase();
    }
    if (fieldA < fieldB) return teacherSortOrder === "asc" ? -1 : 1;
    if (fieldA > fieldB) return teacherSortOrder === "asc" ? 1 : -1;
    return 0;
  });
  const teacherTotalPages = Math.ceil(sortedTeachers.length / teacherPageSize);
  const paginatedTeachers = sortedTeachers.slice(
    (teacherCurrentPage - 1) * teacherPageSize,
    teacherCurrentPage * teacherPageSize
  );

  // --- Pagination, Filtering & Sorting for Students ---
  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.email.toLowerCase().includes(studentSearch.toLowerCase())
  );
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    let fieldA = a[studentSortField];
    let fieldB = b[studentSortField];
    if (typeof fieldA === "string") {
      fieldA = fieldA.toLowerCase();
      fieldB = fieldB.toLowerCase();
    }
    if (fieldA < fieldB) return studentSortOrder === "asc" ? -1 : 1;
    if (fieldA > fieldB) return studentSortOrder === "asc" ? 1 : -1;
    return 0;
  });
  const studentTotalPages = Math.ceil(sortedStudents.length / studentPageSize);
  const paginatedStudents = sortedStudents.slice(
    (studentCurrentPage - 1) * studentPageSize,
    studentCurrentPage * studentPageSize
  );

  // --- Pagination, Filtering & Sorting for Classes ---
  const filteredClasses = classes.filter((c) =>
    c.name.toLowerCase().includes(classSearch.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(classSearch.toLowerCase()))
  );
  const sortedClasses = [...filteredClasses].sort((a, b) => {
    let fieldA = a[classSortField];
    let fieldB = b[classSortField];
    if (typeof fieldA === "string") {
      fieldA = fieldA.toLowerCase();
      fieldB = fieldB.toLowerCase();
    }
    if (fieldA < fieldB) return classSortOrder === "asc" ? -1 : 1;
    if (fieldA > fieldB) return classSortOrder === "asc" ? 1 : -1;
    return 0;
  });
  const classTotalPages = Math.ceil(sortedClasses.length / classPageSize);
  const paginatedClasses = sortedClasses.slice(
    (classCurrentPage - 1) * classPageSize,
    classCurrentPage * classPageSize
  );

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>

        {error && (
          <div className="p-4 text-red-700 bg-red-100 border border-red-400 rounded">
            {error}
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 font-semibold ${
              activeTab === "teachers"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab("teachers")}
          >
            Teachers
          </button>
          <button
            className={`px-4 py-2 font-semibold ${
              activeTab === "students"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab("students")}
          >
            Students
          </button>
          <button
            className={`px-4 py-2 font-semibold ${
              activeTab === "classes"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab("classes")}
          >
            Classes
          </button>
          <button
            className={`px-4 py-2 font-semibold ${
              activeTab === "financial"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab("financial")}
          >
            Financial Analytics
          </button>
          <button
            className={`px-4 py-2 font-semibold ${
              activeTab === "analysis"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab("analysis")}
          >
            Class Analysis
          </button>
        </div>

        {/* Add Button (not shown for Financial or Analysis tabs) */}
        {(activeTab !== "financial" && activeTab !== "analysis") && (
          <div className="flex justify-end">
            <button
              onClick={() => openModal("add")}
              className="px-4 py-2 mb-4 font-semibold text-white bg-green-600 rounded hover:bg-green-700"
            >
              Add {capitalize(activeTab.slice(0, -1))}
            </button>
          </div>
        )}

        {/* Content Section */}
        {activeTab === "teachers" && (
          <section>
            {/* Filtering & Sorting for Teachers */}
            <div className="flex justify-between items-center mb-4">
              <input
                type="text"
                placeholder="Search Teachers..."
                value={teacherSearch}
                onChange={(e) => { setTeacherSearch(e.target.value); setTeacherCurrentPage(1); }}
                className="px-3 py-2 border rounded"
              />
              <div className="flex items-center space-x-2">
                <select
                  value={teacherSortField}
                  onChange={(e) => setTeacherSortField(e.target.value)}
                  className="px-3 py-2 border rounded"
                >
                  <option value="name">Name</option>
                  <option value="email">Email</option>
                  <option value="salary">Salary</option>
                </select>
                <select
                  value={teacherSortOrder}
                  onChange={(e) => setTeacherSortOrder(e.target.value)}
                  className="px-3 py-2 border rounded"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
            <Table
              headers={getTableHeaders()}
              data={paginatedTeachers}
              onEdit={(item) => openModal("edit", item)}
              onDelete={(id) => handleDelete(id)}
            />
            {sortedTeachers.length > teacherPageSize && (
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  disabled={teacherCurrentPage === 1}
                  onClick={() => setTeacherCurrentPage(teacherCurrentPage - 1)}
                  className="px-3 py-1 border rounded"
                >
                  Prev
                </button>
                <span>
                  Page {teacherCurrentPage} of{" "}
                  {Math.ceil(sortedTeachers.length / teacherPageSize)}
                </span>
                <button
                  disabled={teacherCurrentPage >= Math.ceil(sortedTeachers.length / teacherPageSize)}
                  onClick={() => setTeacherCurrentPage(teacherCurrentPage + 1)}
                  className="px-3 py-1 border rounded"
                >
                  Next
                </button>
              </div>
            )}
          </section>
        )}

        {activeTab === "students" && (
          <section>
            {/* Filtering & Sorting for Students */}
            <div className="flex justify-between items-center mb-4">
              <input
                type="text"
                placeholder="Search Students..."
                value={studentSearch}
                onChange={(e) => { setStudentSearch(e.target.value); setStudentCurrentPage(1); }}
                className="px-3 py-2 border rounded"
              />
              <div className="flex items-center space-x-2">
                <select
                  value={studentSortField}
                  onChange={(e) => setStudentSortField(e.target.value)}
                  className="px-3 py-2 border rounded"
                >
                  <option value="name">Name</option>
                  <option value="email">Email</option>
                </select>
                <select
                  value={studentSortOrder}
                  onChange={(e) => setStudentSortOrder(e.target.value)}
                  className="px-3 py-2 border rounded"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
            <Table
              headers={getTableHeaders()}
              data={paginatedStudents}
              onEdit={(item) => openModal("edit", item)}
              onDelete={(id) => handleDelete(id)}
            />
            {sortedStudents.length > studentPageSize && (
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  disabled={studentCurrentPage === 1}
                  onClick={() => setStudentCurrentPage(studentCurrentPage - 1)}
                  className="px-3 py-1 border rounded"
                >
                  Prev
                </button>
                <span>
                  Page {studentCurrentPage} of{" "}
                  {Math.ceil(sortedStudents.length / studentPageSize)}
                </span>
                <button
                  disabled={studentCurrentPage >= Math.ceil(sortedStudents.length / studentPageSize)}
                  onClick={() => setStudentCurrentPage(studentCurrentPage + 1)}
                  className="px-3 py-1 border rounded"
                >
                  Next
                </button>
              </div>
            )}
          </section>
        )}

        {activeTab === "classes" && (
          <section>
            {/* Filtering & Sorting for Classes */}
            <div className="flex justify-between items-center mb-4">
              <input
                type="text"
                placeholder="Search Classes..."
                value={classSearch}
                onChange={(e) => { setClassSearch(e.target.value); setClassCurrentPage(1); }}
                className="px-3 py-2 border rounded"
              />
              <div className="flex items-center space-x-2">
                <select
                  value={classSortField}
                  onChange={(e) => setClassSortField(e.target.value)}
                  className="px-3 py-2 border rounded"
                >
                  <option value="name">Name</option>
                  <option value="description">Description</option>
                </select>
                <select
                  value={classSortOrder}
                  onChange={(e) => setClassSortOrder(e.target.value)}
                  className="px-3 py-2 border rounded"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
            <Table
              headers={getTableHeaders()}
              data={paginatedClasses}
              onEdit={(item) => openModal("edit", item)}
              onDelete={(id) => handleDelete(id)}// delete for classes
            />
            {sortedClasses.length > classPageSize && (
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  disabled={classCurrentPage === 1}
                  onClick={() => setClassCurrentPage(classCurrentPage - 1)}
                  className="px-3 py-1 border rounded"
                >
                  Prev
                </button>
                <span>
                  Page {classCurrentPage} of{" "}
                  {Math.ceil(sortedClasses.length / classPageSize)}
                </span>
                <button
                  disabled={classCurrentPage >= Math.ceil(sortedClasses.length / classPageSize)}
                  onClick={() => setClassCurrentPage(classCurrentPage + 1)}
                  className="px-3 py-1 border rounded"
                >
                  Next
                </button>
              </div>
            )}
          </section>
        )}

        {activeTab === "financial" && (
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-700">Financial Analytics</h2>
            <div className="flex items-center space-x-4">
              <label className="font-medium text-gray-700">Period:</label>
              <select
                value={financialPeriod}
                onChange={(e) => setFinancialPeriod(e.target.value)}
                className="px-3 py-2 border rounded"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            {financialData ? (
              <div
                className="bg-white p-9 rounded shadow flex justify-center items-center mx-auto"
                style={{ width: "500px", height: "500px" }}
              >
                <h3 className="sr-only">Financial Summary</h3>
                <Doughnut
                  data={getFinancialDoughnutData()}
                  options={{ maintainAspectRatio: false }}
                  height={300}
                  width={300}
                />
              </div>
            ) : (
              <div>Loading Financial Analytics...</div>
            )}
          </section>
        )}

        {activeTab === "analysis" && (
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-700">Class Analysis: Gender Ratio</h2>
            {students.length > 0 ? (
              <div className="bg-white p-4 rounded shadow">
                <Bar data={getGenderRatioData()} />
              </div>
            ) : (
              <div>Loading Class Analysis...</div>
            )}
          </section>
        )}

        {/* Modal for Add/Edit (for Teachers, Students, and Classes) */}
        {(activeTab !== "financial" && activeTab !== "analysis") && (
          <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle}>
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === "teachers" && (
                <>
                  <div>
                    <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                      value={formData.name || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                      value={formData.email || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="salary" className="block mb-1 text-sm font-medium text-gray-700">
                      Salary (₹)
                    </label>
                    <input
                      type="number"
                      id="salary"
                      name="salary"
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                      value={formData.salary || ""}
                      onChange={handleChange}
                      required
                      min="0"
                    />
                  </div>
                </>
              )}

              {activeTab === "students" && (
                <>
                  <div>
                    <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                      value={formData.name || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                      value={formData.email || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="gender" className="block mb-1 text-sm font-medium text-gray-700">
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                      value={formData.gender || ""}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="feesPaid" className="block mb-1 text-sm font-medium text-gray-700">
                      Fees Paid (₹)
                    </label>
                    <input
                      type="number"
                      id="feesPaid"
                      name="feesPaid"
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                      value={formData.feesPaid || 0}
                      onChange={handleChange}
                      required
                      min="0"
                    />
                  </div>
                  <div>
                    <label htmlFor="dob" className="block mb-1 text-sm font-medium text-gray-700">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      id="dob"
                      name="dob"
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                      value={formData.dob || ""}
                      onChange={handleChange}
                      required
                      max={getMaxDOB()}  // Enforce minimum age of 6 years
                    />
                  </div>
                  <div>
                    <label htmlFor="contactNumber" className="block mb-1 text-sm font-medium text-gray-700">
                      Contact Number
                    </label>
                    <input
                      type="text"
                      id="contactNumber"
                      name="contactNumber"
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                      value={formData.contactNumber || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </>
              )}

              {activeTab === "classes" && (
                <>
                  <div>
                    <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                      value={formData.name || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="block mb-1 text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                      value={formData.description || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="teacherId" className="block mb-1 text-sm font-medium text-gray-700">
                      Teacher
                    </label>
                    <select
                      id="teacherId"
                      name="teacherId"
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                      value={formData.teacherId || ""}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a Teacher</option>
                      {teachers.map((teacher) => (
                        <option key={teacher._id} value={teacher._id}>
                          {teacher.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="maxStudents" className="block mb-1 text-sm font-medium text-gray-700">
                      Max Students
                    </label>
                    <input
                      type="number"
                      id="maxStudents"
                      name="maxStudents"
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                      value={formData.maxStudents || ""}
                      onChange={handleChange}
                      required
                      min="1"
                    />
                  </div>
                  <div>
                    <label htmlFor="fee" className="block mb-1 text-sm font-medium text-gray-700">
                      Fee (₹)
                    </label>
                    <input
                      type="number"
                      id="fee"
                      name="fee"
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                      value={formData.fee || ""}
                      onChange={handleChange}
                      required
                      min="0"
                    />
                  </div>
                </>
              )}

              {error && (
                <div className="p-3 text-red-700 bg-red-100 border border-red-400 rounded">
                  {error}
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                  {currentItem ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboard;
