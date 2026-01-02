const UserRow = ({
  user,
  index,
  shiftValue,
  otValue,
  onInputChange,
  onAddClick,
}) => {
  const shiftOTMap = {
    A: 0,
    B: 0,
    C: 0,
    G: 0,
    D: 3,
    N: 3,
    AC: 8,
    AB: 7,
    BC: 7,

    "D/O-D": 11,
    "D/O-N": 11,
    "D/O-A": 8,
    "D/O-B": 8,
    "D/O-C": 8,
    "D/O-G": 8,

    "D/O-AC": 16,
    "D/O-AB": 15,
    "D/O-BC": 15,
  };

  const otOptions = [0, 3, 7, 8, 11, 15, 16];

  return (
    <tr className="hover:bg-gray-700 transition duration-200">
      <td className="p-1 text-sm">{index + 1}</td>
      <td className="p-1 text-sm capitalize">{user.name}</td>
      <td className="p-1 text-sm">{user.ID}</td>
      <td className="p-1 text-sm">{user.line}</td>

      {/* Shift */}
      <td className="p-1">
        <select
          className="bg-gray-900 text-white border border-gray-600 rounded px-2 py-1 text-sm"
          value={shiftValue || "Select"}
          onChange={(e) => {
            const selectedShift = e.target.value;

            onInputChange(user._id, "shift", selectedShift);

            if (selectedShift === "Select") {
              onInputChange(user._id, "ot", "");
              return;
            }

            const autoOT = shiftOTMap[selectedShift] ?? "";
            onInputChange(user._id, "ot", autoOT);
          }}
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
            "D/O-AC",
            "D/O-AB",
            "D/O-BC",
          ].map((shift) => (
            <option key={shift} value={shift}>
              {shift}
            </option>
          ))}
        </select>
      </td>

      {/* OT */}
      <td className="p-1">
        {shiftValue === "Select" ? (
          <select
            className="bg-gray-900 text-white border border-gray-600 rounded px-2 py-1 text-sm w-20"
            value={otValue ?? ""}
            onChange={(e) =>
              onInputChange(user._id, "ot", Number(e.target.value))
            }
          >
            <option value="">OT</option>
            {otOptions.map((ot) => (
              <option key={ot} value={ot}>
                {ot}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="number"
            min="0"
            className="bg-gray-900 text-white border border-gray-600 rounded text-center py-1 text-sm w-20"
            value={otValue ?? ""}
            placeholder="OT"
            onChange={(e) =>
              onInputChange(user._id, "ot", Number(e.target.value))
            }
          />
        )}
      </td>

      {/* Add */}
      <td className="p-2 text-center">
        <button
          onClick={() => onAddClick(user._id)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
        >
          Add
        </button>
      </td>
    </tr>
  );
};

export default UserRow;
