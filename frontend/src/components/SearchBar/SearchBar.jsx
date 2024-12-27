import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoMdClose } from "react-icons/io"; // Add the IoMdClose import

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSearchBar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      className={`flex items-center rounded px-3 py-1 transition-all duration-300 bg-[#414141] ${
        isOpen ? "w-full max-w-md" : "w-10"
      }`}
    >
      {/* Conditional input display */}
      {isOpen && (
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder="Search"
          className="flex-grow text-sm py-[5px] font-normal bg-transparent outline-none placeholder:font-normal placeholder:text-[#eee]"
        />
      )}

      {/* Show close icon when there's content in the input */}
      { (value !== '') ? (
        <IoMdClose
          size={16}
          className="text-[#eee] cursor-pointer hover:text-black"
          onClick={onClearSearch} // Calls onClearSearch to clear the search input
        />
      ) : (<FaSearch
        size={16}
        className="text-[#eee] cursor-pointer hover:text-black"
        onClick={() => {
          if (isOpen) handleSearch(); // Executes the search function when open
          toggleSearchBar(); // Toggles the search bar visibility
        }}
      />)}
      
    </div>
  );
};

export default SearchBar;
