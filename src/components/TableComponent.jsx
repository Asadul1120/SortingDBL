// const TableComponent = ({ employees }) => {
//   return (
//     <div className="overflow-x-auto mt-6">
//       <table className="w-full border border-gray-300 rounded-lg shadow-md table-auto">
//         <thead>
//           <tr className="bg-gray-800 text-white text-sm md:text-base text-center">
//             <th className="px-4 py-3 border border-gray-300">S/L</th>
//             <th className="px-4 py-3 border border-gray-300">Name</th>
//             <th className="px-4 py-3 border border-gray-300">ID</th>
//             <th className="px-4 py-3 border border-gray-300">Shift</th>
//             <th className="px-4 py-3 border border-gray-300">Line</th>
//           </tr>
//         </thead>
//         <tbody className="text-center text-gray-800 bg-white">
//           {employees.map((employee, index) => (
//             <tr
//               key={index}
//               className="hover:bg-gray-100 transition-colors duration-150"
//             >
//               <td className="px-4 py-3 border border-gray-300 font-semibold">
//                 {index + 1}
//               </td>
//               <td className="px-4 py-3 border border-gray-300">
//                 {employee.name}
//               </td>
//               <td className="px-4 py-3 border border-gray-300">
//                 {employee.ID}
//               </td>
//               <td className="px-4 py-3 border border-gray-300">
//                 {employee.shift}
//               </td>
//               <td className="px-4 py-3 border border-gray-300">
//                 {employee.line}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default TableComponent;

const TableComponent = ({ employees }) => {
  return (
    <div className="overflow-x-auto mt-6">
      <table className="w-full table-auto border border-gray-700 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-900 text-white text-sm md:text-base text-center">
            <th className="px-4 py-3 border border-gray-700">S/L</th>
            <th className="px-4 py-3 border border-gray-700">Name</th>
            <th className="px-4 py-3 border border-gray-700">ID</th>
            <th className="px-4 py-3 border border-gray-700">Shift</th>
            <th className="px-4 py-3 border border-gray-700">Line</th>
          </tr>
        </thead>
        <tbody className="text-center text-white bg-gray-800">
          {employees.map((employee, index) => (
            <tr
              key={index}
              className="hover:bg-gray-700 transition-colors duration-150"
            >
              <td className="px-4 py-3 border border-gray-700 font-medium">
                {index + 1}
              </td>
              <td className="px-4 py-3 border border-gray-700 capitalize">
                {employee.name}
              </td>
              <td className="px-4 py-3 border border-gray-700">
                {employee.ID}
              </td>
              <td className="px-4 py-3 border border-gray-700">
                {employee.shift}
              </td>
              <td className="px-4 py-3 border border-gray-700">
                {employee.line}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;

