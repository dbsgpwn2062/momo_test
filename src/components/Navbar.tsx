import React from "react";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex justify-between">
        <li className="font-semibold"> </li>
        <li>
          <a href="/login" className="hover:underline">
           
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
