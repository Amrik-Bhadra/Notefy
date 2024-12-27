import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const togglePassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  return (
    <div className="flex items-center bg-transparent px-5 rounded mb-3 bg-formInput">
      <input
        type={isShowPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full text-sm bg-transparent py-3 mr-3 rounded border-none outline-none placeholder:text-[#eee] text-white"
      />

      {isShowPassword ? (
        <FaRegEye
          size={22}
          className="text-white cursor-pointer"
          onClick={() => {
            togglePassword();
          }}
        />
      ) : (
        <FaRegEyeSlash
          size={22}
          className="text-white cursor-pointer"
          onClick={() => {
            togglePassword();
          }}
        />
      )}
    </div>
  );
};

export default PasswordInput;
