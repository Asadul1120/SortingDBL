// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { useAuth } from "../AuthContext";
// import { toast } from "react-toastify";

// function Employers() {
//   const [employers, setEmployers] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   const [editedData, setEditedData] = useState({});
//   const [searchId, setSearchId] = useState("");
//   // role bace work
//   const { auth } = useAuth();
//   const { user } = auth;

//   useEffect(() => {
//     fetch(`${import.meta.env.VITE_BASE_URL}/employers`)
//       .then((response) => response.json())
//       .then((data) => {
//         const sortedData = data.sort((a, b) => a.ID - b.ID);
//         setEmployers(sortedData);
//       })
//       .catch((error) => console.error(error));
//   }, []);

//   const handleDelete = (id) => {
//     toast.info(
//       <div>
//         <p>Are you sure you want to delete this employer?</p>
//         <div className="flex gap-2 mt-3">
//           <button
//             onClick={() => {
//               toast.dismiss();
//               deleteEmployer(id);
//             }}
//             className="bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded text-sm"
//           >
//             Delete
//           </button>
//           <button
//             onClick={() => toast.dismiss()}
//             className="bg-gray-600 hover:bg-gray-700 text-white py-1 px-4 rounded text-sm"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>,
//       {
//         position: "top-center",
//         autoClose: false,
//         closeOnClick: false,
//         draggable: false,
//       }
//     );
//   };

//   const deleteEmployer = (id) => {
//     fetch(`${import.meta.env.VITE_BASE_URL}/employers/${id}`, {
//       method: "DELETE",
//     })
//       .then((response) => response.json())
//       .then(() => {
//         setEmployers(employers.filter((employer) => employer._id !== id));
//         toast.success("✅ Employer deleted successfully!");
//       })
//       .catch((error) => {
//         console.error(error);
//         toast.error("❌ Failed to delete employer");
//       });
//   };

//   const handleEditClick = (employer) => {
//     setEditingId(employer._id);
//     setEditedData({ ...employer });
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setEditedData({ ...editedData, [name]: value });
//   };

//   const handleSave = () => {
//     fetch(`${import.meta.env.VITE_BASE_URL}/employers/${editingId}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(editedData),
//     })
//       .then((res) => res.json())
//       .then((updated) => {
//         const updatedEmployers = employers.map((emp) =>
//           emp._id === editingId ? updated : emp
//         );
//         setEmployers(updatedEmployers);
//         setEditingId(null);
//         setEditedData({});
//         toast.success("✅ Employer updated successfully!");
//       })
//       .catch((err) => {
//         console.error(err);
//         toast.error("❌ Failed to update employer");
//       });
//   };

//   const handleCancel = () => {
//     setEditingId(null);
//     setEditedData({});
//   };

//   const filteredEmployers = employers.filter(
//     (emp) =>
//       emp.ID.toString().includes(searchId) ||
//       emp.name.toLowerCase().includes(searchId.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-4 pt-40">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl font-bold text-center mb-8">All Employers</h1>

//         <input
//           type="text"
//           placeholder="Search by ID or Name"
//           value={searchId}
//           onChange={(e) => setSearchId(e.target.value.trim())}
//           className="bg-gray-700 text-white p-2 rounded mb-6 w-full border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <h4 className=" text-gray-400 mb-4 text-xl font-semibold">
//           {" "}
//           Total employers: {employers.length}
//         </h4>

