import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { doLogout } from "../auth";

// Import Lucide icons
import {
  Home,
  LogIn,
  UserPlus,
  MessageSquare,
  HelpCircle,
  LogOut,
  FileQuestion // Icon for QuizMe
} from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, logoutContext } = useAuth();

  const handleLogout = () => {
    doLogout();
    logoutContext();
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-md transition ${
      isActive
        ? "text-blue-700 font-semibold"
        : "text-gray-700 hover:bg-blue-100"
    }`;

  return (
    <nav className="bg-gradient-to-r from-[#eaf0f9] via-[#d6e6f5] to-[#c4d7e8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="text-xl font-bold text-blue-600 tracking-wide">
            DoubtNest.Ai
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4 items-center">
            {isAuthenticated ? (
              <>
                <NavLink to="/private/ask-doubt" className={linkClass}>
                  <div className="flex items-center gap-2">
                    <HelpCircle size={18} /> Ask Doubt
                  </div>
                </NavLink>
                <NavLink to="/private/community" className={linkClass}>
                  <div className="flex items-center gap-2">
                    <MessageSquare size={18} /> Community
                  </div>
                </NavLink>
                <NavLink to="/private/quizme-display" className={linkClass}>
                  <div className="flex items-center gap-2">
                    <FileQuestion size={18} /> QuizMe
                    <span className="ml-1 px-2 py-0.5 text-xs font-medium bg-yellow-400 text-yellow-900 rounded-full">
                      Pro
                    </span>
                  </div>
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:bg-blue-100 px-4 py-2 rounded-md transition"
                >
                  <div className="flex items-center gap-2">
                    <LogOut size={18} /> Logout
                  </div>
                </button>
              </>
            ) : (
              <>
                <NavLink to="/" className={linkClass}>
                  <div className="flex items-center gap-2">
                    <Home size={18} /> Discover
                  </div>
                </NavLink>
                <NavLink to="/login" className={linkClass}>
                  <div className="flex items-center gap-2">
                    <LogIn size={18} /> Login
                  </div>
                </NavLink>
                <NavLink to="/register" className={linkClass}>
                  <div className="flex items-center gap-2">
                    <UserPlus size={18} /> Signup
                  </div>
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 text-2xl focus:outline-none"
            >
              {isOpen ? "✖" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-3 pt-2 space-y-1 bg-white/90 backdrop-blur-md shadow-md">
          {!isAuthenticated && (
            <NavLink
              to="/"
              className={linkClass}
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center gap-2">
                <Home size={18} /> Discover
              </div>
            </NavLink>
          )}
          {isAuthenticated ? (
            <>
              <NavLink
                to="/private/ask-doubt"
                className={linkClass}
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <HelpCircle size={18} /> Ask Doubt
                </div>
              </NavLink>
              <NavLink
                to="/private/community"
                className={linkClass}
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare size={18} /> Community
                </div>
              </NavLink>
              <NavLink
                to="/private/quizme-display"
                className={linkClass}
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <FileQuestion size={18} /> QuizMe
                  <span className="ml-1 px-2 py-0.5 text-xs font-medium bg-yellow-400 text-yellow-900 rounded-full">
                    Pro
                  </span>
                </div>
              </NavLink>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="block w-full text-left text-gray-700 hover:bg-blue-100 px-4 py-2 rounded-md"
              >
                <div className="flex items-center gap-2">
                  <LogOut size={18} /> Logout
                </div>
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={linkClass}
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <LogIn size={18} /> Login
                </div>
              </NavLink>
              <NavLink
                to="/register"
                className={linkClass}
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <UserPlus size={18} /> Signup
                </div>
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Header;
