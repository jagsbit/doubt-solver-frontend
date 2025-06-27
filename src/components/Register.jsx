import React, { useState } from "react";
import { Link } from "react-router-dom";
import { signup } from "../services/user-service";
import { toast } from "react-toastify";
import { sendEmail, verifyEmail } from "../services/email-service";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    institution: "",
  });

  const [enteredOtp, setEnteredOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const [error, setError] = useState({
    errors: {},
    isError: false,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const sendOtp = () => {
    setIsSendingOtp(true);
    sendEmail(formData.email)
      .then((data) => {
        toast.success(data);
        setIsOtpSent(true);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to send OTP");
      })
      .finally(() => setIsSendingOtp(false));
  };

  const verifyOtp = () => {
    setIsVerifyingOtp(true);
    verifyEmail(formData.email, enteredOtp)
      .then((data) => {
        if (data === "Email verified successfully!") {
          setIsOtpVerified(true);
          toast.success(data);
        } else toast.error(data);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to verify");
      })
      .finally(() => setIsVerifyingOtp(false));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isOtpVerified) {
      toast.error("Please verify the OTP before registering.");
      return;
    }

    setIsLoading(true);

    signup(formData)
      .then((response) => {
        toast.success("Registration Successful!");
        setFormData({ name: "", email: "", password: "", institution: "" });
        setError({ errors: {}, isError: false });
        setEnteredOtp("");
        setIsOtpSent(false);
        setIsOtpVerified(false);
      })
      .catch((error) => {
        console.error("Error during registration:", error);
        toast.error("Registration failed. Please try again.");
        setError({ errors: error, isError: true });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
          Create an Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error.errors?.response?.data?.name ? "border-red-500" : ""
              }`}
            />
          </div>

          {/* Email + Send OTP */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error.errors?.response?.data?.email ? "border-red-500" : ""
              }`}
            />
            <button
              type="button"
              onClick={sendOtp}
              disabled={isSendingOtp} // prevent double clicks
              className="mt-2 text-sm text-blue-500 hover:underline disabled:opacity-50 flex items-center"
            >
              {isSendingOtp ? (
                <div className="animate-spin h-4 w-4 border-2 border-t-transparent border-blue-500 rounded-full"></div>
              ) : (
                "Send OTP"
              )}
            </button>
          </div>

          {/* OTP Field + Verify Button */}
          {isOtpSent && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Enter OTP
              </label>
              <input
                type="text"
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
                className="mt-1 w-full px-4 py-2 border rounded-md"
              />
              <button
                type="button"
                onClick={verifyOtp}
                disabled={isVerifyingOtp} // prevent double clicks
                className="mt-2 text-sm text-green-600 hover:underline disabled:opacity-50 flex items-center"
              >
                {isVerifyingOtp ? (
                  <div className="animate-spin h-4 w-4 border-2 border-t-transparent border-green-600 rounded-full"></div>
                ) : (
                  "Verify OTP"
                )}
              </button>
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className={`mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error.errors?.response?.data?.password ? "border-red-500" : ""
              }`}
            />
          </div>

          {/* Institution Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Institution Type
            </label>
            <select
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              required
              className={`mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error.errors?.response?.data?.institutionType
                  ? "border-red-500"
                  : ""
              }`}
            >
              <option value="">Select Institution Type</option>
              <option value="school">School</option>
              <option value="college">College</option>
              <option value="others">Others</option>
            </select>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={!isOtpVerified || isLoading}
            className={`w-full py-2 rounded-md transition flex items-center justify-center ${
              isOtpVerified && !isLoading
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <div className="animate-spin h-5 w-5 border-2 border-t-transparent border-white rounded-full"></div>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
