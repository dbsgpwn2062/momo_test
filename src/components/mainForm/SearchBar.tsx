import React from "react";

const SearchBar: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-full">
      <input
        type="text"
        placeholder="Search..."
        className="border rounded-l-full px-4 py-2 w-3/4 focus:outline-none"
      />
      <button className="bg-black text-white px-4 py-2 rounded-r-full">
        GO
      </button>
    </div>
  );
};

export default SearchBar;
