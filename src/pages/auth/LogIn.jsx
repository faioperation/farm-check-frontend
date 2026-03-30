import React, { useState } from "react";
import InputField from "../../components/InputField";
import Password from "../../components/Password";
import Image from "../../components/Image";
import { MdLogin } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL } from "../../config/api";


const LogIn = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("SYSTEM_OWNER");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const roleText = {
    FARM_ADMIN: {
      title: "Farm Admin",
      Subtitle: "Access your farm management dashboard",
      redirect: "/admin/home",
    },
    SYSTEM_OWNER: {
      title: "System Owner",
      Subtitle: "Secure access to farm management platform",
      redirect: "/owner/dashboard",
    },
  };

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const res = await axios.post(
        `${BASE_URL}/auth/login`,
        credentials
      );
      return res.data;
    },

    onSuccess: (response) => {
      const userData = response.data;
      const userRole = userData.user.role;

      if (userRole !== role) {
        toast.error(`Access denied! You are not logging in as a ${role.replace("_", " ")}.`);
        return;
      }

      // Save tokens
      Cookies.set("token", userData.accessToken);
      Cookies.set("refreshToken", userData.refreshToken);
      Cookies.set("userRole", userRole);
      Cookies.set("userName", userData.user.name);


      toast.success("Logged in successfully!");

      // Flag so SubscriptionGuard skips toast on first redirect after login
      sessionStorage.setItem("fresh_login", "1");

      // Redirect based on backend role
      setTimeout(() => {
        if (userRole === "SYSTEM_OWNER") {
          navigate("/owner/dashboard");
        } else if (userRole === "FARM_ADMIN") {
          navigate("/admin/home");
        }
      }, 500);
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Login failed!"
      );
    },
  });

  const handleLogin = () => {
    if (!email || !password) {
      return toast.error("All fields are required");
    }

    // Only send email & password
    loginMutation.mutate({
      email,
      password,
    });
  };


  return (
    <main className="bg-white grid justify-center items-center py-10 md:px-11 px-15 rounded-3xl">
      <form className="gap-5 flex flex-col items-center md:w-[450px] w-full" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
        <Image src="/authLogo.png" alt="logo" />

        <h3 className="text-[32px] font-medium">
          {roleText[role].title} Login
        </h3>

        <p className="text-[#4A5565]">
          {roleText[role].Subtitle}
        </p>



        <InputField
          type="email"
          label="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          inputClass="rounded-lg"
        />

        <Password
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          inputClass="rounded-lg"
        />

        <div className="flex justify-between w-full">

          {role === "FARM_ADMIN" && (
            <Link to='/auth/signup'>
              <span className="text-[#F6A62D] text-sm">
                Don't have an account? Sign Up
              </span>
            </Link>
          )}

          <Link
            to="/auth/reset/password"
            className="text-[#F6A62D] self-end text-sm ml-auto"
          >
            Forgot Password?
          </Link>
        </div>

        {/* ROLE SWITCH (UI Only) */}
        <div className="flex gap-5 w-full">
          {["SYSTEM_OWNER", "FARM_ADMIN"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 py-2 rounded-lg ${role === r
                  ? "bg-[#F6A62D] text-white"
                  : "bg-[#F1F5F9]"
                }`}
            >
              {r}
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="bg-[#F6A62D] text-white w-full py-3 rounded-lg mt-6 flex items-center justify-center gap-2"
        >
          {loginMutation.isPending ? (
            "Logging in..."
          ) : (
            <>
              <MdLogin />
              Login
            </>
          )}
        </button>
      </form>
    </main>
  );
};

export default LogIn;
