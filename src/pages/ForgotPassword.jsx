import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Smartphone, Lock, KeyRound } from "lucide-react";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    emailOrMobile: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (step === 1 && formData.emailOrMobile) {
      // Simulate sending OTP
      console.log("Sending OTP to:", formData.emailOrMobile);
      setStep(2);
    } else if (step === 2 && formData.otp) {
      // Simulate OTP verification
      console.log("Verifying OTP:", formData.otp);
      setStep(3);
    } else if (step === 3 && formData.password && formData.password === formData.confirmPassword) {
      // Simulate password reset
      console.log("Password reset successful:", formData.password);
      alert("Password reset successful!");
      setStep(1);
      setFormData({ emailOrMobile: "", otp: "", password: "", confirmPassword: "" });
    } else {
      alert("Please fill in all fields correctly.");
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          {step === 1 && "Forgot Password"}
          {step === 2 && "Verify OTP"}
          {step === 3 && "Reset Password"}
        </h2>

        {step === 1 && (
          <div>
            <label className="block mb-2 text-gray-600 font-medium">Email or Mobile</label>
            <div className="flex items-center border rounded-lg px-3 py-2">
              <Mail className="text-gray-400 mr-2" size={18} />
              <input
                type="text"
                name="emailOrMobile"
                placeholder="Enter email or mobile number"
                value={formData.emailOrMobile}
                onChange={handleChange}
                className="w-full outline-none text-gray-700"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <label className="block mb-2 text-gray-600 font-medium">Enter OTP</label>
            <div className="flex items-center border rounded-lg px-3 py-2">
              <Smartphone className="text-gray-400 mr-2" size={18} />
              <input
                type="text"
                name="otp"
                placeholder="Enter the OTP sent to your number"
                value={formData.otp}
                onChange={handleChange}
                className="w-full outline-none text-gray-700"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <>
            <div className="mb-4">
              <label className="block mb-2 text-gray-600 font-medium">New Password</label>
              <div className="flex items-center border rounded-lg px-3 py-2">
                <Lock className="text-gray-400 mr-2" size={18} />
                <input
                  type="password"
                  name="password"
                  placeholder="Enter new password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full outline-none text-gray-700"
                />
              </div>
            </div>
            <div>
              <label className="block mb-2 text-gray-600 font-medium">Confirm Password</label>
              <div className="flex items-center border rounded-lg px-3 py-2">
                <KeyRound className="text-gray-400 mr-2" size={18} />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full outline-none text-gray-700"
                />
              </div>
            </div>
          </>
        )}

        <div className="flex justify-between items-center mt-8">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="px-5 py-2 bg-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-400 transition"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            {step === 3 ? "Reset Password" : "Next"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
