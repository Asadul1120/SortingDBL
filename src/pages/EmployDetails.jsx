// import { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";

// function Details() {
//   const { id } = useParams();
//   const [employer, setEmployer] = useState(null);

//   useEffect(() => {
//     fetch(`https://dblsorting.onrender.com/employers/${id}`)
//       .then((res) => res.json())
//       .then((data) => setEmployer(data))
//       .catch((err) => console.error(err));
//   }, [id]);

//   if (!employer) {
//     return (
//       <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
//         <p className="text-gray-400 animate-pulse">
//           Loading employer details...
//         </p>
//       </div>
//     );
//   }

//   // ✅ এই ফাংশন দিয়ে মাসে কত দিন আছে বের করি
//   function getDaysInMonth(year, month) {
//     return new Date(year, month, 0).getDate();
//   }

//   // ✅ বর্তমান বছর ও মাস
//   const today = new Date();
//   const currentYear = today.getFullYear();
//   const currentMonth = today.getMonth() + 1; // JavaScript-এ 0-indexed

//   // ✅ বর্তমান মাসের মোট দিন
//   const daysInMonth = getDaysInMonth(currentYear, currentMonth);

  
//   // const  date = employer.duty.map((duty) => duty.date);
//   // const  shift = employer.duty.map((duty) => duty.shift);
//   // const  OT = employer.duty.map((duty) => duty.OT);

//   const dutes = employer.duty
//   console.log(dutes);

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-6 pt-20">
//       <div className="max-w-4xl mx-auto bg-gray-800 rounded-2xl p-6 shadow-md">
//         <h2 className="text-2xl font-bold mb-4">{employer.name}</h2>
//         <p>
//           <span className="font-medium">ID:</span> {employer.ID}
//         </p>
//         <p>
//           <span className="font-medium">Phone:</span> {employer.phone}
//         </p>
//         <p>
//           <span className="font-medium">Line:</span> {employer.line}
//         </p>
//         <p>
//           <span className="font-medium">Group:</span> {employer.group}
//         </p>

//         {/* ✅ ক্যালেন্ডার টেবিল */}
//         <div className="overflow-x-auto mt-8">
//            <p>month {currentMonth}</p>
//           <table className="w-full text-center border border-gray-700">
//             <thead className="bg-gray-700">
//               <tr>
//                 <th className="border border-gray-600 p-2">Type</th>
//                 {Array.from({ length: daysInMonth }, (_, i) => (
//                   <th key={i} className="border border-gray-600 p-2">
//                     {i + 1}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td className="border border-gray-600 p-2 font-medium">Shift</td>
//                 {shift.map((shift, i) => (
//                   <td key={i} className="border border-gray-600 p-2">
//                     {shift}
//                   </td>
//                 ))}
//               </tr>
//               <tr>
//                 <td className="border border-gray-600 p-2 font-medium">OT</td>
//                 {OT.map((ot, i) => (
//                   <td key={i} className="border border-gray-600 p-2">
//                     {ot}
//                   </td>
//                 ))}
//               </tr>
//             </tbody>
//           </table>
//         </div>

//         <div className="mt-6">
//           <Link to="/employers" className="text-blue-400 hover:underline">
//             ← Back to Employers
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Details;



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

  // ✅ এই ফাংশন দিয়ে মাসে কত দিন আছে বের করি
  function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
  }

  // ✅ বর্তমান বছর ও মাস
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // JavaScript-এ 0-indexed

  // ✅ বর্তমান মাসের মোট দিন
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);

  // ✅ দিন অনুযায়ী ডেটা সাজানো
  const shifts = [];
  const ots = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const dutyData = employer.duty.find((d) => {
      const date = new Date(d.date);
      return (
        date.getFullYear() === currentYear &&
        date.getMonth() + 1 === currentMonth &&
        date.getDate() === day
      );
    });

    shifts.push(dutyData?.shift || ""); // যদি না পাওয়া যায় তবে খালি রাখ
    ots.push(dutyData?.OT || "");       // যদি না পাওয়া যায় তবে খালি রাখ
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 pt-20">
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
          <p className="text-gray-400 mb-2">Month: {currentMonth}</p>
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
                <td className="border border-gray-600 p-2 font-medium">Shift</td>
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
