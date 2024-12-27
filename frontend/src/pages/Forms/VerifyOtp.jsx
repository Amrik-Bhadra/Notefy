import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";

const VerifyOtp = () => {
  const [otpDigits, setOtpDigits] = useState(new Array(5).fill(""));
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve email from location.state
  const email = location.state?.email;
  
  const handleChange = (value, index) => {
    if (isNaN(value)) return; // Ensure only numeric input

    const newOtp = [...otpDigits];
    newOtp[index] = value;
    setOtpDigits(newOtp);

    // Move to the next input box automatically
    if (value && index < otpDigits.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleBackspace = (value, index) => {
    if (!value && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otp = otpDigits.join("");
    if (otp.length !== otpDigits.length) {
      toast.error("Please enter the complete OTP.");
      return;
    }

    try {
      const response = await axiosInstance.post("/verify_otp", { otp, email });
      if (response.data && response.data.error === false) {
        localStorage.setItem("token", response.data.accessToken);
        toast.success(response?.data?.message);
        navigate("/");
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-cardbg outline-none w-96 rounded px-10 py-10">
        <h4 className="text-2xl mb-5 text-center text-white">Verify OTP</h4>
        <p className="text-sm text-center mb-5 text-white">
          Enter the 5-digit OTP sent to your email
        </p>
        <div className="flex justify-center gap-x-2 mb-6">
          {otpDigits.map((digit, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) =>
                e.key === "Backspace" && handleBackspace(e.target.value, index)
              }
              className="w-12 h-12 text-center text-lg bg-inputbg text-primary border border-gray-400 rounded"
            />
          ))}
        </div>
        <button onClick={handleVerifyOtp} className="btn-primary w-full mt-3">
          Verify
        </button>
      </div>
    </div>
  );
};

export default VerifyOtp;
