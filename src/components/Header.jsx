import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-800 text-white shadow z-50 py-6">
      <div className="container mx-auto flex items-center justify-between px-6">
        {/* Logo */}
        <h1 className="text-xl md:text-2xl font-bold">LOGO</h1>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <ul className="flex space-x-4 text-xl md:text-xl">
            <li>
              <Link to="/" className="hover:text-blue-400">
                Home
              </Link>
            </li>
            <li>
              <Link to="/employers" className="hover:text-blue-400">
               Employers
              </Link>
            </li>
            <li>
              <Link to="/schedule" className="hover:text-blue-400">
                Schedule
              </Link>
            </li>
            <li>
              <Link to="/addPerson" className="hover:text-blue-400 ">
                Add Person
              </Link>
            </li>
            <li>
              <Link to="/dutyUpdate" className="hover:text-blue-400">
                Duty Update
              </Link>
            </li>
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
        <div className="md:hidden bg-gray-800 px-6 md:px-8 pt-4 ">
          <ul className="flex flex-col gap-4 space-y-3 text-xl">
            <li>
              <Link
                to="/"
                onClick={toggleMobileMenu}
                className="hover:text-blue-400  border-b border-gray-600 block"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="#schedule"
                onClick={toggleMobileMenu}
                className="hover:text-blue-400 border-b border-gray-600 block"
              >
                Schedule
              </Link>
            </li>
            <li>
              <Link
                to="AddPerson"
                onClick={toggleMobileMenu}
                className="hover:text-blue-400 border-b border-gray-600 block "
              >
                Add Person
              </Link>
            </li>
            <li>
              <Link
                to="DutyUpdate"
                onClick={toggleMobileMenu}
                className="hover:text-blue-400 border-b border-gray-600 block"
              >
                Duty Update
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
