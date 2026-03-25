import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import InputField from "../../components/InputField";
import Password from "../../components/Password";
import Image from "../../components/Image";
import { BASE_URL } from "../../config/api";

const SignUp = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    farmName: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const signUpMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axios.post(`${BASE_URL}/farm-admin/auth/register`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Account created! Please verify your email.");
      localStorage.setItem("pendingVerifyEmail", form.email);
      navigate("/auth/verify/email");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Sign up failed!");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !form.name ||
      !form.email ||
      !form.farmName ||
      !form.password ||
      !form.confirmPassword
    ) {
      return toast.error("All fields are required");
    }
    if (form.password !== form.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    signUpMutation.mutate({
      name: form.name,
      email: form.email,
      farmName: form.farmName,
      password: form.password,
    });
  };

  return (
    <main className="min-h-screen w-full bg-white  flex items-center justify-center">
      <div className="w-full  flex  overflow-hidden  min-h-screen ">
        {/* ── Left orange panel ── */}
        <div className="hidden md:flex flex-col items-center justify-center bg-[#FFC163] w-[40%] rounded-r-[80px] py-16 px-10">
          <Image
            src="/logo.png"
            alt="FarmCheck Logo"
            className="w-40 h-40 object-contain drop-shadow-xl"
            size={300}
          />
        </div>

        {/* ── Right form panel ── */}
        <div className="flex-1 flex items-center justify-center py-12 px-10">
          <form
            onSubmit={handleSubmit}
            className="w-[598px]  flex flex-col gap-5 bg-[#F3F3F3] py-8 px-10 rounded-3xl"
          >
            <h2 className="text-[28px] font-semibold text-[#1A1A1A] text-center mb-2">
              Create Your Business Account
            </h2>

            <InputField
              label="Full Name"
              type="text"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange("name")}
              inputClass="rounded-xl border-2 border-[#5D5D5D]"
            />

            <InputField
              label="Email Address"
              type="email"
              placeholder="Enter your business email"
              value={form.email}
              onChange={handleChange("email")}
              inputClass="rounded-xl border-2 border-[#5D5D5D]"
            />

            <InputField
              label="Business Name"
              type="text"
              placeholder="Enter your farm name"
              value={form.farmName}
              onChange={handleChange("farmName")}
              inputClass="rounded-xl border-2 border-[#5D5D5D]"
            />

            <Password
              label="Create a password"
              placeholder="Must be 8 characters"
              value={form.password}
              onChange={handleChange("password")}
              name="password"
              inputClass="rounded-xl border-2 border-[#5D5D5D]"
            />

            <Password
              label="Confirm password"
              placeholder="Repeat password"
              value={form.confirmPassword}
              onChange={handleChange("confirmPassword")}
              name="confirmPassword"
              inputClass="rounded-xl border-2 border-[#5D5D5D]"
            />

            <button
              type="submit"
              disabled={signUpMutation.isPending}
              className="mt-2 w-full bg-[#F6A62D] hover:bg-[#e5961e] transition-colors text-white font-semibold py-3 rounded-xl text-[16px]"
            >
              {signUpMutation.isPending ? "Creating account..." : "Sign up"}
            </button>

            <p className="text-center text-sm text-[#4A5565]">
              Already have an account?{" "}
              <Link
                to="/auth/login"
                className="text-[#F6A62D] font-medium hover:underline"
              >
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
};

export default SignUp;
