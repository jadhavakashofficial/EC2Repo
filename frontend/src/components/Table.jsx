// frontend/src/components/Table.jsx

import React from 'react';

const Table = ({ headers, data, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr>
            {headers.map((header) => (
              <th
                key={header.key}
                className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-700"
              >
                {header.label}
              </th>
            ))}
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td className="px-6 py-4 border-b border-gray-200 text-center" colSpan={headers.length + 1}>
                No data available.
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item._id} className="hover:bg-gray-100">
                {headers.map((header) => (
                  <td key={header.key} className="px-6 py-4 border-b border-gray-200">
                    {item[header.key]}
                  </td>
                ))}
                <td className="px-6 py-4 border-b border-gray-200">
                  <button
                    onClick={() => onEdit(item)}
                    className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(item._id)}
                    className="px-3 py-1 ml-2 text-sm text-white bg-red-600 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
