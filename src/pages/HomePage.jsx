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
      .then((res) => {
        console.log("Response status:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("Fetched data:", data);
        setUsers(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("API fetch error:", err);
        setUsers([]);
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

    const wb = XLSX.utils.book_new();

    const wsData = [
      [],
      [],
      [],
      ["", "", "", "", "", "", "      DBL CERAMICS LTD", ""],
      ["", "", "", "", "", "", "   A Concern Of DBL Group  "],
      ["", "", "", "", "", "", " Dhanua (Nayanpur),Sreepur,Gazipur"],
      ["", "", "", "", "", "", "Pre-Approval For Over Time (O.T)"],
      [],
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
        "Date :",
        getFormattedDate(currentTime),
      ],
      [
        "",
        "",
        "Department : ",
        "",
        "",
        "",
        "",
        "",
        "",
        "Section :- Sorting & packing",
      ],
      [
        "S.L No  ",
        " Name",
        "ID-No ",
        "Designation",
        " Date Of OT",
        "Roster Duty",
        "",
        "  Requisted OT Hours ",
        "",
        "",
        "Reason for requested OT",
      ],
      [
        "",
        "",
        "",
        "",
        "",
        " Shift ",
        " Duty Hours ",
        "   From  ",
        " To  ",
        " Total Hrs ",
      ],
    ];

    // Add employee data rows
    users.forEach((user, index) => {
      wsData.push([
        index + 1,
        user.name,
        user.ID,
        user.designation || "",
        getFormattedDate(currentTime),
        user.shift || "",
        "",
        "",
        "",
        user.OT || "",
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
        "",
        "",
        "",
        "",
        "",
        user.shift || "",
        "",
        "",
        "",
        "",
      ]);
    });

    // Add 20 blank rows at the end
    for (let i = 0; i < 20; i++) wsData.push([]);

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // ✅ Set column widths
    ws["!cols"] = [
      { wch: 8 }, // S.L No
      { wch: 15 }, // Name
      { wch: 15 }, // ID-No
      { wch: 15 }, // Designation
      { wch: 15 }, // Date Of OT
      { wch: 12 }, // Shift
      { wch: 15 }, // Duty Hours
      { wch: 10 }, // From
      { wch: 10 }, // To
      { wch: 12 }, // Total Hrs
      { wch: 30 }, // Reason
    ];

    // ✅ Set row heights (especially for header rows 11 & 12 → index 11 & 12)
    const totalRows = wsData.length;
    ws["!rows"] = Array(totalRows).fill({ hpt: 20 }); // default height

    ws["!rows"][8] = { hpt: 30 };
    ws["!rows"][9] = { hpt: 30 }; // header row 1
    ws["!rows"][10] = { hpt: 30 }; // header row 2

    // ✅ Apply styles (center align & bold header)
    const range = XLSX.utils.decode_range(ws["!ref"]);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = ws[cellRef];
        if (cell && cell.v !== undefined) {
          if (!cell.s) cell.s = {};
          cell.s.alignment = {
            vertical: "center",
            horizontal: "center",
            wrapText: true,
          };
          if (R === 13 || R === 14) {
            cell.s.font = { bold: true };
          }
        }
      }
    }

    // ✅ Add worksheet to workbook and export
    XLSX.utils.book_append_sheet(wb, ws, "OT-Sorting Packing");

    XLSX.writeFile(
      wb,
      `OT_sorting_packing_${getFormattedDate(currentTime).replace(
        /-/g,
        "."
      )}.xlsx`
    );
  };

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
          <p className="text-center text-lg font-medium mt-6">
            No data , please add data or refresh
          </p>
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
