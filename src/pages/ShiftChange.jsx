import { useState, useEffect, useRef } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useAuth } from "../AuthContext";
import { toast } from "react-toastify";
import {
  Download,
  Trash2,
  Calendar,
  User,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  FileSpreadsheet,
} from "lucide-react";

const ShiftChange = () => {
  const [data, setData] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [shift, setShift] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const tableContainerRef = useRef(null);
  const [todayDate, setTodayDate] = useState(" ");

  const { auth } = useAuth();

  // 🔹 GET today's shift changes
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/shiftchange`);
      const json = await res.json();
      setData(json.data || []);
      setTodayDate(json.date);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to fetch shift changes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 POST shift change
  const handleShiftChange = async () => {
    if (!employeeId || !shift) {
      toast.warn("Please enter ID & select shift");
      return;
    }

    try {
      setIsLoading(true);
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

      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Shift change added successfully!
        </div>
      );
      setEmployeeId("");
      setShift("");
      fetchData();
    } catch (error) {
      toast.error(
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error.message}
        </div>
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id) => {
    toast.info(
      <div>
        <p>Are you sure you want to delete this shift change?</p>
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => {
              toast.dismiss();
              deleteUser(id);
            }}
            className="bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded text-sm"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="bg-gray-600 hover:bg-gray-700 text-white py-1 px-4 rounded text-sm"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  const deleteUser = async (id) => {
    try {
      setIsDeleting(id);
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

      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Shift change deleted successfully!
        </div>
      );
      fetchData();
    } catch (error) {
      toast.error(
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error.message}
        </div>
      );
    } finally {
      setIsDeleting(null);
    }
  };

  // 🔹 EXCEL DOWNLOAD
  const handleDownloadExcel = async () => {
    try {
      if (data.length === 0) {
        toast.warn("No shift changes found to download.");
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
        width: header === "EmployeeCode" ? 18 : 12,
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
        newRow.getCell("employeecode").font = { bold: true, size: 12 };

        for (let day = 1; day <= 31; day++) {
          const cell = newRow.getCell(`d${day}`);
          sheet.getColumn(`d${day}`).width = cell.value ? 12 : 7;
        }

        newRow.alignment = { horizontal: "center", vertical: "middle" };
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/octet-stream" });
      saveAs(blob, `${formattedDate} shift changes.xlsx`);

      toast.success(
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5" />
          Excel file downloaded successfully!
        </div>
      );
    } catch (error) {
      console.error("Excel download error:", error);
      toast.error("Failed to download Excel");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-35">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-white text-center mb-2">
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
              Shift Change Management
            </div>
          </h1>
          <p className="text-gray-400 text-center text-sm md:text-base">
            Update and manage employee shift changes in real-time
          </p>
        </div>

        {/* ---- Form ---- */}
        {auth.user?.role === "admin" && (
          <div className="bg-gray-800 p-4 rounded-xl mb-4 md:mb-6 border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Employee ID */}
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="Employee ID"
                  className="pl-10 pr-3 py-2.5 md:py-3 w-full rounded-lg bg-gray-700 text-white text-sm md:text-base border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Shift Select */}
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value)}
                className="px-3 py-2.5 md:py-3 w-full rounded-lg bg-gray-700 text-white text-sm md:text-base border border-gray-600 focus:border-blue-500 focus:outline-none"
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

              {/* Button */}
              <button
                onClick={handleShiftChange}
                disabled={isLoading}
                className="md:col-span-2 bg-blue-600 hover:bg-blue-700 px-4 py-2.5 md:py-3 text-white rounded-lg font-semibold text-sm md:text-base flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 md:w-5 md:h-5" />
                    Update Shift
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ---- Table Container ---- */}
        <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
          {/* Table Header */}
          <div className="p-3 md:p-4 border-b border-gray-700 bg-gray-850">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  Today's Shift Changes
                </h2>
                <p className="text-gray-400 text-xs md:text-sm mt-1">
                  {data.length} record{data.length !== 1 ? "s" : ""} found
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadExcel}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 text-white rounded-lg font-semibold text-sm md:text-base flex items-center justify-center gap-2 flex-1 md:flex-none"
                >
                  <Download className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="hidden sm:inline">Download Excel</span>
                  <span className="sm:hidden">Excel</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Scroll Hint */}
          <div className="md:hidden px-3 py-2 bg-blue-900/10 border-y border-blue-800/20">
            <div className="flex items-center justify-center gap-2 text-blue-300 text-xs">
              <ChevronLeft className="w-4 h-4" />
              <span>Swipe horizontally to see all columns</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Scrollable Table */}
          <div
            ref={tableContainerRef}
            className="overflow-x-auto"
            style={{
              WebkitOverflowScrolling: "touch",
              maxHeight: "calc(100vh - 350px)",
            }}
          >
            <div className="min-w-[500px]">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-750">
                    {/* Sticky First Column */}
                    <th className="px-3 md:px-4 py-2.5 md:py-3 border-b border-gray-700 text-xs md:text-sm font-medium text-white">
                      S/L
                    </th>
                    <th className="px-3 md:px-4 py-2.5 md:py-3 border-b border-gray-700 text-xs md:text-sm font-medium text-white  ">
                      Employee ID
                    </th>

                    {/* Other Columns */}
                    <th className="px-3 md:px-4 py-2.5 md:py-3 border-b border-gray-700 text-xs md:text-sm font-medium text-white">
                      Shift
                    </th>
                    <th className="px-3 md:px-4 py-2.5 md:py-3 border-b border-gray-700 text-xs md:text-sm font-medium text-white">
                      Date
                    </th>
                    {auth.user?.role === "admin" && (
                      <th className="px-3 md:px-4 py-2.5 md:py-3 border-b border-gray-700 text-xs md:text-sm font-medium text-white text-center">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {isLoading && data.length === 0 ? (
                    <tr>
                      <td
                        colSpan={auth.user?.role === "admin" ? 5 : 4}
                        className="px-4 py-8 text-center"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <RefreshCw className="w-8 h-8 text-gray-500 animate-spin mb-2" />
                          <p className="text-gray-400">
                            Loading shift changes...
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : data.length === 0 ? (
                    <tr>
                      <td
                        colSpan={auth.user?.role === "admin" ? 5 : 4}
                        className="px-4 py-8 text-center"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <AlertCircle className="w-12 h-12 text-gray-500 mb-2" />
                          <p className="text-gray-400 text-lg mb-1">
                            No shift changes found
                          </p>
                          <p className="text-gray-500 text-sm">
                            {auth.user?.role === "admin"
                              ? "Add your first shift change using the form above"
                              : "No changes made today"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    data.map((item, index) => (
                      <tr
                        key={item._id}
                        className="border-t border-gray-700 hover:bg-gray-750/50 transition-colors"
                      >
                        <td className="px-3 md:px-4 py-2.5 md:py-3 text-xs md:text-sm text-gray-300 text-center  bg-gray-800  ">
                          {index + 1}
                        </td>
                        <td className="px-3 md:px-4 py-2.5 md:py-3 text-xs md:text-sm font-medium text-blue-300 bg-gray-800   ">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            {item.employeeId}
                          </div>
                        </td>
                        <td className="px-3 md:px-4 py-2.5 md:py-3">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-300 border border-blue-800/30">
                            {item.shift}
                          </span>
                        </td>
                        <td className="px-3 md:px-4 py-2.5 md:py-3 text-xs md:text-sm text-gray-300">
                          {item.date}
                        </td>
                        {auth.user?.role === "admin" && (
                          <td className="px-3 md:px-4 py-2.5 md:py-3">
                            <div className="flex justify-center">
                              <button
                                onClick={() =>
                                  handleDelete(item._id, item.employeeId)
                                }
                                disabled={isDeleting === item._id}
                                className="bg-red-600/80 hover:bg-red-600 px-3 py-1.5 text-white rounded-lg text-xs font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isDeleting === item._id ? (
                                  <>
                                    <RefreshCw className="w-3 h-3 animate-spin" />
                                    Deleting...
                                  </>
                                ) : (
                                  <>
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                  </>
                                )}
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table Footer */}
          <div className="p-3 md:p-4 border-t border-gray-700 bg-gray-850">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div className="text-gray-400 text-xs md:text-sm">
                Total:{" "}
                <span className="font-semibold text-white">{data.length}</span>{" "}
                shift changes
              </div>
              <div className="text-gray-400 text-xs md:text-sm">
                <span className="font-semibold text-white">
                  Last updated: {todayDate}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-4 p-3 bg-blue-900/10 border border-blue-800/30 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <p className="text-blue-300 text-sm font-medium">
                Important Notes
              </p>
              <p className="text-gray-400 text-xs mt-1">
                • Shift changes are updated in real-time
                <br />
                • Excel download includes all shift data
                <br />• Only admins can add or delete shift changes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShiftChange;
