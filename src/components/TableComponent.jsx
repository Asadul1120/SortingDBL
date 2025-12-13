const TableComponent = ({ employees }) => {
  return (
    <div className="mt-6">
      {/* 👇 Scroll Wrapper */}
      <div className="w-full overflow-x-auto">
        <table className="min-w-[700px] w-full table-auto border border-gray-700 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-900 text-white text-sm md:text-base text-center">
              <th className="px-3 md:px-4 py-2 md:py-3 border border-gray-700">
                S/L
              </th>
              <th className="px-3 md:px-4 py-2 md:py-3 border border-gray-700">
                Name
              </th>
              <th className="px-3 md:px-4 py-2 md:py-3 border border-gray-700">
                ID
              </th>
              <th className="px-3 md:px-4 py-2 md:py-3 border border-gray-700">
                Designation
              </th>
              <th className="px-3 md:px-4 py-2 md:py-3 border border-gray-700">
                Shift
              </th>
              <th className="px-3 md:px-4 py-2 md:py-3 border border-gray-700">
                Line
              </th>
            </tr>
          </thead>

          <tbody className="text-center text-white bg-gray-800 text-sm md:text-base">
            {employees.map((employee, index) => (
              <tr key={index} className="hover:bg-gray-700 transition-colors">
                <td className="px-3 md:px-4 py-2 md:py-3 border border-gray-700">
                  {index + 1}
                </td>
                <td className="px-3 md:px-4 py-2 md:py-3 border border-gray-700 capitalize whitespace-nowrap">
                  {employee.name}
                </td>
                <td className="px-3 md:px-4 py-2 md:py-3 border border-gray-700 whitespace-nowrap">
                  {employee.ID}
                </td>
                <td className="px-3 md:px-4 py-2 md:py-3 border border-gray-700 whitespace-nowrap">
                  {employee.Designation}
                </td>
                <td className="px-3 md:px-4 py-2 md:py-3 border border-gray-700 whitespace-nowrap">
                  {employee.shift}
                </td>
                <td className="px-3 md:px-4 py-2 md:py-3 border border-gray-700 whitespace-nowrap">
                  {employee.line}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 👇 Mobile hint */}
      <p className="text-gray-400 text-xs mt-2 md:hidden text-center">
        ⬅️ Swipe left / right to see more
      </p>
    </div>
  );
};

export default TableComponent;
