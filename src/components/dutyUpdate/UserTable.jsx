
import UserRow from "./UserRow";

const UserTable = ({
  data,
  shiftValues,
  otValues,
  onInputChange,
  onAddClick,
}) => {


  // const data1 = data.sort((a, b) => {
  //   const smallId =  a.ID.length  < b.ID.length ?
  //   a.ID : b.ID;
  //   const bigId =  a.ID.length  > b.ID.length ?
  //   a.ID : b.ID;
  //   return smallId.localeCompare(bigId);
  // });
 


  const GroupA = data.filter((user) => user.group === "A");
  const GroupB = data.filter((user) => user.group === "B");

  return (
    <div className="space-y-8">
      {/* Group A Table */}
      <div className="overflow-x-auto bg-gray-800 rounded-xl shadow-md p-4">
        <h2 className="text-xl font-bold text-white mb-2">Group A</h2>
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700 text-gray-100">
            <tr>
              <th className="p-3 text-left text-sm font-semibold">S/L</th>
              <th className="p-3 text-left text-sm font-semibold">Name</th>
              <th className="p-3 text-left text-sm font-semibold">ID</th>
              <th className="p-3 text-left text-sm font-semibold">Line</th>
              <th className="p-3 text-left text-sm font-semibold">Shift</th>
              <th className="p-3 text-left text-sm font-semibold">OT</th>
              <th className="p-3 text-left text-sm font-semibold text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600 text-gray-200">
            {GroupA.map((user, index) => (
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

      {/* Group B Table */}
      <div className="overflow-x-auto bg-gray-800 rounded-xl shadow-md p-4">
        <h2 className="text-xl font-bold text-white mb-2">Group B</h2>
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700 text-gray-100">
            <tr>
              <th className="p-3 text-left text-sm font-semibold">S/L</th>
              <th className="p-3 text-left text-sm font-semibold">Name</th>
              <th className="p-3 text-left text-sm font-semibold">ID</th>
              <th className="p-3 text-left text-sm font-semibold">Line</th>
              <th className="p-3 text-left text-sm font-semibold">Shift</th>
              <th className="p-3 text-left text-sm font-semibold">OT</th>
              <th className="p-3 text-left text-sm font-semibold text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600 text-gray-200">
            {GroupB.map((user, index) => (
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

export default UserTable;

