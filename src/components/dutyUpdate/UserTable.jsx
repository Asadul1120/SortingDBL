import UserRow from "./UserRow";

const UserTable = ({
  data,
  shiftValues,
  otValues,
  onInputChange,
  onAddClick,
}) => {
  const sorting = [...data].sort((a, b) => a.line.localeCompare(b.line));

  const UserComponent = ({ data, line }) => {
    return (
      <div className="bg-gray-800 rounded-xl shadow-md p-4">
        {/* Header */}
        <h2 className="text-xl font-bold text-white mb-3">{line}</h2>

        {/* Scroll Wrapper */}
        <div className="w-full overflow-x-auto">
          <table className="min-w-[480px] w-full border-collapse">
            <thead className="bg-gray-700 text-gray-100">
              <tr className="text-sm font-semibold">
                <th className="p-3 text-left whitespace-nowrap">S/L</th>
                <th className="p-3 text-left whitespace-nowrap">Name</th>
                <th className="p-3 text-left whitespace-nowrap">ID</th>
                <th className="p-3 text-left whitespace-nowrap">Line</th>
                <th className="p-3 text-left whitespace-nowrap">Shift</th>
                <th className="p-3 text-left whitespace-nowrap">OT</th>
                <th className="p-3 text-center whitespace-nowrap">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-600 text-gray-200 text-sm">
              {data.map((user, index) => (
                <UserRow
                  key={user._id}
                  user={user}
                  index={index}
                  shiftValue={shiftValues[user._id]}
                  otValue={otValues[user._id]}
                  onInputChange={onInputChange}
                  onAddClick={onAddClick}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <UserComponent data={sorting} line="Select Line" />
    </div>
  );
};

export default UserTable;
