import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function Details() {
  const { id } = useParams();
  const [employer, setEmployer] = useState(null);

  useEffect(() => {
    fetch(`https://dblsorting.onrender.com/employers/${id}`)
      .then((res) => res.json())
      .then((data) => setEmployer(data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!employer) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-gray-400 animate-pulse">
          Loading employer details...
        </p>
      </div>
    );
  }

  // ✅ বর্তমান তারিখ
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // ✅ মাসে কয়দিন আছে
  function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
  }

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);

  // ✅ শিফট ও OT সাজানো
  const shifts = [];
  const ots = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const dutyData = employer.duty.find((d) => {
      const [dd, mm, yyyy] = d.date.split("-").map(Number);
      return yyyy === currentYear && mm === currentMonth && dd === day;
    });

    shifts.push(dutyData?.shift || "-");
    ots.push(dutyData?.OT?.toString() || "-");
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 pt-30">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-2xl p-6 shadow-md">
        <h2 className="text-2xl font-bold mb-4">{employer.name}</h2>
        <p>
          <span className="font-medium">ID:</span> {employer.ID}
        </p>
        <p>
          <span className="font-medium">Phone:</span> {employer.phone}
        </p>
        <p>
          <span className="font-medium">Line:</span> {employer.line}
        </p>
        <p>
          <span className="font-medium">Group:</span> {employer.group}
        </p>

        {/* ✅ ক্যালেন্ডার টেবিল */}
        <div className="overflow-x-auto mt-8">
          <p className="text-gray-400 mb-2">
            Month: {monthNames[currentMonth - 1]} {currentYear}=
          </p>
          <table className="w-full text-center border border-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="border border-gray-600 p-2">Type</th>
                {Array.from({ length: daysInMonth }, (_, i) => (
                  <th key={i} className="border border-gray-600 p-2">
                    {i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-600 p-2 font-medium">
                  Shift
                </td>
                {shifts.map((shift, i) => (
                  <td key={i} className="border border-gray-600 p-2">
                    {shift}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border border-gray-600 p-2 font-medium">OT</td>
                {ots.map((ot, i) => (
                  <td key={i} className="border border-gray-600 p-2">
                    {ot}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <Link to="/employers" className="text-blue-400 hover:underline">
            ← Back to Employers
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Details;
