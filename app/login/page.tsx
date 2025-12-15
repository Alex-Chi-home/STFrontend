"use client";

import { useState } from "react";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { loginSchema, registerSchema } from "@/lib/models";

interface FormErrors {
  email?: string;
  password?: string;
  username?: string;
  server?: string;
}

const ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined, server: undefined }));
  };

  const validateForm = () => {
    try {
      const schema = isLogin ? loginSchema : registerSchema;
      schema.parse(formData);
      return true;
    } catch (e) {
      if (e instanceof z.ZodError) {
        const fieldErrors: FormErrors = {};
        e.errors.forEach((err) => {
          const path = err.path[0] as keyof FormErrors;
          fieldErrors[path] = err.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      setIsSuccess(true);
    } catch {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ email: "", password: "", username: "" });
    setErrors({});
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#E6F0FA] to-[#B3D4FC] p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={ANIMATION_VARIANTS}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
      >
        <h2 className="text-2xl font-bold text-center text-[#1A73E8] mb-6">
          {isLogin ? "Welcome Back" : "Join Us"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                key="username"
                variants={ANIMATION_VARIANTS}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={cn(
                    "mt-1 block w-full rounded-lg border px-4 py-3 text-gray-900 focus:ring-2 focus:ring-[#1A73E8] transition-all",
                    errors.username ? "border-red-300" : "border-gray-300"
                  )}
                  placeholder="Enter your username"
                  aria-invalid={!!errors.username}
                  aria-describedby={
                    errors.username ? "username-error" : undefined
                  }
                  required={!isLogin}
                />
                {errors.username && (
                  <p id="username-error" className="mt-1 text-sm text-red-500">
                    {errors.username}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className={cn(
                "mt-1 block w-full rounded-lg border px-4 py-3 text-gray-900 focus:ring-2 focus:ring-[#1A73E8] transition-all",
                errors.email ? "border-red-300" : "border-gray-300"
              )}
              placeholder="Enter your email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              required
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-500">
                {errors.email}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              className={cn(
                "mt-1 block w-full rounded-lg border px-4 py-3 text-gray-900 focus:ring-2 focus:ring-[#1A73E8] transition-all",
                errors.password ? "border-red-300" : "border-gray-300"
              )}
              placeholder="Enter your password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              required
            />
            {errors.password && (
              <p id="password-error" className="mt-1 text-sm text-red-500">
                {errors.password}
              </p>
            )}
          </div>
          {errors.server && (
            <p className="text-sm text-red-500 text-center">{errors.server}</p>
          )}
          {isSuccess && (
            <p className="text-sm text-green-500 text-center">
              {isLogin ? "Logged in!" : "Registered!"} Redirecting...
            </p>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "w-full bg-[#1A73E8] text-white py-3 px-4 rounded-lg hover:bg-[#1557B0] transition-all flex items-center justify-center",
              isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            )}
            aria-label={isLogin ? "Log in" : "Sign up"}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            ) : null}
            {isLoading ? "Processing..." : isLogin ? "Log In" : "Sign Up"}
          </button>
          <button
            type="button"
            onClick={toggleMode}
            className="w-full text-[#1A73E8] text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-[#1A73E8] rounded"
            aria-label={`Switch to ${isLogin ? "sign up" : "log in"}`}
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Log In"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
