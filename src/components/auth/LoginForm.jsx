"use client";
import React from "react";
import { authClient } from "@/lib/auth-client";

const LoginForm = () => {
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState({
    type: "",
    message: "",
  });

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Function to determine redirect path based on role
  const getRedirectPath = (role) => {
    // Convert to lowercase for case-insensitive comparison
    const userRole = role?.toLowerCase();

    switch (userRole) {
      case "admin":
        return "/dashboard/admin";
      case "customer":
        return "/dashboard/customer";
      case "supplier":
        return "/dashboard/supplier";
      default:
        // Default fallback if role is not recognized
        return "/dashboard";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ type: "", message: "" });

    if (validateForm()) {
      setIsLoading(true);
      try {
        const { data, error } = await authClient.signIn.email({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          console.error("Login error:", error);
          setSubmitStatus({
            type: "error",
            message:
              error.message || "Login failed. Please check your credentials.",
          });
        } else {
          console.log("Login successful:", data);

          // Extract user role from the response
          // Adjust this based on your actual response structure
          const userRole = data?.user?.role || data?.role || "user";

          console.log("User role:", userRole);

          setSubmitStatus({
            type: "success",
            message: `Login successful! Redirecting to ${userRole} dashboard...`,
          });

          // Reset form
          setFormData({
            email: "",
            password: "",
          });

          // Get redirect path based on role
          const redirectPath = getRedirectPath(userRole);

          // Redirect to role-based dashboard
          setTimeout(() => {
            window.location.href = redirectPath;
          }, 2000);
        }
      } catch (error) {
        console.error("Login error:", error);
        setSubmitStatus({
          type: "error",
          message: "Network error. Please check your connection.",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-15">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Welcome Back
        </h2>

        {/* Status Messages */}
        {submitStatus.message && (
          <div
            className={`mb-4 p-3 rounded-lg ${
              submitStatus.type === "success"
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-red-100 text-red-700 border border-red-200"
            }`}
          >
            {submitStatus.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register Link */}
        <p className="text-sm text-center mt-6 text-gray-600">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
