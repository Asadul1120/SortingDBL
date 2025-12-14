const UserRow = ({
  user,
  index,
  shiftValue,
  otValue,
  onInputChange,
  onAddClick,
  onUpdateClick,
}) => {
  return (
    <tr className="hover:bg-gray-700 transition duration-200">
      <td className="p-1 text-sm">{index + 1}</td>
      <td className="p-1 text-sm capitalize w-30">{user.name}</td>
      <td className="p-1 text-sm">{user.ID}</td>
      <td className="p-1 text-sm">{user.line}</td>

      {/* Shift Select */}
      <td className="p-1">
        <select
          className="bg-gray-900 text-white border border-gray-600 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={shiftValue || ""}
          onChange={(e) => onInputChange(user._id, "shift", e.target.value)}
        >
          {[
            "Select",
            "A",
            "B",
            "C",
            "D",
            "N",
            "G",
            "AC",
            "AB",
            "BC",
            "D/O-D",
            "D/O-N",
            "D/O-A",
            "D/O-B",
            "D/O-C",
            "D/O-G",
          ].map((shift) => (
            <option key={shift} value={shift}>
              {shift}
            </option>
          ))}
        </select>
      </td>

      {/* OT Input */}
      <td className="p-1">
        <input
          type="number"
          min="0"
          className="bg-gray-900 text-white border border-gray-600 rounded text-center py-1 text-sm w-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={otValue || ""}
          placeholder="OT"
          onChange={(e) => onInputChange(user._id, "ot", e.target.value)}
        />
      </td>

      {/* Add Button */}
      <td className="p-2 text-center">
        <button
          onClick={() => onAddClick(user._id)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded shadow text-sm transition "
        >
          Add
        </button>
        {/* <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded shadow text-sm transition ml-2"
          onClick={() => onUpdateClick(user._id)}
        >
          Update
        </button> */}
      </td>
    </tr>
  );
};

export default UserRow;
