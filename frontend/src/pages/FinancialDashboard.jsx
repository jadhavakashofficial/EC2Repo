// frontend/src/pages/FinancialDashboard.jsx

import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import Layout from "../components/Layout";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";

const FinancialDashboard = () => {
  const [financialData, setFinancialData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      const response = await axiosInstance.get("/financial/analytics");
      setFinancialData(response.data.data);
    } catch (err) {
      setError("Failed to load financial analytics.");
    }
  };

  // Prepare financial chart data
  const getFinancialChartData = () => {
    if (!financialData) return {};

    return {
      labels: ["Salary Paid", "Fees Collected", "Profit"],
      datasets: [
        {
          label: "Amount ($)",
          data: [financialData.salary, financialData.feesCollected, financialData.profit],
          backgroundColor: ["#ef4444", "#10b981", "#3b82f6"],
        },
      ],
    };
  };

  // Prepare gender ratio pie chart data
  const getGenderChartData = () => {
    if (!financialData) return {};

    return {
      labels: financialData.genderRatio.map(item => item.gender),
      datasets: [
        {
          data: financialData.genderRatio.map(item => item.count),
          backgroundColor: ["#3b82f6", "#ef4444", "#fbbf24"],
        },
      ],
    };
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Financial Analytics</h1>

        {error && (
          <div className="p-4 text-red-700 bg-red-100 border border-red-400 rounded">
            {error}
          </div>
        )}

        {financialData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Salary Paid vs Fees Collected vs Profit Bar Chart */}
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-xl font-semibold mb-4">Salary Paid vs Fees Collected vs Profit</h3>
              <Bar data={getFinancialChartData()} />
            </div>

            {/* Class Analysis Pie Chart */}
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-xl font-semibold mb-4">Class Analysis: Gender Ratio</h3>
              <Pie data={getGenderChartData()} />
            </div>
          </div>
        ) : (
          <div>Loading Financial Analytics...</div>
        )}
      </div>
    </Layout>
  );
};

export default FinancialDashboard;
