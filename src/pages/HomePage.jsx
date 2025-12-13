import { useState, useEffect } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
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

  // const handleDownload = () => {
  //   if (userFilter.length === 0) {
  //     alert("No data to download.");
  //     return;
  //   }

  //   const wb = XLSX.utils.book_new();

  //   const wsData = [
  //     [],
  //     [],
  //     [],
  //     ["", "", "", "", "", "", "      DBL CERAMICS LTD", ""],
  //     ["", "", "", "", "", "", "   A Concern Of DBL Group  "],
  //     ["", "", "", "", "", "", " Dhanua (Nayanpur),Sreepur,Gazipur"],
  //     ["", "", "", "", "", "", "Pre-Approval For Over Time (O.T)"],
  //     [],
  //     [
  //       "",
  //       "",
  //       "",
  //       "",
  //       "",
  //       "",
  //       "",
  //       "",
  //       "",
  //       "Date :",
  //       getFormattedDate(currentTime),
  //     ],
  //     [
  //       "",
  //       "",
  //       "Department : ",
  //       "",
  //       "",
  //       "",
  //       "",
  //       "",
  //       "",
  //       "Section :- Sorting & packing",
  //     ],
  //     [
  //       "S.L No  ",
  //       " Name",
  //       "ID-No ",
  //       "Designation",
  //       " Date Of OT",
  //       "Roster Duty",
  //       "",
  //       "  Requisted OT Hours ",
  //       "",
  //       "",
  //       "Reason for requested OT",
  //     ],
  //     [
  //       "",
  //       "",
  //       "",
  //       "",
  //       "",
  //       " Shift ",
  //       " Duty Hours ",
  //       "   From  ",
  //       " To  ",
  //       " Total Hrs ",
  //     ],
  //   ];

  //   // Add employee data rows
  //   userFilter.forEach((user, index) => {
  //     wsData.push([
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
  //        "",
  //       "",
  //       "",
  //       "",
  //       "",
  //       "",
  //       "",
  //       "",
  //       "",
  //       "",
  //       "",
  //       "",
  //       "",
  //       "",
  //       "",
  //       "",
  //       "",
  //       user.shift || "",
  //       "",
  //       "",
  //       "",
  //       "",
  //     ]);
  //   });

  //   // Add 20 blank rows at the end
  //   for (let i = 0; i < 20; i++) wsData.push([]);

  //   // Create worksheet
  //   const ws = XLSX.utils.aoa_to_sheet(wsData);

  //   // ✅ Set column widths
  //   ws["!cols"] = [
  //     { wch: 8 }, // S.L No
  //     { wch: 15 }, // Name
  //     { wch: 15 }, // ID-No
  //     { wch: 15 }, // Designation
  //     { wch: 15 }, // Date Of OT
  //     { wch: 12 }, // Shift
  //     { wch: 15 }, // Duty Hours
  //     { wch: 10 }, // From
  //     { wch: 10 }, // To
  //     { wch: 12 }, // Total Hrs
  //     { wch: 30 }, // Reason
  //   ];

  //   // ✅ Set row heights (especially for header rows 11 & 12 → index 11 & 12)
  //   const totalRows = wsData.length;
  //   ws["!rows"] = Array(totalRows).fill({ hpt: 20 }); // default height

  //   ws["!rows"][8] = { hpt: 30 };
  //   ws["!rows"][9] = { hpt: 30 }; // header row 1
  //   ws["!rows"][10] = { hpt: 30 }; // header row 2

  //   // ✅ Apply styles (center align & bold header)
  //   const range = XLSX.utils.decode_range(ws["!ref"]);
  //   for (let R = range.s.r; R <= range.e.r; ++R) {
  //     for (let C = range.s.c; C <= range.e.c; ++C) {
  //       const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
  //       const cell = ws[cellRef];
  //       if (cell && cell.v !== undefined) {
  //         if (!cell.s) cell.s = {};
  //         cell.s.alignment = {
  //           vertical: "center",
  //           horizontal: "center",
  //           wrapText: true,
  //         };
  //         if (R === 13 || R === 14) {
  //           cell.s.font = { bold: true };
  //         }
  //       }
  //     }
  //   }

  //   // ✅ Add worksheet to workbook and export
  //   XLSX.utils.book_append_sheet(wb, ws, "OT-Sorting Packing");

  //   XLSX.writeFile(
  //     wb,
  //     `OT_sorting_packing_${getFormattedDate(currentTime).replace(
  //       /-/g,
  //       "."
  //     )}.xlsx`
  //   );
  // };

  const handleDownload = async () => {
    if (userFilter.length === 0) {
      alert("No data to download.");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("OT-Sorting Packing");

    // -------------------------------
    // Company Header Rows
    // -------------------------------
    sheet.addRow([]);
    sheet.addRow([]);
    sheet.addRow([]);

    const header1 = sheet.addRow(["", "", "", "", "", "", "DBL CERAMICS LTD"]);
    const header2 = sheet.addRow([
      "",
      "",
      "",
      "",
      "",
      "",
      "A Concern Of DBL Group",
    ]);
    const header3 = sheet.addRow([
      "",
      "",
      "",
      "",
      "",
      "",
      "Dhanua (Nayanpur),Sreepur,Gazipur",
    ]);
    const header4 = sheet.addRow([
      "",
      "",
      "",
      "",
      "",
      "",
      "Pre-Approval For Over Time (O.T)",
    ]);

    [header1, header2, header3, header4].forEach((row) => {
      row.height = 25;
      sheet.mergeCells(row.number, 7, row.number, 11); // merge company name cells
      row.font = { bold: true, size: 16 };
      row.alignment = { vertical: "middle", horizontal: "center" };
    });

    sheet.addRow([]);
    sheet.addRow([
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
    ]);
    const header5 = sheet.addRow([
      "",
      "",
      "",
      "",
      "",
      "",
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
    ]);

    header5.font = { bold: true, size: 16 };
    header5.alignment = { vertical: "middle", horizontal: "center" };

    // -------------------------------
    // Table Header Rows
    // -------------------------------
    const tableHeader1 = sheet.addRow([
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
    const tableHeader2 = sheet.addRow([
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

    [tableHeader1, tableHeader2].forEach((row) => {
      row.font = { bold: true, size: 14 };
      row.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };
      row.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD9D9D9" }, // light gray
      };
    });

    // -------------------------------
    // Employee Data
    // -------------------------------
    userFilter.forEach((user, index) => {
      const row = sheet.addRow([
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
      row.alignment = { vertical: "middle", horizontal: "center" };
    });

    // -------------------------------
    // Add 20 blank rows
    // -------------------------------
    for (let i = 0; i < 20; i++) sheet.addRow([]);

    // -------------------------------
    // Column Widths Auto
    // -------------------------------
    sheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const cellValue = cell.value ? cell.value.toString() : "";
        if (cellValue.length > maxLength) maxLength = cellValue.length;
      });
      column.width = maxLength < 10 ? 10 : maxLength + 2;
    });

    // -------------------------------
    // Logo Insert (Optional)
    // -------------------------------
    /*
  const logoBase64 = "PASTE_YOUR_BASE64_HERE";
  const imageId = workbook.addImage({
    base64: logoBase64,
    extension: "png",
  });
  sheet.addImage(imageId, {
    tl: { col: 0, row: 0 },
    br: { col: 3, row: 3 },
    editAs: "oneCell",
  });
  */

    // -------------------------------
    // Export Excel File
    // -------------------------------
    const buffer = await workbook.xlsx.writeBuffer();
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
