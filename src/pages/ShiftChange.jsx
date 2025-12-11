const ShiftChange = () => {
  return (
    <div className="min-h-screen bg-gray-900 p-4 pt-30">
      {/* ---- Header ---- */}
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">
        Sorting Shift Change Update
      </h1>

      {/* ---- Form Section ---- */}
      <div className="bg-gray-800 p-4 sm:p-6 rounded-xl shadow-xl max-w-3xl mx-auto mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          {/* Input */}
          <input
            type="text"
            placeholder="Enter ID"
            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 
                       focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          {/* Select */}
          <select
            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white 
                       focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {[
              "Full Day",
              "Full Night",
              "Day",
              "Night",
              "General",
              "Morning+Day",
              "Day+Night",
            ].map((shift) => (
              <option key={shift} value={shift}>
                {shift}
              </option>
            ))}
          </select>

          {/* Button */}
          <button
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg 
                       hover:bg-blue-700 transition-all shadow-md hover:shadow-xl"
          >
            Update
          </button>
        </div>
      </div>

      {/* ---- Table Section ---- */}
      <div className="max-w-3xl mx-auto bg-gray-800 p-4 sm:p-6 rounded-xl shadow-xl overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[400px] rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-700 text-white">
              <th className="p-3 border-b border-gray-600">S/L</th>
              <th className="p-3 border-b border-gray-600">ID</th>
              <th className="p-3 border-b border-gray-600">Shift</th>
              <th className="p-3 border-b border-gray-600">Date</th>
            </tr>
          </thead>

          <tbody className="text-gray-200">
            <tr className="bg-gray-800 hover:bg-gray-700 transition">
              <td className="p-3 border-b border-gray-700">1</td>
              <td className="p-3 border-b border-gray-700">1234</td>
              <td className="p-3 border-b border-gray-700">Day</td>
              <td className="p-3 border-b border-gray-700">11-12-25</td>
            </tr>
            <tr className="bg-gray-900 hover:bg-gray-700 transition">
              <td className="p-3 border-b border-gray-700">2</td>
              <td className="p-3 border-b border-gray-700">5678</td>
              <td className="p-3 border-b border-gray-700">Night</td>
              <td className="p-3 border-b border-gray-700">11-12-25</td>
            </tr>
          </tbody>
        </table>

        {/* ---- Download Button ---- */}
        <button
          className="mt-4  py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg 
                           hover:bg-blue-700 transition-all shadow-md hover:shadow-xl"
        >
          Download XLSX
        </button>
      </div>
    </div>
  );
};

export default ShiftChange;
