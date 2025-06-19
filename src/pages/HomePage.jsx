import { useState, useEffect } from "react";
import TableComponent from "../components/TableComponent";

function HomePage() {
  const [users, setUsers] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // ✅ Live clock updater
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // প্রতি ১ সেকেন্ডে আপডেট

    return () => clearInterval(timer); // cleanup
  }, []);

  // ✅ Fetch today's employers
  useEffect(() => {
    fetch("https://dblsorting.onrender.com/employers/today")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => {
        console.error("Failed to fetch users:", error);
      });
  }, []);

  // ✅ Custom formatted date logic
  const getFormattedDate = (dateObj) => {
    const hour = dateObj.getHours();
    const correctedDate = new Date(dateObj);

    if (hour < 6) {
      correctedDate.setDate(correctedDate.getDate() - 1);
    }

    const day = String(correctedDate.getDate()).padStart(2, "0");
    const month = String(correctedDate.getMonth() + 1).padStart(2, "0");
    const year = correctedDate.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Utility function to count roles
  const countByRole = (role) => users.filter((u) => u.role === role).length;

  const totalCount = users.length;
  const sorterCount = countByRole("Sorter");
  const helperCount = countByRole("Helper");
  const operatorCount = countByRole("Operator");
  const totalSH = sorterCount + helperCount;

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="max-w-6xl mx-auto px-4 py-10 pt-30">
        <h1 className="text-3xl font-bold mb-4">Today Live Duty List</h1>

        <div className="flex justify-between text-lg font-medium mb-6">
          <p>🕒 Time: {currentTime.toLocaleTimeString()}</p>
          <p>📅 Date: {getFormattedDate(currentTime)}</p>
        </div>
        <table className="table-auto w-full text-left border border-gray-700 mt-8">
          <thead>
            <tr className="bg-gray-800">
              <th className="px-4 py-2 border border-gray-700">Designation</th>
              <th className="px-4 py-2 border border-gray-700">Attendance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 border border-gray-700">Sorter</td>
              <td className="px-4 py-2 border border-gray-700">
                {sorterCount}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 border border-gray-700">Helper</td>
              <td className="px-4 py-2 border border-gray-700">
                {helperCount}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 border border-gray-700">
                Sorter + Helper
              </td>
              <td className="px-4 py-2 border border-gray-700">{totalSH}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border border-gray-700">Operator</td>
              <td className="px-4 py-2 border border-gray-700">
                {operatorCount}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 border border-gray-700 font-bold">
                Total
              </td>
              <td className="px-4 py-2 border border-gray-700 font-bold">
                {totalCount}
              </td>
            </tr>
          </tbody>
        </table>

        {users.length > 0 ? (
          <TableComponent employees={users} />
        ) : (
          <p className="text-center text-lg font-medium">Loading...</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;