//         {employers.length === 0 ? (
//           <div className="text-center text-gray-400">
//             <span className="animate-pulse">Loading employers...</span>
//           </div>
//         ) : (
//           <div className="flex flex-wrap gap-6 justify-center">
//             {filteredEmployers.map((employer) => (
//               <div
//                 key={employer._id}
//                 className="bg-gray-800 hover:bg-gray-700 transition-all duration-300 rounded-2xl p-6 shadow-md w-full sm:w-[47%] md:w-[30%] flex flex-col"
//               >
//                 {editingId === employer._id ? (
//                   <>
//                     {["name", "ID", "phone", "line", "Designation"].map(
//                       (field) => (
//                         <input
//                           key={field}
//                           name={field}
//                           value={editedData[field]}
//                           onChange={handleChange}
//                           placeholder={`Enter ${field}`}
//                           className="bg-gray-700 text-white p-2 rounded mb-2 w-full border border-gray-600 focus:ring-2 focus:ring-blue-500"
//                         />
//                       )
//                     )}
//                     <div className="mt-2 flex gap|2">
//                       <button
//                         onClick={handleSave}
//                         className="bg-green-600 hover:bg-green-700 py-2 px-4 rounded font-semibold"
//                       >
//                         Save
//                       </button>
//                       <button
//                         onClick={handleCancel}
//                         className="bg-gray-600 hover:bg-gray-700 py-2 px-4 rounded font-semibold"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </>
//                 ) : (
//                   <>
//                     <h2 className="text-xl font-semibold mb-2">
//                       {employer.name}
//                     </h2>
//                     <p className="text-gray-300">
//                       <span className="font-medium">ID:</span> {employer.ID}
//                     </p>
//                     <p className="text-gray-300">
//                       <span className="font-medium">Phone:</span>{" "}
//                       {employer.phone}
//                     </p>
//                     <p className="text-gray-300">
//                       <span className="font-medium">Line:</span> {employer.line}
//                     </p>
//                     <p className="text-gray-300 mb-4">
//                       <span className="font-medium"> Designation:</span>{" "}
//                       {employer.Designation}
//                     </p>
//                     <div className="mt-auto flex gap-2 flex-wrap">
//                       <Link
//                         to={`/employers/${employer._id}`}
//                         className="bg-purple-600 hover:bg-purple-700 py-2 px-4 rounded font-medium text-center"
//                       >
//                         Details
//                       </Link>
//                       {user?.role === "admin" && (
//                         <>
//                           <button
//                             onClick={() => handleEditClick(employer)}
//                             className="bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded font-medium"
//                           >
//                             Edit
//                           </button>
//                           <button
//                             onClick={() => handleDelete(employer._id)}
//                             className="bg-red-600 hover:bg-red-700 py-2 px-4 rounded font-medium"
//                           >
//                             Delete
//                           </button>
//                         </>
//                       )}
//                     </div>
//                   </>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Employers;













import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { toast } from "react-toastify";
import {
  Search,
  Edit,
  Trash2,
  Eye,
  Save,
  X,
  Users,
  User,
  Phone,
  Hash,
  Briefcase,
  Loader2,
  AlertCircle
} from "lucide-react";

