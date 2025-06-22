import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Adjust path as needed
import { doLogout } from "../auth"; // Handles logout logic (e.g. clearing token)

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const { isAuthenticated, user, logoutContext } = useAuth();

  const handleLogout = () => {
    doLogout();
    logoutContext(); // update context
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

          <div className="hidden md:flex space-x-4 items-center">
            <NavLink to="/" className={linkClass}>
              Discover
            </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/private/ask-doubt" className={linkClass}>
                  Ask Doubt
                </NavLink>
                <NavLink to="/private/community" className={linkClass}>
                  Community
                </NavLink>
                <NavLink to="/private/quiz-list" className={linkClass}>
                  Quize Me
                </NavLink>
                <NavLink to="/private/user-profile" className={linkClass}>
                  Profile
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:bg-blue-100 px-4 py-2 rounded-md transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={linkClass}>
                  Login
                </NavLink>
                <NavLink to="/register" className={linkClass}>
                  Signup
                </NavLink>
              </>
            )}
          </div>

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

      {isOpen && (
        <div className="md:hidden px-4 pb-3 pt-2 space-y-1 bg-white/90 backdrop-blur-md  shadow-md">
          <NavLink
            to="/"
            className={linkClass}
            onClick={() => setIsOpen(false)}
          >
            Discover
          </NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/private/ask-doubt" className={linkClass}>
                Ask Doubt
              </NavLink>
              <NavLink to="/private/community" className={linkClass}>
                Community
              </NavLink>
              <NavLink to="/private/quiz-list" className={linkClass}>
                Quize Me
              </NavLink>
              <NavLink to="/private/user-profile" className={linkClass}>
                Profile
              </NavLink>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="block w-full text-left text-gray-700 hover:bg-blue-100 px-4 py-2 rounded-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={linkClass}
                onClick={() => setIsOpen(false)}
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={linkClass}
                onClick={() => setIsOpen(false)}
              >
                Signup
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Header;
