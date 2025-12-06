import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import LOGO from "../assets/DblLogo.png";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth({ user: null, token: "" });
    navigate("/login");
  };

  const renderLinks = (isMobile = false) => (
    <>
      <li>
        <Link className="text-sm text-blue-300 italic"
        to="/admin"
        onClick={isMobile ? toggleMobileMenu : undefined}
        >
          👤 {auth.user?.role}
        
        </Link>
      </li>
      <li>
        <Link
          to="/"
          onClick={isMobile ? toggleMobileMenu : undefined}
          className="hover:text-blue-400"
        >
          Home
        </Link>
      </li>
      <li>
        <Link
          to="/employers"
          onClick={isMobile ? toggleMobileMenu : undefined}
          className="hover:text-blue-400"
        >
          Employers
        </Link>
      </li>
      <li>
        <Link
          to="/schedule"
          onClick={isMobile ? toggleMobileMenu : undefined}
          className="hover:text-blue-400"
        >
          Schedule
        </Link>
      </li>

      {auth?.token ? (
        <>
          {auth.user?.role === "admin" && (
            <>
              <li>
                <Link
                  to="/addPerson"
                  onClick={isMobile ? toggleMobileMenu : undefined}
                  className="hover:text-blue-400"
                >
                  Add Person
                </Link>
              </li>
              <li>
                <Link
                  to="/dutyUpdate"
                  onClick={isMobile ? toggleMobileMenu : undefined}
                  className="hover:text-blue-400"
                >
                  Duty Update
                </Link>
              </li>
            </>
          )}
          <li>
            <button
              onClick={() => {
                if (isMobile) toggleMobileMenu();
                handleLogout();
              }}
              className="hover:text-red-400"
            >
              Logout
            </button>
          </li>
        </>
      ) : (
        <li>
          <Link
            to="/login"
            onClick={isMobile ? toggleMobileMenu : undefined}
            className="hover:text-blue-400"
          >
            Login
          </Link>
        </li>
      )}
    </>
  );

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-800 text-white shadow z-50 py-6">
      <div className="container mx-auto flex items-center justify-between px-6">

        {/* Logo */}  
        <img src={LOGO} className="w-15 rounded-full" alt="logo" />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <ul className="flex space-x-4 text-xl items-center">
            {renderLinks(false)}
          </ul>
        </nav>

        {/* Mobile Nav Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-white text-2xl focus:outline-none"
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 px-6 pt-4">
          <ul className="flex flex-col gap-4 text-xl border-t border-gray-600 pt-2">
            {renderLinks(true)}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