function Employers() {
  const [employers, setEmployers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { auth } = useAuth();
  const { user } = auth;

  useEffect(() => {
    setIsLoading(true);
    fetch(`${import.meta.env.VITE_BASE_URL}/employers`)
      .then((response) => response.json())
      .then((data) => {
        const sortedData = data.sort((a, b) => a.ID - b.ID);
        setEmployers(sortedData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
        toast.error("Failed to load employers");
      });
  }, []);

  const handleDelete = (id, name) => {
    toast.info(
      <div className="p-2">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-900">
              Delete Employer Confirmation
            </p>
            <p className="text-gray-700 mt-1">
              Are you sure you want to delete <strong>{name}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  toast.dismiss();
                  deleteEmployer(id);
                }}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
              >
                <Trash2 size={16} />
                Delete
              </button>
              <button
                onClick={() => toast.dismiss()}
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        className: "!bg-white !text-black !rounded-xl",
      }
    );
  };

  const deleteEmployer = (id) => {
    fetch(`${import.meta.env.VITE_BASE_URL}/employers/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        setEmployers(employers.filter((employer) => employer._id !== id));
        toast.success(
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
              <span className="w-2 h-2 bg-green-600 rounded-full"></span>
            </span>
            Employer deleted successfully!
          </div>
        );
      })
      .catch((error) => {
        console.error(error);
        toast.error(
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            Failed to delete employer
          </div>
        );
      });
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
    fetch(`${import.meta.env.VITE_BASE_URL}/employers/${editingId}`, {
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
        toast.success(
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
              <span className="w-2 h-2 bg-green-600 rounded-full"></span>
            </span>
            Employer updated successfully!
          </div>
        );
      })
      .catch((err) => {
        console.error(err);
        toast.error(
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            Failed to update employer
          </div>
        );
      });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedData({});
  };

  const filteredEmployers = employers.filter(
    (emp) =>
      emp.ID.toString().includes(searchTerm) ||
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.phone.includes(searchTerm) ||
      emp.Designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-white p-4 pt-35">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              All Employers
            </h1>
            <p className="text-gray-400 mt-1">Manage and view all employer records</p>
          </div>

          <div className="flex items-center gap-3 text-lg font-medium bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-xl">
            <Users className="w-5 h-5 text-blue-400" />
            <span className="text-gray-300">Total:</span>
            <span className="text-blue-300 font-bold">{employers.length}</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by ID, Name, Phone, or Designation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800/70 backdrop-blur-sm border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-400 text-lg">Loading employers...</p>
          </div>
        ) : filteredEmployers.length === 0 ? (
          <div className="text-center py-20 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-300 mb-2">No employers found</h3>
            <p className="text-gray-500">
              {searchTerm ? "Try a different search term" : "No employers in the database"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployers.map((employer) => (
              <div
                key={employer._id}
                className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 rounded-2xl p-6 hover:shadow-2xl hover:shadow-blue-900/10 group"
              >
                {editingId === employer._id ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-blue-300 mb-4">Edit Employer</h3>
                    {[
                      { field: "name", label: "Name", icon: User },
                      { field: "ID", label: "ID", icon: Hash },
                      { field: "phone", label: "Phone", icon: Phone },
                      { field: "line", label: "Line", icon: Hash },
                      { field: "Designation", label: "Designation", icon: Briefcase },
                    ].map(({ field, label, icon: Icon }) => (
                      <div key={field}>
                        <label className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                          <Icon className="w-4 h-4" />
                          {label}
                        </label>
                        <input
                          name={field}
                          value={editedData[field] || ""}
                          onChange={handleChange}
                          placeholder={`Enter ${label}`}
                          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={handleSave}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 py-2 px-4 rounded-lg font-medium transition-colors"
                      >
                        <Save size={18} />
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex-1 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded-lg font-medium transition-colors"
                      >
                        <X size={18} />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                          {employer.name}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs font-medium rounded-full">
                            ID: {employer.ID}
                          </span>
                          <span className="px-2 py-1 bg-purple-900/30 text-purple-300 text-xs font-medium rounded-full">
                            {employer.Designation}
                          </span>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-400" />
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-gray-300">
                        <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{employer.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-300">
                        <Hash className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span>Line: {employer.line}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-gray-700/50">
                      <Link
                        to={`/employers/${employer._id}`}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 py-2 px-4 rounded-lg font-medium transition-all hover:scale-[1.02]"
                      >
                        <Eye size={18} />
                        Details
                      </Link>

                      {user?.role === "admin" && (
                        <>
                          <button
                            onClick={() => handleEditClick(employer)}
                            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-2 px-4 rounded-lg font-medium transition-all hover:scale-[1.02]"
                          >
                            <Edit size={18} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(employer._id, employer.name)}
                            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 py-2 px-4 rounded-lg font-medium transition-all hover:scale-[1.02]"
                          >
                            <Trash2 size={18} />
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

        {filteredEmployers.length > 0 && (
          <div className="mt-8 text-center text-gray-500 text-sm">
            Showing {filteredEmployers.length} of {employers.length} employers
            {searchTerm && (
              <span className="text-blue-400 ml-2">
                • Searching for "{searchTerm}"
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Employers;







