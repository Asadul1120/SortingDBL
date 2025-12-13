import { useState, useEffect } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import TableComponent from "../components/TableComponent";
import logo from "../assets/DblLogo.png";
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
    fetch(`${import.meta.env.VITE_BASE_URL}/today`)
      .then((res) => {
        console.log("Response status:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("Fetched data:", data);
        setUsers(Array.isArray(data.data) ? data.data : []);
      })
      .catch((err) => {
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

  const userFilter = users.filter((user) => user.OT > 0);
  console.log(userFilter);

  //  const handleDownload = async () => {
  //   if (userFilter.length === 0) {
  //     alert("No data to download");
  //     return;
  //   }

  //   const wb = new ExcelJS.Workbook();
  //   const ws = wb.addWorksheet("OT-Sorting Packing");

  //   const TOTAL_COL = 11;

  //   // ================= EMPTY ROWS =================
  //   ws.addRow([]);
  //   ws.addRow([]);
  //   ws.addRow([]);

  //   // ================= COMPANY HEADER =================
  //   const companyRows = [
  //     "DBL CERAMICS LTD",
  //     "A Concern Of DBL Group",
  //     "Dhanua (Nayanpur), Sreepur, Gazipur",
  //     "Pre-Approval For Over Time (O.T)",
  //   ];

  //   companyRows.forEach((text, i) => {
  //     const row = ws.addRow([text]);
  //     ws.mergeCells(row.number, 1, row.number, TOTAL_COL);
  //     row.height = i === 0 ? 40 : 28;
  //     row.font = {
  //       name: "Century Gothic",
  //       size: i === 0 ? 26 : 16,
  //       bold: true,
  //       color: { argb: "FF000000" },
  //     };
  //     row.alignment = { vertical: "middle", horizontal: "center" };
  //   });

  //   ws.addRow([]);

  //   // ================= INFO ROW =================
  //   const infoRow = ws.addRow([
  //     "Department :",
  //     "",
  //     "",
  //     "",
  //     "",
  //     "",
  //     "",
  //     "Section :- Sorting & packing",
  //     "",
  //     "",
  //     `Date : ${getFormattedDate(currentTime)}`,
  //   ]);

  //   ws.mergeCells(`A${infoRow.number}:B${infoRow.number}`);
  //   ws.mergeCells(`H${infoRow.number}:J${infoRow.number}`);

  //   infoRow.height = 30;
  //   infoRow.eachCell((cell) => {
  //     if (cell.value) {
  //       cell.font = { bold: true, size: 14, color: { argb: "FF000000" } };
  //       cell.alignment = { vertical: "middle", horizontal: "center" };
  //     }
  //   });

  //   // ================= TABLE HEADER =================
  //   const header1 = ws.addRow([
  //     "S.L No",
  //     "Name",
  //     "ID-No",
  //     "Designation",
  //     "Date Of OT",
  //     "Roster Duty",
  //     "",
  //     "Requested OT Hours",
  //     "",
  //     "",
  //     "Reason for requested OT",
  //   ]);

  //   const header2 = ws.addRow([
  //     "",
  //     "",
  //     "",
  //     "",
  //     "",
  //     "Shift",
  //     "Duty Hours",
  //     "From",
  //     "To",
  //     "Total Hrs",
  //     "",
  //   ]);

  //   ws.mergeCells(`F${header1.number}:G${header1.number}`);
  //   ws.mergeCells(`H${header1.number}:J${header1.number}`);

  //   ws.mergeCells(`A${header1.number}:A${header2.number}`);
  //   ws.mergeCells(`B${header1.number}:B${header2.number}`);
  //   ws.mergeCells(`C${header1.number}:C${header2.number}`);
  //   ws.mergeCells(`D${header1.number}:D${header2.number}`);
  //   ws.mergeCells(`E${header1.number}:E${header2.number}`);
  //   ws.mergeCells(`K${header1.number}:K${header2.number}`);

  //   [header1, header2].forEach((row) => {
  //     row.height = 32;
  //     row.eachCell((cell) => {
  //       cell.font = { bold: true, size: 14, color: { argb: "FF000000" } };
  //       cell.alignment = {
  //         vertical: "middle",
  //         horizontal: "center",
  //         wrapText: true,
  //       };
  //       cell.border = {
  //         top: { style: "thin", color: { argb: "FF000000" } },
  //         bottom: { style: "thin", color: { argb: "FF000000" } },
  //         left: { style: "thin", color: { argb: "FF000000" } },
  //         right: { style: "thin", color: { argb: "FF000000" } },
  //       };
  //     });
  //   });

  //   // ================= DATA ROWS =================
  //   userFilter.forEach((user, index) => {
  //     const row = ws.addRow([
  //       index + 1,
  //       user.name,
  //       user.ID,
  //       user.Designation || "",
  //       getFormattedDate(currentTime),
  //       user.shift || "",
  //       user.hours || "",
  //       user.form || "",
  //       user.to || "",
  //       user.OT || "",
  //       "",
  //     ]);

  //     row.height = 25;

  //     row.eachCell((cell, col) => {
  //       if (col === 2 || col === 3) {
  //         cell.font = { bold: true, size: 14, color: { argb: "FF000000" } };
  //       } else {
  //         cell.font = { size: 12, color: { argb: "FF000000" } };
  //       }

  //       cell.alignment = { vertical: "middle", horizontal: "center" };
  //       cell.border = {
  //         top: { style: "thin", color: { argb: "FF000000" } },
  //         bottom: { style: "thin", color: { argb: "FF000000" } },
  //         left: { style: "thin", color: { argb: "FF000000" } },
  //         right: { style: "thin", color: { argb: "FF000000" } },
  //       };
  //     });
  //   });

  //   // ================= COLUMN WIDTH =================
  //   ws.columns = [
  //     { width: 6 },
  //     { width: 20 },
  //     { width: 15 },
  //     { width: 18 },
  //     { width: 16 },
  //     { width: 12 },
  //     { width: 14 },
  //     { width: 12 },
  //     { width: 12 },
  //     { width: 12 },
  //     { width: 32 },
  //   ];

  //   // ================= SAVE FILE =================
  //   const buffer = await wb.xlsx.writeBuffer();
  //   saveAs(
  //     new Blob([buffer]),
  //     `OT_sorting_packing_${getFormattedDate(currentTime).replace(/-/g, ".")}.xlsx`
  //   );
  // };

  const handleDownload = async () => {
    if (userFilter.length === 0) {
      alert("No data to download");
      return;
    }

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("OT-Sorting Packing");

    const TOTAL_COL = 11;

    // ================= EMPTY ROWS =================
    ws.addRow([]);
    ws.addRow([]);
    ws.addRow([]);

    // ================= COMPANY HEADER =================
    const companyRows = [
      { text: "DBL CERAMICS LTD", size: 26 },
      { text: "A Concern Of DBL Group", size: 14 }, // 🔹 smaller
      { text: "Dhanua (Nayanpur), Sreepur, Gazipur", size: 13 }, // 🔹 smaller
      { text: "Pre-Approval For Over Time (O.T)", size: 16 },
    ];

    companyRows.forEach((item, i) => {
      const row = ws.addRow([item.text]);
      ws.mergeCells(row.number, 1, row.number, TOTAL_COL);
      row.height = i === 0 ? 40 : 26;
      row.font = {
        name: "Century Gothic",
        size: item.size,
        bold: true,
        color: { argb: "FF000000" },
      };
      row.alignment = { vertical: "middle", horizontal: "center" };
    });

    ws.addRow([]);

    // ================= INFO ROW =================
    const infoRow = ws.addRow([
      "Department :",
      "",
      "",
      "",
      "",
      "",
      "",
      "Section :- Sorting & packing",
      "",
      "",
      `Date : ${getFormattedDate(currentTime)}`,
    ]);

    ws.mergeCells(`A${infoRow.number}:B${infoRow.number}`);
    ws.mergeCells(`H${infoRow.number}:J${infoRow.number}`);

    infoRow.height = 30;
    infoRow.eachCell((cell) => {
      if (cell.value) {
        cell.font = { bold: true, size: 14, color: { argb: "FF000000" } };
        cell.alignment = { vertical: "middle", horizontal: "center" };
      }
    });

    // ================= TABLE HEADER =================
    const header1 = ws.addRow([
      "S.L No",
      "Name",
      "ID-No",
      "Designation",
      "Date Of OT",
      "Roster Duty",
      "",
      "Requested OT Hours",
      "",
      "",
      "Reason for requested OT",
    ]);

    const header2 = ws.addRow([
      "",
      "",
      "",
      "",
      "",
      "Shift",
      "Duty Hours",
      "From",
      "To",
      "Total Hrs",
      "",
    ]);

    ws.mergeCells(`F${header1.number}:G${header1.number}`);
    ws.mergeCells(`H${header1.number}:J${header1.number}`);

    ws.mergeCells(`A${header1.number}:A${header2.number}`);
    ws.mergeCells(`B${header1.number}:B${header2.number}`);
    ws.mergeCells(`C${header1.number}:C${header2.number}`);
    ws.mergeCells(`D${header1.number}:D${header2.number}`);
    ws.mergeCells(`E${header1.number}:E${header2.number}`);
    ws.mergeCells(`K${header1.number}:K${header2.number}`);

    [header1, header2].forEach((row) => {
      row.height = 32;
      row.eachCell((cell) => {
        cell.font = { bold: true, size: 14, color: { argb: "FF000000" } };
        cell.alignment = {
          vertical: "middle",
          horizontal: "center",
          wrapText: true,
        };
        cell.border = {
          top: { style: "thin", color: { argb: "FF000000" } },
          bottom: { style: "thin", color: { argb: "FF000000" } },
          left: { style: "thin", color: { argb: "FF000000" } },
          right: { style: "thin", color: { argb: "FF000000" } },
        };
      });
    });

    // ================= DATA ROWS =================
    userFilter.forEach((user, index) => {
      const row = ws.addRow([
        index + 1,
        user.name,
        user.ID,
        user.Designation || "",
        getFormattedDate(currentTime),
        user.shift || "",
        user.hours || "",
        user.form || "",
        user.to || "",
        user.OT || "",
        "",
      ]);

      row.height = 25;

      row.eachCell((cell, col) => {
        // 🔹 S.L No (A), Name (B), ID-No (C) → BIG & BOLD
        if (col === 1 || col === 2 || col === 3) {
          cell.font = { bold: true, size: 14, color: { argb: "FF000000" } };
        } else {
          cell.font = { size: 12, color: { argb: "FF000000" } };
        }

        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = {
          top: { style: "thin", color: { argb: "FF000000" } },
          bottom: { style: "thin", color: { argb: "FF000000" } },
          left: { style: "thin", color: { argb: "FF000000" } },
          right: { style: "thin", color: { argb: "FF000000" } },
        };
      });
    });

    // ================= COLUMN WIDTH =================
    ws.columns = [
      { width: 7 },
      { width: 20 },
      { width: 15 },
      { width: 18 },
      { width: 16 },
      { width: 12 },
      { width: 16 },
      { width: 12 },
      { width: 12 },
      { width: 12 },
      { width: 32 },
    ];

  
    // ================= SAVE FILE =================
    const buffer = await wb.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer]),
      `OT_sorting_packing_${getFormattedDate(currentTime).replace(
        /-/g,
        "."
      )}.xlsx`
    );
  };

  const countByRole = (role) =>
    users.filter((u) => u.Designation === role).length;
  const totalCount = users.length;
  const sorterCount = countByRole("Sorter");
  const helperCount = countByRole("Helper");
  const operatorCount = countByRole("Operator");
  const totalSH = sorterCount + helperCount;

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="max-w-6xl mx-auto px-4 py-10 pt-30">
        <h1 className="text-4xl text-center font-bold pt-10 mb-6">
          Sorting & Packing
        </h1>
        <h2 className="text-3xl font-bold mb-4">Today Live Duty List</h2>

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
