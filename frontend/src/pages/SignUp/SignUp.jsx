import React, { useState } from "react";
import PasswordInput from "../../components/Input/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import logo from '../../assets/notefy_logo.png'

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (name === "") {
      toast.error("Name field not filled!");
    } else if (email === "") {
      toast.error("Email field not filled!");
    } else if (password === "") {
      toast.error("Password field not filled!");
    } else {
      // check if email is valid or not
      if (!validateEmail(email)) {
        // setError("Please enter a valid email address");
        toast.error("Enter valid Email ID");
        return;
      } else {
        if (confirmPassword !== password) {
          toast.error("Passwords doesnot match!!");
          return;
        }
        // signup API
        // console.log('i am here');
        try {
          // console.log('inside try');
          const response = await axiosInstance.post("/create_account", {
            name,
            email,
            password,
          });

          console.log(response.data);

          if (response?.data && response?.data?.accessToken) {
            localStorage.setItem("token", response?.data?.accessToken);
            toast.success(response?.data?.message);
            navigate("/login");
          }
        } catch (error) {
          toast.error(error.response?.data?.message);
        }
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex items-center justify-center">
        <div className="w-96 rounded bg-cardbg px-7 py-10">
          <div className="flex justify-center items-center gap-x-2 mb-6">
            <img src={logo} alt="" className="h-[2rem]" />
            <h1 className="font-semibold text-xl text-white">Notefy</h1>
          </div>
          <form onSubmit={handleSignUp}>
            <h4 className="text-2xl mb-7 text-center text-white">Sign Up</h4>

            {/* Name input */}
            <input
              type="text"
              placeholder="Name"
              className="input-box"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />

            {/* email input */}
            <input
              type="email"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />

            {/* password input */}
            <PasswordInput
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="Password"
            />

            {/* Confirm password input */}
            <PasswordInput
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              placeholder="Confirm Password"
            />

            <button type="submit" className="btn-primary">
              Create Account
            </button>
            <p className="text-sm text-center mt-4 text-white flex justify-center gap-x-3">
              <span>Already have account? </span>
              <Link to="/login" className="font-medium text-primary underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
