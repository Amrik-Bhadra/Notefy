import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";
import ProfileInfo from "../Cards/ProfileInfo";
import logo from '../../assets/notefy_logo.png'

const Navbar = ({userInfo, onSearch}) => {
  const navigate = useNavigate();
  const onLogout = () => {
    navigate("/login");
  };
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = () => {
    if(searchQuery){
      onSearch(searchQuery);
    }
  }
  const onClearSearch = () => {
    setSearchQuery("");
  }

  return (
    <div className="bg-white flex items-center justify-between px-16 py-2 drop-shadow">
      <h2 className="text-xl font-medium text-black py-2 flex items-center gap-x-2">
        <img src={logo} alt="" className="h-[2rem]"/>
        Notefy</h2>
      <div className="flex items-center gap-x-6">
        <SearchBar
          value={searchQuery}
          onChange={({ target }) => {
            setSearchQuery(target.value);
          }}
          handleSearch={handleSearch}
          onClearSearch={onClearSearch}
        />
        <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
      </div>
    </div>
  );
};

export default Navbar;
