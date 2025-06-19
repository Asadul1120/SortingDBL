export default function AddPerson() {
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const data = {
      name: formData.get("name"),
      ID: formData.get("ID"),
      designation: formData.get("designation"),
      phone: formData.get("phone"),
      line: formData.get("line"),
      group: formData.get("group"),
    };
    

    try {
      const response = await fetch(
        "https://dblsorting.onrender.com/employers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) throw new Error("Failed to add employee");
      alert("✅ Employee added successfully!");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white flex items-center justify-center pt-40 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-lg text-white space-y-5"
      >
        <h2 className="text-2xl font-bold text-center mb-4 text-blue-400">
          Add Employee
        </h2>

        <div>
          <label htmlFor="line" className="block text-sm font-medium mb-1">
            Line:
          </label>
          <select
            name="line"
            id="line"
            className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1/2">Line 1/2</option>
            <option value="3">Line 3</option>
            <option value="5/6">Line 5/6</option>
            <option value="7">Line 7</option>
            <option value="8">Line 8</option>
            <option value="9">Line 9</option>
            <option value="operator">Operator</option>
          </select>
        </div>

        <div>
          <label htmlFor="group" className="block text-sm font-medium mb-1">
            Group:
          </label>
          <select
            name="group"
            id="group"
            className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="A">Group A</option>
            <option value="B">Group B</option>
            <option value="C">Group C</option>
          </select>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name:
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="ID" className="block text-sm font-medium mb-1">
            ID:
          </label>
          <input
            type="text"
            name="ID"
            id="ID"
            required
            className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="designation"
            className="block text-sm font-medium mb-1"
          >
            designation:
          </label>
          <select
            name="designation"
            id="designation"
            className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="helper">Helper</option>
            <option value="sorter">Sorter</option>
            <option value="operator">Operator</option>
          </select>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Phone:
          </label>
          <input
            type="text"
            name="phone"
            id="phone"
            defaultValue="+880"
            className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
