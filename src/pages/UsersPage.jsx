import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  // Load all users
  const loadUsers = async () => {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/users`);
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Update user role
  const handleRoleUpdate = async (id, newRole) => {
    await fetch(`${import.meta.env.VITE_BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });

    loadUsers();
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this user?")) return;

    await fetch(`${import.meta.env.VITE_BASE_URL}/users/${id}`, {
      method: "DELETE",
    });

    loadUsers();
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen pt-25">
      <h1 className="text-3xl font-bold mb-6 text-center">Users Management</h1>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Role</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="text-center border-b">
                <td className="p-3 border">{user.name}</td>
                <td className="p-3 border">{user.email}</td>
                <td className="p-3 border">
                  <span
                    className={`px-3 py-1 rounded text-white ${
                      user.role === "admin" ? "bg-green-600" : "bg-blue-600"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>

                <td className="p-3 border space-x-3">
                  <button
                    onClick={() =>
                      handleRoleUpdate(
                        user._id,
                        user.role === "admin" ? "user" : "admin"
                      )
                    }
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    {user.role === "admin" ? "Make User" : "Make Admin"}
                  </button>

                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-600">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white p-4 mb-4 shadow rounded-lg border"
          >
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p className="mt-1">
              <strong>Role:</strong>{" "}
              <span
                className={`px-2 py-1 rounded text-white ${
                  user.role === "admin" ? "bg-green-600" : "bg-blue-600"
                }`}
              >
                {user.role}
              </span>
            </p>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() =>
                  handleRoleUpdate(
                    user._id,
                    user.role === "admin" ? "user" : "admin"
                  )
                }
                className="bg-yellow-500 text-white px-3 py-1 rounded w-full"
              >
                {user.role === "admin" ? "Make User" : "Make Admin"}
              </button>

              <button
                onClick={() => handleDelete(user._id)}
                className="bg-red-600 text-white px-3 py-1 rounded w-full"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {users.length === 0 && (
          <p className="text-center text-gray-600 mt-4">No users found</p>
        )}
      </div>
    </div>
  );
}
