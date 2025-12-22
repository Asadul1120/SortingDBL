import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import LOGO from "../assets/DblLogo.png";
import {
  Menu,
  X,
  Home,
  Users,
  Clock,
  UserPlus,
  Calendar,
  LogOut,
  LogIn,
  User as UserIcon,
  Shield,
  Package,
  BarChart3,
  ChevronRight,
  Bell,
  Settings,
  Moon,
  Sun,
  Search,
  Filter,
} from "lucide-react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth({ user: null, token: "" });
    navigate("/login");
    setIsMobileMenuOpen(false);
    setShowUserMenu(false);
  };

  const navigationItems = [
    { path: "/", label: "Home", icon: Home, show: true },
    { path: "/employers", label: "Employers", icon: Users, show: true },
    { path: "/shiftChange", label: "Shift Change", icon: Clock, show: true },
    {
      path: "/addPerson",
      label: "Add Person",
      icon: UserPlus,
      show: auth?.user?.role === "admin",
    },
    {
      path: "/dutyUpdate",
      label: "Duty Update",
      icon: Calendar,
      show: auth?.user?.role === "admin",
    },
  ];

  const isActive = (path) => location.pathname === path;

  const renderDesktopNav = () => (
    <nav className="hidden lg:flex items-center space-x-2">
      {navigationItems.map(
        (item) =>
          item.show && (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive(item.path)
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
      )}
    </nav>
  );

  const renderMobileNav = () => (
    <div className="lg:hidden bg-gray-800/95 backdrop-blur-sm border-t border-gray-700">
      <div className="px-4 py-3">
        <div className="flex flex-col gap-2">
          {navigationItems.map(
            (item) =>
              item.show && (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={toggleMobileMenu}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                    isActive(item.path)
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )
          )}
        </div>
      </div>
    </div>
  );

  const renderUserMenu = () => (
    <div className="relative">
      <button
        onClick={() => setShowUserMenu(!showUserMenu)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <UserIcon className="w-4 h-4 text-white" />
          </div>
          <div className="text-left hidden lg:block">
            <p className="text-sm font-medium text-white">
              {auth.user?.name || auth.user?.role}
            </p>
            <p className="text-xs text-gray-400 capitalize">
              {auth.user?.role}
            </p>
          </div>
        </div>
      </button>

      {showUserMenu && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-700">
            <p className="text-sm font-medium text-white">
              {auth.user?.name || "User"}
            </p>
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              {auth.user?.role}
            </p>
          </div>

          <div className="py-2">
            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors"
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-4 h-4" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>

            {auth.user?.role === "admin" && (
              <Link
                to="/admin"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Admin Panel</span>
              </Link>
            )}
          </div>

          <div className="border-t border-gray-700 pt-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900/95 backdrop-blur-sm border-b border-gray-800/50 shadow-2xl z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </button>

            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500/30">
                <img
                  src={LOGO}
                  alt="DBL Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="">
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  DBL Sorting & Packing
                </h1>
                <p className="text-xs text-gray-400">Management System</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {renderDesktopNav()}

          {/* User Actions */}
          <div className="flex items-center gap-3">
            {auth?.token ? (
              <>
                {/* Notifications */}
                <button className="relative p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
                  <Bell className="w-5 h-5 text-gray-400" />
                  {/* <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span> */}
                </button>

                {/* User Menu */}
                {renderUserMenu()}
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span className="">Login</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            {renderMobileNav()}

            {/* Mobile User Info */}
            {auth?.token && (
              <div className="px-4 py-3 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        {auth.user?.name || "User"}
                      </p>
                      <p className="text-sm text-gray-400 flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        {auth.user?.role}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg bg-red-900/30 hover:bg-red-800/40 text-red-400 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Active Page Indicator */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50" />
    </header>
  );
};

export default Header;
