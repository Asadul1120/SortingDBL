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
        <p className="text-gray-400 animate-pulse">Loading employer details...</p>
      </div>
    );
  }

  const date = new Date();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthIndex = date.getMonth();
  const month = monthNames[monthIndex];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 pt-20">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-2xl p-6 shadow-md">
        <h2 className="text-2xl font-bold mb-4">{employer.name}</h2>
        <p><span className="font-medium">ID:</span> {employer.ID}</p>
        <p><span className="font-medium">Phone:</span> {employer.phone}</p>
        <p><span className="font-medium">Line:</span> {employer.line}</p>
        <p><span className="font-medium">Group:</span> {employer.group}</p>

        <div className="mt-8">
          <h3 className="text-xl font-bold mb-2">Duty Calendar (30 Days)</h3>
          <h4 className="mb-4 text-blue-300">Month of {month}</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {Array.from({ length: 30 }, (_, i) => {
              const day = String(i + 1).padStart(2, "0");
              const duty = employer.duty?.find((d) => d.date?.slice(-2) === day);

              return (
                <div
                  key={i}
                  className="bg-gray-700 rounded-xl p-4 shadow-md hover:shadow-lg transition duration-300"
                >
                  <h4 className="text-lg font-bold mb-2 text-blue-400">Day {day}</h4>
                  {duty ? (
                    <div className="space-y-1">
                      <p><span className="font-medium">Shift:</span> {duty.shift}</p>
                      <p><span className="font-medium">OT:</span> {duty.OT || "0"}</p>
                    </div>
                  ) : (
                    <p className="text-gray-400">No Duty</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          <Link to="/employers" className="text-blue-400 hover:underline">← Back to Employers</Link>
        </div>
      </div>
    </div>
  );
}

export default Details;
