"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import { loginUser } from "@/services/auth"; // ✅ 로그인 API 추가

const LoginPage: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await loginUser(username, password);

    if (res) {
      alert("로그인 성공!");
      console.log("로그인 응답:", res);
      // ✅ 로그인 성공 시 페이지 이동 가능 (필요 시 추가)
    } else {
      alert("로그인 실패! 아이디 또는 비밀번호를 확인하세요.");
    }
  };

  return (
    <div
      className={`relative h-screen bg-cover bg-center px-4 transform ${
        menuOpen ? "translate-x-0" : "translate-x-0"
      } transition-transform`}
      style={{
        backgroundImage: `url('/unicorn-pastel-phone-wallpaper-background.jpg')`,
      }}
    >
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-100 shadow-lg p-6 transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform`}
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          onClick={toggleMenu}
        >
          ✕
        </button>
        <h2 className="text-xl font-bold ml-5 mb-4">Menu</h2>
        <nav>
          <ul className="space-y-4">
            <li>
              <a
                href="#home"
                className="text-gray-700 ml-5 hover:text-purple-500"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#signup"
                className="text-gray-700 ml-5 hover:text-purple-500"
              >
                회원가입
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Hamburger Menu Button */}
      <div className="absolute top-4 left-0">
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
              style={{ transform: "translateX(130px)" }}
            />
          </div>

          {/* Right Section: Login Card */}
          <div
            className="bg-white p-20 rounded-xl shadow-lg w-45"
            style={{ transform: "translateX(100px)" }}
          >
            <h2 className="text-2xl font-semibold text-gray-900 text-center">
              Login
            </h2>
            <p className="text-sm text-gray-500 mb-6 text-center">
              Glad you're back.!
            </p>

            {/* Login Form */}
            <form className="flex flex-col space-y-4" onSubmit={handleLogin}>
              <div>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              {/* ✅ 로그인 버튼 (API 요청 추가됨) */}
              <Button
                text="Login"
                type="submit"
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:opacity-90 transition"
              />
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
