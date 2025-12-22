
import { useState, useEffect } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import TableComponent from "../components/TableComponent";
import Logo from "../assets/Logo.json";
import { Link } from "react-router-dom";
import {
  Download,
  Calendar,
  Clock,
  Users,
  FileSpreadsheet,
  Edit,
  Package,
  Filter,
  ChevronRight,
  BarChart3,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Home,
  User,
  Phone,
  Hash,
  Briefcase,
  Plus,
  Minus,
  Search,
  Menu,
  X,
} from "lucide-react";
import { toast } from "react-toastify";

function HomePage() {
  const [users, setUsers] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDownloading, setIsDownloading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedStats, setExpandedStats] = useState(false);

  // ⏰ Live Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 📦 Fetch today's employers
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch(`${import.meta.env.VITE_BASE_URL}/today`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(Array.isArray(data.data) ? data.data : []);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setUsers([]);
        toast.error("Failed to load data");
      });
  };

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
  const hasOTUsers = userFilter.length > 0;

  // 📦 Excel Download Img Logo
  const Img = Logo.image;
  const base64Logo = Img.data;

  const handleDownload = async () => {
    if (userFilter.length === 0) {
      toast.info(
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-500" />
          <div>
            <p className="font-semibold">No Data Available</p>
            <p className="text-sm text-gray-600">
              There is no OT data to download.
            </p>
          </div>
        </div>
      );
      return;
    }

    setIsDownloading(true);

    try {
      const wb = new ExcelJS.Workbook();
      const ws = wb.addWorksheet("OT-Sorting Packing");

      const TOTAL_COL = 11;

      // ================= EMPTY ROWS =================
      ws.addRow([]);

      // ================= COMPANY HEADER =================
      const companyRows = [
        { text: "DBL CERAMICS LTD", size: 15 },
        { text: "A Concern Of DBL Group", size: 9 },
        { text: "Dhanua (Nayanpur), Sreepur, Gazipur", size: 9 },
        { text: "Pre-Approval For Over Time (O.T)", size: 13 },
      ];

      companyRows.forEach((item, i) => {
        const row = ws.addRow([item.text]);
        ws.mergeCells(row.number, 1, row.number, TOTAL_COL);
        row.height = i === 0 ? 20 : 15;
        row.font = {
          name: "Century Gothic",
          size: item.size,
          bold: true,
          color: { argb: "FF000000" },
        };
        row.alignment = { vertical: "middle", horizontal: "center" };
      });

      ws.addRow([]);
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

      infoRow.height = 26;
      infoRow.eachCell((cell) => {
        if (cell.value) {
          cell.font = { bold: true, size: 13, color: { argb: "FF000000" } };
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
        row.height = 25;
        row.eachCell((cell) => {
          cell.font = { bold: true, size: 13, color: { argb: "FF000000" } };
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
          if (col === 1 || col === 2 || col === 3) {
            cell.font = { bold: true, size: 13, color: { argb: "FF000000" } };
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
        { width: 35 },
        { width: 25 },
        { width: 26 },
        { width: 20 },
        { width: 16 },
        { width: 18 },
        { width: 15 },
        { width: 15 },
        { width: 15 },
        { width: 54 },
      ];

      // ================= LOGO IMAGE =================
      const logoImageId = wb.addImage({
        base64: base64Logo,
        extension: "png",
      });
      ws.addImage(logoImageId, {
        tl: { col: 0, row: 1 },
        ext: { width: 105, height: 80 },
      });

      ws.addRow([]);
      ws.addRow([]);
      ws.addRow([]);
      ws.addRow([]);

      // ================= SAVE FILE =================
      const buffer = await wb.xlsx.writeBuffer();
      saveAs(
        new Blob([buffer]),
        `OT_sorting_packing_${getFormattedDate(currentTime).replace(
          /-/g,
          "."
        )}.xlsx`
      );

      toast.success(
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <div>
            <p className="font-semibold">Excel Downloaded Successfully!</p>
            <p className="text-sm text-gray-600">
              File saved with {userFilter.length} OT records.
            </p>
          </div>
        </div>
      );
    } catch (error) {
      console.error("Download error:", error);
      toast.error(
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <div>
            <p className="font-semibold">Download Failed</p>
            <p className="text-sm text-gray-600">Please try again later.</p>
          </div>
        </div>
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const countByRole = (role) =>
    users.filter((u) => u.Designation === role).length;
  const totalCount = users.length;
  const sorterCount = countByRole("Sorter");
  const helperCount = countByRole("Helper");
  const operatorCount = countByRole("Operator");
  const totalSH = sorterCount + helperCount;

  // Mobile responsive helpers
  const isMobile = window.innerWidth < 768;
  const stats = [
    {
      label: "Operators",
      count: operatorCount,
      color: "from-orange-600 to-orange-700",
      icon: <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      label: "Sorters",
      count: sorterCount,
      color: "from-blue-600 to-blue-700",
      icon: <Filter className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      label: "Helpers",
      count: helperCount,
      color: "from-purple-600 to-purple-700",
      icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      label: "Sorter+Helper",
      count: totalSH,
      color: "from-green-600 to-green-700",
      icon: <Package className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 pt-10 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8 pt-20 sm:pt-24">
        {/* Header Section - Responsive */}
        <div className="text-center mb-6 sm:mb-10">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <Package className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-300 bg-clip-text text-transparent">
              Sorting & Packing
            </h1>
          </div>
          <p className="text-gray-400 text-sm sm:text-lg">
            Daily Attendance  Dashboard
          </p>
        </div>

        {/* Live Time & Date Card - Responsive */}
        <div className="bg-gradient-to-r from-gray-800/70 to-gray-900/70 backdrop-blur-sm border border-gray-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-0">
              <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-blue-900/30">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-gray-400">Current Time</p>
                <p className="text-lg sm:text-2xl font-bold text-blue-300 truncate">
                  {currentTime.toLocaleTimeString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-0">
              <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-purple-900/30">
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-gray-400">Today's Date</p>
                <p className="text-lg sm:text-2xl font-bold text-purple-300">
                  {getFormattedDate(currentTime)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-0">
              <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-green-900/30">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-gray-400">
                  Total Attendance
                </p>
                <p className="text-lg sm:text-2xl font-bold text-green-300">
                  {totalCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Statistics - Responsive */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Attendance Statistics
              </h2>
            </div>
            <button
              onClick={() => setExpandedStats(!expandedStats)}
              className="lg:hidden p-2 rounded-lg bg-gray-800 hover:bg-gray-700"
            >
              {expandedStats ? <Minus size={18} /> : <Plus size={18} />}
            </button>
          </div>

          {/* Stats Grid - Different layouts for mobile/desktop */}
          <div className={`${isMobile && !expandedStats ? "hidden" : "block"}`}>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/40 rounded-xl p-3 sm:p-5 hover:border-blue-500/30 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="p-1.5 sm:p-2 rounded-lg bg-gray-700/50">
                      {stat.icon}
                    </div>
                    <span
                      className={`text-xs sm:text-sm font-medium px-2 py-1 sm:px-3 sm:py-1 rounded-full bg-gradient-to-r ${stat.color} bg-opacity-20 text-white`}
                    >
                      {isMobile ? stat.label.split(" ")[0] : stat.label}
                    </span>
                  </div>
                  <p className="text-xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
                    {stat.count}
                  </p>
                  <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
                      style={{
                        width: `${
                          (stat.count / Math.max(totalCount, 1)) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Total Summary Card - Responsive */}
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/30 rounded-xl p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm text-gray-400">
                      Total Workforce Today
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-white">
                      {totalCount} Employees
                    </p>
                  </div>
                </div>
                <div className="w-full sm:w-auto text-center sm:text-right">
                  <p className="text-xs sm:text-sm text-gray-400">
                    OT Eligible
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-green-400">
                    {userFilter.length} Employees
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Collapsed Stats Preview */}
          {isMobile && !expandedStats && (
            <div className="grid grid-cols-4 gap-2 mb-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-gray-800/40 rounded-lg p-3 text-center"
                  onClick={() => setExpandedStats(true)}
                >
                  <div className="flex justify-center mb-1">{stat.icon}</div>
                  <p className="text-sm font-bold">{stat.count}</p>
                  <p className="text-xs text-gray-400 truncate">
                    {stat.label.split(" ")[0]}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Data Table Section - Responsive */}
        <div className="mb-8 sm:mb-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <FileSpreadsheet className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Today's Duty List
              </h2>
              <span className="text-sm text-gray-400 hidden sm:block">
                ({totalCount} employees)
              </span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={fetchData}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-2 px-3 sm:py-2 sm:px-4 rounded-lg transition-colors text-sm sm:text-base"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Refresh</span>
                <span className="sm:hidden">Refresh</span>
              </button>
              <span className="text-xs sm:text-sm text-gray-400 sm:hidden">
                {totalCount} employees
              </span>
            </div>
          </div>

          {users.length > 0 ? (
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl sm:rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <TableComponent employees={users} />
              </div>
            </div>
          ) : (
            <div className="text-center py-10 sm:py-16 bg-gray-800/20 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-700/30">
              <Users className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-medium text-gray-300 mb-2">
                No Duty Data Available
              </h3>
              <p className="text-gray-500 text-sm sm:text-base mb-4 sm:mb-6">
                Please add data or refresh the page
              </p>
              <button
                onClick={fetchData}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 px-4 sm:py-2 sm:px-6 rounded-lg mx-auto transition-all text-sm sm:text-base"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Data
              </button>
            </div>
          )}
        </div>

        {/*    */}
        <div className=" bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 p-3">
          <div className="flex justify-around">
            <button
              onClick={handleDownload}
              disabled={!hasOTUsers}
              className="flex flex-col items-center gap-1 p-2 disabled:opacity-50"
            >
              <div className="p-2 rounded-lg bg-green-900/30">
                <Download className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-xs">Download Excel</span>
            </button>

            <Link
              to="/ChangeDuty"
              className="flex flex-col items-center gap-1 p-2"
            >
              <div className="p-2 rounded-lg bg-blue-900/30">
                <Edit className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-xs">Edit Duty</span>
            </Link>

            <button
              onClick={fetchData}
              className="flex flex-col items-center gap-1 p-2"
            >
              <div className="p-2 rounded-lg bg-purple-900/30">
                <RefreshCw className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-xs">Refresh</span>
            </button>
          </div>
        </div>

        {/* Footer Info - Responsive */}
        <div className="mt-8 sm:mt-10 pt-4 sm:pt-6 border-t border-gray-800/50 text-center text-gray-500 text-xs sm:text-sm">
          <p className="mb-1">
            DBL Ceramics Ltd • Sorting & Packing Department
          </p>
          <p>
            {getFormattedDate(currentTime)} •{" "}
            {currentTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
