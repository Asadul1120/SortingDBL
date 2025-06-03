import { useState, useEffect } from "react";
import TableComponent from "../components/TableComponent";

function HomePage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("https://dblsorting.onrender.com/employers/today")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => {
        console.error("Failed to fetch users:", error);
      });
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="max-w-6xl mx-auto px-4 py-10 pt-20">
        {users.length > 0 ? (
          <TableComponent employees={users} />
        ) : (
          <p className="text-center text-lg font-medium">Loading...</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;
