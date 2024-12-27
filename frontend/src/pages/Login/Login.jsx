import React, { useState } from "react";
import PasswordInput from "../../components/Input/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import logo from '../../assets/notefy_logo.png'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error(email ? "Password field not filled!" : "Email field not filled!");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Enter a valid Email ID");
      return;
    }

    //login api
    try {      
      const response = await axiosInstance.post("/login", {
        email,
        password
      });

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unexpected Error occurred during login");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex items-center justify-center">
        <div className="bg-cardbg outline-none w-96 rounded px-10 py-10">
          <div className="flex justify-center items-center gap-x-2 mb-6">
            <img src={logo} alt="" className="h-[2rem]"/>
            <h1 className="font-semibold text-xl text-white">Notefy</h1>
          </div>
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl mb-7 text-center text-white">Login</h4>

            {/* email input */}
            <input
              type="email"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* password input */}
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />

            <button type="submit" className="btn-primary mt-3">
              Login
            </button>
            <p className="text-sm text-center mt-4 text-white flex gap-x-2 justify-center">
              <span>Don't Have Account?{" "}</span>
              <Link to="/signup" className="font-medium text-primary underline">
                SignUp
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
