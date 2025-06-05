import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Employers() {
  const [employers, setEmployers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [searchId, setSearchId] = useState("");

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

  const filteredEmployers = employers.filter((emp) => 
  emp.ID.toString().includes(searchId) || // ID match (partial)
  emp.name.toLowerCase().includes(searchId.toLowerCase()) // name match (case-insensitive)
);


  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 pt-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">All Employers</h1>

      

        {employers.length === 0 ? (
          <div className="text-center text-gray-400">
            <span className="animate-pulse">Loading employers...</span>
          </div>
        ) : (
          <div className="flex flex-wrap gap-6 justify-center">
              <input
          type="text"
          placeholder="Search by ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="bg-gray-700 text-white p-2 rounded mb-6 w-full border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
            {filteredEmployers.map((employer) => (
              <div
                key={employer._id}
                className="bg-gray-800 hover:bg-gray-700 transition-all duration-300 rounded-2xl p-6 shadow-md w-full sm:w-[47%] md:w-[30%] flex flex-col"
              >
                {editingId === employer._id ? (
                  <>
                    <input
                      name="name"
                      value={editedData.name}
                      onChange={handleChange}
                      placeholder="Enter name"
                      className="bg-gray-700 text-white p-2 rounded mb-2 w-full border border-gray-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      name="ID"
                      value={editedData.ID}
                      onChange={handleChange}
                      placeholder="Enter ID"
                      className="bg-gray-700 text-white p-2 rounded mb-2 w-full border border-gray-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      name="phone"
                      value={editedData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone"
                      className="bg-gray-700 text-white p-2 rounded mb-2 w-full border border-gray-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      name="line"
                      value={editedData.line}
                      onChange={handleChange}
                      placeholder="Enter line"
                      className="bg-gray-700 text-white p-2 rounded mb-2 w-full border border-gray-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      name="group"
                      value={editedData.group}
                      onChange={handleChange}
                      placeholder="Enter group"
                      className="bg-gray-700 text-white p-2 rounded mb-2 w-full border border-gray-600 focus:ring-2 focus:ring-blue-500"
                    />
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
                    <h2 className="text-xl font-semibold mb-2">{employer.name}</h2>
                    <p className="text-gray-300">
                      <span className="font-medium">ID:</span> {employer.ID}
                    </p>
                    <p className="text-gray-300">
                      <span className="font-medium">Phone:</span> {employer.phone}
                    </p>
                    <p className="text-gray-300">
                      <span className="font-medium">Line:</span> {employer.line}
                    </p>
                    <p className="text-gray-300 mb-4">
                      <span className="font-medium">Group:</span> {employer.group}
                    </p>
                    <div className="mt-auto flex gap-2">
                        
                      <button
                        onClick={() => handleEditClick(employer)}
                        className="bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(employer._id)}
                        className="bg-red-500 hover:bg-red-600 py-2 px-4 rounded font-medium"
                      >
                        Delete
                      </button>
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
