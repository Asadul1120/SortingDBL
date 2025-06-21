import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import TableComponent from "../components/TableComponent";

function HomePage() {
  const [users, setUsers] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // ⏰ Live Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 📦 Fetch today's employers
  useEffect(() => {
    fetch("https://dblsorting.onrender.com/employers/today")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => {
        console.error("Failed to fetch users:", error);
      });
  }, []);

  // 📅 Custom formatted date
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

  const handleDownload = () => {
    if (users.length === 0) {
      alert("No data to download.");
      return;
    }

    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Create the worksheet data structure based on your template
    const wsData = [
      [], // Empty row
      [], // Empty row
      [], // Empty row
      ["", "", "", "", "", "", "DBL CERAMICS LTD", ""], // Company name
      ["", "", "", "", "", "", "A Concern Of DBL Group"],
      ["", "", "", "", "", "", "Dhanua (Nayanpur),Sreepur,Gazipur"],
      ["", "", "", "", "", "", "Pre-Approval For Over Time (O.T)"],
      [], // Empty row
      [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "Date :",
        getFormattedDate(currentTime),
      ],
      [
        "",
        "",
        "Department :",
        "",
        "",
        "",
        "",
        "",
        "Section :- Sorting & packing",
      ],
      [
        "S.L No",
        "Name",
        "ID-No",
        "Designation",
        "Date Of OT",

        "Roster Duty",
        "",
        "Requisted OT Hours",
        "",
        "",
        "Reason for requested OT",
      ],
      ["", "", "", "", "", "Shift", "Duty Hours", "From", "To", "Total Hrs"],
    ];

    // Add employee data rows
    users.forEach((user, index) => {
      wsData.push([
        index + 1, // S.L No
        user.name, // Name
        user.id, // ID-No
        user.designation || "", // Designation
        "", // Date Of OT
        user.shift || "", // Roster Duty - Shift
        "", // Duty Hours (empty as it's formula-based in template)
        "", // From (empty as it's formula-based in template)
        "", // To (empty as it's formula-based in template)
        user.OT || "", // Total Hrs (empty as it's formula-based in template)
        "", // Empty for Reason
        "", // Empty
        "", // Empty
        "", // Empty
        "", // Empty
        "", // Empty
        "", // Empty
        "", // Empty
        "", // Empty
        "", // Empty
        "", // Empty
        "", // Empty
        "", // Empty
        "", // Empty
        "", // Empty
        "", // Empty
        "", // Empty
        "", // Empty
        user.shift || "", // Shift reference (column AD)
        "", // From time (column AE)
        "", // To time (column AF)
        "", // Total hours (column AG)
        "", // Empty (column AH)
      ]);
    });

    // Add empty rows at the end
    for (let i = 0; i < 20; i++) {
      wsData.push([]);
    }

    // Create worksheet from the data
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "OT-Sorting Packing");

    // Generate the Excel file
    XLSX.writeFile(
      wb,
      `OT_sorting_packing_${getFormattedDate(currentTime).replace(
        /-/g,
        "."
      )}.xlsx`
    );
  };

  // 📊 Count logic
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

        <div className="overflow-x-auto">
          <table className="table-auto w-full text-left border border-gray-700 mt-8">
            <thead>
              <tr className="bg-gray-800">
                <th className="px-4 py-2 border border-gray-700">
                  Designation
                </th>
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
        </div>

        {users.length > 0 ? (
          <TableComponent employees={users} />
        ) : (
          <p className="text-center text-lg font-medium mt-6">Loading...</p>
        )}

        <button
          onClick={handleDownload}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6"
        >
          Download xlsx
        </button>
      </div>
    </div>
  );
}

export default HomePage;
