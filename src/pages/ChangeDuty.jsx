import { useState, useEffect } from "react";
import {
  Search,
  User,
  Edit,
  Trash2,
  Check,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import UserIcon from "../assets/user.png";

const ChangeDuty = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [edit, setEdit] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);

  // =============================
  // Fetch today's duty
  // =============================
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_BASE_URL}/today`)
      .then((res) => res.json())
      .then((result) => {
        const list = Array.isArray(result.data) ? result.data : [];
        setData(list);
        setFilteredData(list);
        setLoading(false);
      })
      .catch(() => {
        setData([]);
        setFilteredData([]);
        setLoading(false);
      });
  };

  // =============================
  // Search
  // =============================
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    const filtered = data.filter(
      (item) =>
        item.ID?.toString().includes(value) ||
        item.name?.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredData(filtered);
  };

  // =============================
  // Shift Change
  // =============================
  const handleShiftChange = (id, value) => {
    setEdit((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        shift: value,
      },
    }));
  };

  // =============================
  // OT Change
  // =============================
  const handleOTChange = (id, value) => {
    setEdit((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        OT: value,
      },
    }));
  };

  // =============================
  // Update Duty
  // =============================
  const handleUpdate = (id) => {
    const payload = {
      shift: edit[id]?.shift || data.find((d) => d._id === id)?.shift,
      OT: edit[id]?.OT || data.find((d) => d._id === id)?.OT,
    };

    setEditingId(id);

    fetch(`${import.meta.env.VITE_BASE_URL}/duty/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then(() => {
        // update UI instantly
        setData((prev) =>
          prev.map((item) => (item._id === id ? { ...item, ...payload } : item))
        );

        setFilteredData((prev) =>
          prev.map((item) => (item._id === id ? { ...item, ...payload } : item))
        );

        // Clear edit state for this user
        setEdit((prev) => {
          const newEdit = { ...prev };
          delete newEdit[id];
          return newEdit;
        });

        setEditingId(null);
      })
      .catch(() => {
        setEditingId(null);
      });
  };

  // =============================
  // Delete duty
  // =============================
  const handleDelete = (id) => {
    setShowConfirmDelete(null);

    fetch(`${import.meta.env.VITE_BASE_URL}/duty/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        // Remove from UI instantly
        setData((prev) => prev.filter((item) => item._id !== id));
        setFilteredData((prev) => prev.filter((item) => item._id !== id));
      });
  };

  // =============================
  // Reset all changes for a user
  // =============================
  const resetChanges = (id) => {
    setEdit((prev) => {
      const newEdit = { ...prev };
      delete newEdit[id];
      return newEdit;
    });
  };

  // =============================
  // Loading Skeleton
  // =============================
  const LoadingSkeleton = () => (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="bg-gray-800/50 animate-pulse rounded-lg p-4 h-24"
        />
      ))}
    </div>
  );

  // Shift options with colors
  const shiftOptions = [
    { value: "A", color: "bg-blue-500", label: "A" },
    { value: "B", color: "bg-green-500", label: "B" },
    { value: "C", color: "bg-yellow-500", label: "C" },
    { value: "D", color: "bg-purple-500", label: "D" },
    { value: "N", color: "bg-red-500", label: "N" },
    { value: "G", color: "bg-gray-500", label: "G" },
    { value: "AC", color: "bg-blue-300", label: "AC" },
    { value: "AB", color: "bg-green-300", label: "AB" },
    { value: "BC", color: "bg-yellow-300", label: "BC" },
    { value: "D/O-D", color: "bg-purple-300", label: "D/O-D" },
    { value: "D/O-N", color: "bg-red-300", label: "D/O-N" },
    { value: "D/O-A", color: "bg-blue-200", label: "D/O A" },
    { value: "D/O-B", color: "bg-green-200", label: "D/O B" },
    { value: "D/O-C", color: "bg-yellow-200", label: "D/O C" },
    { value: "D/O-G", color: "bg-gray-300", label: "D/O-G" },
  ];

  // =============================
  // JSX
  // =============================
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 px-4 py-6 pt-35 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Duty Management
              </h1>
              <p className="text-gray-400 mt-2">
                Manage employee shifts and overtime
              </p>
            </div>

            <button
              onClick={fetchData}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <RefreshCw size={18} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="search"
              value={search}
              onChange={handleSearch}
              placeholder="Search by ID or Name..."
              className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Total Employees</p>
            <p className="text-2xl font-bold text-white">{data.length}</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Showing</p>
            <p className="text-2xl font-bold text-white">
              {filteredData.length}
            </p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Changes Pending</p>
            <p className="text-2xl font-bold text-yellow-400">
              {Object.keys(edit).length}
            </p>
          </div>
        </div>

        {/* Employee List */}
        {loading ? (
          <LoadingSkeleton />
        ) : filteredData.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800/50 mb-4">
              <User className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No employees found
            </h3>
            <p className="text-gray-400">
              {search
                ? "Try a different search term"
                : "No duty data available"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredData.map((user) => {
              const hasChanges = edit[user._id];
              const isEditing = editingId === user._id;

              return (
                <div
                  key={user._id}
                  className={`bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border transition-all duration-300
                    ${
                      hasChanges
                        ? "border-yellow-500/50 shadow-lg shadow-yellow-500/10"
                        : "border-gray-700/50"
                    }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* User Info */}

                    {/* User Info */}
                    <div className="flex-1 flex items-center gap-4">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center ">
                          <img src={UserIcon} alt="User Icon" />
                        </div>
                      </div>

                      {/* Name and ID */}
                      <div className="flex flex-col">
                        <p className="text-white font-semibold">
                          {user.name || "Unknown"}
                        </p>
                        <p className="text-gray-400 text-sm">ID: {user.ID}</p>
                      </div>

                      {/* Shift & OT */}
                      <div className="ml-auto flex flex-col gap-1">
                        {/* Shift */}
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-medium text-center ${
                            shiftOptions.find((s) => s.value === user.shift)
                              ?.color || "bg-gray-500"
                          } ${
                            // If background is light, use black text, else white
                            [
                              "bg-yellow-200",
                              "bg-green-200",
                              "bg-blue-200",
                              "bg-gray-300",
                              "bg-yellow-300",
                              "bg-green-300",
                              "bg-blue-300",
                            ].includes(
                              shiftOptions.find((s) => s.value === user.shift)
                                ?.color
                            )
                              ? "text-black"
                              : "text-white"
                          }`}
                        >
                          Shift: {user.shift || "N/A"}
                        </div>

                        {/* OT */}
                        <div className="px-3 py-1 rounded-full bg-gray-700 text-white text-sm font-medium text-center">
                          OT: {user.OT || "N/A"}
                        </div>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex gap-3">
                        {/* Shift Select */}
                        <div className="relative">
                          <select
                            value={edit[user._id]?.shift ?? user.shift}
                            onChange={(e) =>
                              handleShiftChange(user._id, e.target.value)
                            }
                            className="appearance-none bg-gray-900/70 border border-gray-600 rounded-lg
                                     px-4 py-2 pr-10 text-white focus:outline-none focus:ring-2
                                     focus:ring-blue-500 focus:border-transparent cursor-pointer"
                          >
                            {shiftOptions.map((shift) => (
                              <option key={shift.value} value={shift.value}>
                                {shift.label}
                              </option>
                            ))}
                          </select>
                          <Edit
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                            size={16}
                          />
                        </div>

                        {/* OT Input */}
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            value={edit[user._id]?.OT ?? user.OT}
                            onChange={(e) =>
                              handleOTChange(user._id, e.target.value)
                            }
                            placeholder="OT"
                            className="bg-gray-900/70 border border-gray-600 rounded-lg px-4 py-2
                                     text-white focus:outline-none focus:ring-2 focus:ring-blue-500
                                     focus:border-transparent w-24"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {/* Update Button */}
                        <button
                          onClick={() => handleUpdate(user._id)}
                          disabled={!hasChanges || isEditing}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                            hasChanges
                              ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                              : "bg-gray-700 cursor-not-allowed"
                          } ${
                            isEditing ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          {isEditing ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <Check size={18} />
                              <span>Update</span>
                            </>
                          )}
                        </button>

                        {/* Reset Button */}
                        {hasChanges && (
                          <button
                            onClick={() => resetChanges(user._id)}
                            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                            title="Reset changes"
                          >
                            <RefreshCw size={18} />
                          </button>
                        )}

                        {/* Delete Button */}
                        <button
                          onClick={() => setShowConfirmDelete(user._id)}
                          className="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-600/30
                                   hover:border-red-600/50 rounded-lg transition-colors group relative"
                          title="Delete duty"
                        >
                          <Trash2
                            size={18}
                            className="text-red-400 group-hover:text-red-300"
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Delete Confirmation Modal */}
                  {showConfirmDelete === user._id && (
                    <div className="mt-4 p-4 bg-red-900/20 border border-red-700/30 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <AlertTriangle className="text-red-400" size={20} />
                        <p className="text-white font-medium">
                          Delete this duty record?
                        </p>
                      </div>
                      <p className="text-gray-300 text-sm mb-4">
                        This will permanently remove {user.name}'s duty
                        information.
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setShowConfirmDelete(null)}
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangeDuty;
