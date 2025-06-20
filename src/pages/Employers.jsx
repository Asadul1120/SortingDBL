import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

function Employers() {
  const [employers, setEmployers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [searchId, setSearchId] = useState("");
  // role bace work
  const { auth } = useAuth();
  const { user } = auth;
 
  

  useEffect(() => {
    fetch("https://dblsorting.onrender.com/employers")
      .then((response) => response.json())
      .then((data) => {
        const sortedData = data.sort((a, b) => a.ID - b.ID);
        setEmployers(sortedData);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employer?"
    );
    if (!confirmDelete) return;

    fetch(`https://dblsorting.onrender.com/employers/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        setEmployers(employers.filter((employer) => employer._id !== id));
      })
      .catch((error) => console.error(error));
  };
  

  const handleEditClick = (employer) => {
    setEditingId(employer._id);
    setEditedData({ ...employer });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleSave = () => {
    fetch(`https://dblsorting.onrender.com/employers/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedData),
    })
      .then((res) => res.json())
      .then((updated) => {
        const updatedEmployers = employers.map((emp) =>
          emp._id === editingId ? updated : emp
        );
        setEmployers(updatedEmployers);
        setEditingId(null);
        setEditedData({});
      })
      .catch((err) => console.error(err));
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedData({});
  };

  const filteredEmployers = employers.filter(
    (emp) =>
      emp.ID.toString().includes(searchId) ||
      emp.name.toLowerCase().includes(searchId.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 pt-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">All Employers</h1>

        <input
          type="text"
          placeholder="Search by ID or Name"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value.trim())}
          className="bg-gray-700 text-white p-2 rounded mb-6 w-full border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <h4 className=" text-gray-400 mb-4 text-xl font-semibold">
          {" "}
          Total employers: {employers.length}
        </h4>

        {employers.length === 0 ? (
          <div className="text-center text-gray-400">
            <span className="animate-pulse">Loading employers...</span>
          </div>
        ) : (
          <div className="flex flex-wrap gap-6 justify-center">
            {filteredEmployers.map((employer) => (
              <div
                key={employer._id}
                className="bg-gray-800 hover:bg-gray-700 transition-all duration-300 rounded-2xl p-6 shadow-md w-full sm:w-[47%] md:w-[30%] flex flex-col"
              >
                {editingId === employer._id ? (
                  <>
                    {["name", "ID", "phone", "line", "group"].map((field) => (
                      <input
                        key={field}
                        name={field}
                        value={editedData[field]}
                        onChange={handleChange}
                        placeholder={`Enter ${field}`}
                        className="bg-gray-700 text-white p-2 rounded mb-2 w-full border border-gray-600 focus:ring-2 focus:ring-blue-500"
                      />
                    ))}
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={handleSave}
                        className="bg-green-600 hover:bg-green-700 py-2 px-4 rounded font-semibold"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-600 hover:bg-gray-700 py-2 px-4 rounded font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold mb-2">
                      {employer.name}
                    </h2>
                    <p className="text-gray-300">
                      <span className="font-medium">ID:</span> {employer.ID}
                    </p>
                    <p className="text-gray-300">
                      <span className="font-medium">Phone:</span>{" "}
                      {employer.phone}
                    </p>
                    <p className="text-gray-300">
                      <span className="font-medium">Line:</span> {employer.line}
                    </p>
                    <p className="text-gray-300 mb-4">
                      <span className="font-medium">Group:</span>{" "}
                      {employer.group}
                    </p>
                    <div className="mt-auto flex gap-2 flex-wrap">
                      <Link
                        to={`/employers/${employer._id}`}
                        className="bg-purple-600 hover:bg-purple-700 py-2 px-4 rounded font-medium text-center"
                      >
                        Details
                      </Link>
                      {user?.role === "admin" && (
                        <>
                          <button
                            onClick={() => handleEditClick(employer)}
                            className="bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(employer._id)}
                            className="bg-red-600 hover:bg-red-700 py-2 px-4 rounded font-medium"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Employers;
