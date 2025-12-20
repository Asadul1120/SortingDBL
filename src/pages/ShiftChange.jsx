import { useState, useEffect } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useAuth } from "../AuthContext";

const ShiftChange = () => {
  const [data, setData] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [shift, setShift] = useState("");

  const { auth } = useAuth();

  // 🔹 GET today's shift changes
  const fetchData = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/shiftchange`);
      const json = await res.json();
      setData(json.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 POST shift change
  const handleShiftChange = async () => {
    if (!employeeId || !shift) {
      alert("❌ Please enter ID & select shift");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/shiftchange/add`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            employeeId,
            shift,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      alert("✅ Shift change added successfully!");
      setEmployeeId("");
      setShift("");
      fetchData(); // refresh table
    } catch (error) {
      alert("❌ " + error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/shiftchange/${id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      alert("✅ Shift change deleted successfully!");
      fetchData(); // refresh table
    } catch (error) {
      alert("❌ " + error.message);
    }
  };

  // 🔹 EXCEL DOWNLOAD
  const handleDownloadExcel = async () => {
    try {
      if (data.length === 0) {
        alert("❌ No shift changes found to download.");
        return;
      }

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Shift Changes");

      // Headers
      const headers = ["EmployeeCode", "YearNo", "MonthNo"];
      for (let i = 1; i <= 31; i++) headers.push(`D${i}`);

      // Set initial column widths & alignment
      sheet.columns = headers.map((header) => ({
        header,
        key: header.toLowerCase(),
        width: header === "EmployeeCode" ? 18 : 12, // small width for empty D columns
        style: { alignment: { horizontal: "center", vertical: "middle" } },
      }));

      // Freeze first column
      sheet.views = [
        {
          state: "frozen",
          xSplit: 1,
          ySplit: 0,
          topLeftCell: "B1",
          activeCell: "A1",
        },
      ];

      // Bold header row & increase height
      const headerRow = sheet.getRow(1);
      headerRow.font = { bold: true, size: 12 };
      headerRow.alignment = { horizontal: "center", vertical: "middle" };
      headerRow.height = 20;

      // Today's date
      const today = new Date();
      const todayDay = today.getDate();
      // dd-mm-yyyy
      const formattedDate = `${today.getDate()}-${
        today.getMonth() + 1
      }-${today.getFullYear()}`;

      // Add data rows
      data.forEach((item) => {
        const rowData = {
          employeecode: item.employeeId,
          yearno: today.getFullYear(),
          monthno: today.getMonth() + 1,
        };

        // D1…D31 columns
        for (let day = 1; day <= 31; day++) {
          const dayKey = `d${day}`;
          if (item.shift && typeof item.shift === "object") {
            const shiftDate = Object.keys(item.shift).find((dateStr) => {
              const dateObj = new Date(dateStr);
              return dateObj.getDate() === day;
            });
            rowData[dayKey] = shiftDate ? item.shift[shiftDate] : "";
          } else {
            rowData[dayKey] = day === todayDay ? item.shift || "" : "";
          }
        }

        const newRow = sheet.addRow(rowData);

        // Style EmployeeCode column
        newRow.getCell("employeecode").font = { bold: true, size: 12 };

        // Adjust D1…D31 column widths dynamically
        for (let day = 1; day <= 31; day++) {
          const cell = newRow.getCell(`d${day}`);
          if (cell.value) {
            // If there is data, make column wider
            sheet.getColumn(`d${day}`).width = 12;
          } else {
            // If empty, keep small
            sheet.getColumn(`d${day}`).width = 7;
          }
        }

        // Center align all cells
        newRow.alignment = { horizontal: "center", vertical: "middle" };
      });

      // Generate & download
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/octet-stream" });
      saveAs(blob, `${formattedDate} shift changes.xlsx`);
    } catch (error) {
      console.error("Excel download error:", error);
      alert("❌ Failed to download Excel");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 pt-30">
      <h1 className="text-2xl font-bold text-white mb-6 text-center">
        Sorting Shift Change Update
      </h1>

      {/* ---- Form ---- */}
      {auth.user?.role === "admin" && (
        <div className="bg-gray-800 p-6 rounded-xl max-w-3xl mx-auto mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="Enter ID"
              className="px-4 py-3 rounded-lg bg-gray-700 text-white"
            />

            <select
              value={shift}
              onChange={(e) => setShift(e.target.value)}
              className="px-4 py-3 rounded-lg bg-gray-700 text-white"
            >
              <option value="">Select Shift</option>
              {[
                "Full Day",
                "Full Night",
                "Day",
                "Night",
                "General",
                "Morning+Day",
                "Day+Night",
              ].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <button
              onClick={handleShiftChange}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-3 text-white rounded-lg font-semibold"
            >
              Update
            </button>
          </div>
        </div>
      )}

      {/* ---- Table ---- */}
      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-700 text-white">
              <th className="p-3">S/L</th>
              <th className="p-3">ID</th>
              <th className="p-3">Shift</th>
              <th className="p-3">Date</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="p-4 text-center text-xl text-gray-400"
                >
                  No data found 😔
                </td>
              </tr>
            )}

            {data.map((item, index) => (
              <tr
                key={item._id}
                className="border-b border-gray-700  text-white "
              >
                <td className="p-3 ">{index + 1}</td>
                <td className="p-3">{item.employeeId}</td>
                <td className="p-3">{item.shift}</td>
                <td className="p-3">{item.date}</td>
                <button
                  className="bg-red-600 hover:bg-red-700 px-3 mt-2 py-1 text-white rounded-lg font-semibold"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="bg-blue-600 hover:bg-blue-700 px-3 mt-2 py-1 text-white rounded-lg font-semibold"
          onClick={handleDownloadExcel}
        >
          Download excel
        </button>
      </div>
    </div>
  );
};

export default ShiftChange;
