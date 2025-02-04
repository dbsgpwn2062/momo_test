"use client";

import React, { useState } from "react";

const LoginPage: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="relative h-screen bg-white px-4">
      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gray-100 shadow-lg p-6 transform ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform`}
      >
        <button
          className="absolute top-4 left-4 text-gray-500 hover:text-gray-800"
          onClick={toggleMenu}
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">Menu</h2>
        <nav>
          <ul className="space-y-4">
            <li>
              <a href="#home" className="text-gray-700 hover:text-purple-500">
                Home
              </a>
            </li>
            <li>
              <a href="#signup" className="text-gray-700 hover:text-purple-500">
                회원가입
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Hamburger Menu Button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleMenu}
          className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-md hover:bg-gray-200"
        >
          <div className="space-y-1">
            <span className="block w-6 h-0.5 bg-gray-600"></span>
            <span className="block w-6 h-0.5 bg-gray-600"></span>
            <span className="block w-6 h-0.5 bg-gray-600"></span>
          </div>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center justify-between w-full max-w-5xl">
          {/* Left Section: Logo and Branding */}
          <div className="flex items-center space-x-6">
            <img
              src="/momo.png"
              alt="Momo Logo"
              className="w-45 h-45"
              style={{ transform: "translateX(-50px)" }}
            />
            <div className="text-center" style={{ transform: "translateX(100px)" }}>
              <h1 className="text-6xl font-bold text-black">momo</h1>
              <span
                className="text-sm font-semibold bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(to right, #6a11cb, #2575fc)",
                }}
              >
                mood movie
              </span>
            </div>
          </div>

          {/* Right Section: Login Card */}
          <div
            className="bg-white p-8 rounded-xl shadow-lg w-96"
            style={{ transform: "translateX(110px)" }}
          >
            <h2 className="text-2xl font-semibold text-gray-900 text-center">Login</h2>
            <p className="text-sm text-gray-500 mb-6 text-center">Glad you're back.!</p>

            {/* Login Form */}
            <form className="flex flex-col space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 rounded-md hover:opacity-90 transition"
              >
                Login
              </button>
            </form>

            {/* Or Section */}
            <div className="flex items-center my-6">
              <div className="border-t border-gray-300 flex-grow"></div>
              <span className="mx-3 text-sm text-gray-500">Or</span>
              <div className="border-t border-gray-300 flex-grow"></div>
            </div>

            {/* Social Login Buttons */}
            <div className="flex justify-center space-x-4">
              <button className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full hover:bg-gray-200">
                <img
                  src="https://w7.pngwing.com/pngs/506/509/png-transparent-google-company-text-logo-thumbnail.png"
                  alt="Google"
                  className="w-6 h-6 object-contain"
                />
              </button>
              <button className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full hover:bg-gray-200">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
                  alt="Facebook"
                  className="w-6 h-6 object-contain"
                />
              </button>
              <button className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full hover:bg-gray-200">
                <img
                  src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                  alt="GitHub"
                  className="w-6 h-6 object-contain"
                />
              </button>
            </div>

            {/* Signup Link */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{" "}
              <span className="text-purple-500 font-semibold cursor-pointer hover:underline">
                Signup
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
