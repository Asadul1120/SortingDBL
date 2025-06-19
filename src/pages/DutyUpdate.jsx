import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UserTable from "../components/dutyUpdate/UserTable";

const DutyUpdate = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [shiftValues, setShiftValues] = useState({});
  const [otValues, setOtValues] = useState({});
  const [error, setError] = useState(null);

  const now = new Date();
  const currentHour = now.getHours();

  // ✅ যদি সময় 6:00am এর আগে হয় → আগের দিন
  let customToday = new Date(now);
  if (currentHour < 6) {
    customToday.setDate(customToday.getDate() - 1);
  }

  const year = customToday.getFullYear();
  let month = customToday.getMonth() + 1;
  let date = customToday.getDate();

  if (month < 10) month = "0" + month;
  if (date < 10) date = "0" + date;

  const formattedDate = `${date}-${month}-${year}`;
  console.log(formattedDate);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://dblsorting.onrender.com/employers");
        if (!res.ok) throw new Error("Failed to fetch data");
        const result = await res.json();
        setData(result);
        setFilteredData(result);
      } catch (error) {
        console.error(error);
        setError(error.message);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (userId, type, value) => {
    const updater = type === "shift" ? setShiftValues : setOtValues;
    updater((prev) => ({ ...prev, [userId]: value }));
  };

  const handleAddClick = async (userId) => {
    const payload = {
      date: formattedDate,
      shift: shiftValues[userId] || "None",
      OT: otValues[userId] || 0,
    };

    try {
      const res = await fetch(
        `https://dblsorting.onrender.com/employers/add-duty/${userId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error("Failed to add duty");
      alert("✅ Duty added successfully!");
    } catch (error) {
      console.error(error);
      alert("❌ Failed to add duty");
    }
  };

  const handleSearch = (line) => {
    setFilteredData(
      line === "none" ? data : data.filter((user) => user.line === line)
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-30 px-6 py-10">
      <h1 className="text-4xl font-bold text-center mb-8">Duty Management</h1>

      {/* Line Filter */}
      <div className="flex flex-col  sm:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <label htmlFor="lineFilter" className="text-lg font-medium">
            Filter by Line:
          </label>
          <select
            id="lineFilter"
            className="ml-2 px-3 py-1 border border-gray-600 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => handleSearch(e.target.value)}
          >
            <option value="none">ALL</option>
            {["1/2", 3, "5/6", 7, 8, 9].map((line) => (
              <option key={line} value={line.toString()}>
                Line {line}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-400 text-center mb-4">{error}</p>}

      {/* User Table or No Data */}
      {filteredData.length > 0 ? (
        <UserTable
          data={filteredData}
          shiftValues={shiftValues}
          otValues={otValues}
          onInputChange={handleInputChange}
          onAddClick={handleAddClick}
        />
      ) : (
        <div className="text-center mt-20">
          <h3 className="text-2xl mb-4">No employees found.</h3>
          <Link
            to="/addPerson"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow-md transition duration-300"
          >
            ➕ Add New Employee
          </Link>
        </div>
      )}
    </div>
  );
};

export default DutyUpdate;
