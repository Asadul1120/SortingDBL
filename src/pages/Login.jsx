
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";





function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { auth, setAuth } = useAuth();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        setLoading(true);
        const response = await fetch(
          "https://dblsorting.onrender.com/users/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        const data = await response.json();

        if (response.ok && data.token) {
          alert("Login successful!");
          // console.log(data);
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user)); // optional
          setAuth({ user: data.user, token: data.token });
          navigate("/");
        } else {
          setErrors({ general: data.message || "Login failed" });
        }
      } catch (error) {
        console.error("Error:", error);
        setErrors({ general: "Something went wrong. Try again later." });
      } finally {
        setLoading(false);
      }
    }
  };
  console.log(auth.user?.role);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 pt-33 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 text-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && (
            <p className="text-red-400 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {errors.general && (
          <p className="text-red-400 text-sm mb-4 text-center">
            {errors.general}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white py-2 rounded-lg font-semibold transition duration-300`}
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        <p className="text-sm text-center text-gray-400 mt-4">
          Don't have an account?{" "}
          <a href="/signUp" className="text-blue-400 hover:underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}

export default Login;
