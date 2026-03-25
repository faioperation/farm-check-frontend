import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "../../components/Image";
import InputField from "../../components/InputField";
import { BASE_URL } from "../../config/api";
import { FaArrowLeft } from "react-icons/fa";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const inputs = useRef([]);

  const [step, setStep] = useState("email"); // "email" | "otp"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  // Pre-fill email from localStorage if available (set after sign up)
  useEffect(() => {
    const stored = localStorage.getItem("pendingVerifyEmail");
    if (stored) {
      setEmail(stored);
    }
  }, []);

  // ── Step 1: Send / Resend OTP ──────────────────────────────────────────────
  const sendOtpMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(`${BASE_URL}/farm-admin/auth/resend-otp`, {
        email,
      });
      return res.data;
    },
    onSuccess: () => {
      localStorage.setItem("pendingVerifyEmail", email);
      toast.success("OTP sent to your email!");
      setStep("otp");
      setOtp(["", "", "", "", "", ""]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    },
  });

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");
    sendOtpMutation.mutate();
  };

  // ── Step 2: Verify OTP ─────────────────────────────────────────────────────
  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      const fullOtp = otp.join("");
      const res = await axios.post(
        `${BASE_URL}/farm-admin/auth/verify-registration`,
        { email, otp: fullOtp }
      );
      return res.data;
    },
    onSuccess: () => {
      localStorage.removeItem("pendingVerifyEmail");
      toast.success("Email verified successfully!");
      navigate("/auth/login");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Invalid OTP");
    },
  });

  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) {
      return toast.error("Please enter the full 6-digit OTP");
    }
    verifyOtpMutation.mutate();
  };

  // ── UI ─────────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen w-full bg-white flex items-center justify-center">
      <div className="w-full flex overflow-hidden min-h-screen">
        {/* Left orange panel */}
        <div className="hidden md:flex flex-col items-center justify-center bg-[#FFC163] w-[40%] rounded-r-[80px] py-16 px-10">
          <Image
            src="/logo.png"
            alt="FarmCheck Logo"
            className="w-40 h-40 object-contain drop-shadow-xl"
            size={300}
          />
        </div>

        {/* Right panel */}
        <div className="flex-1 flex items-center justify-center py-12 px-10">
          {step === "email" ? (
            /* ── Email Step ── */
            <form
              onSubmit={handleSendOtp}
              className="w-[598px] flex flex-col gap-5 bg-[#F3F3F3] py-8 px-10 rounded-3xl"
            >
              <h2 className="text-[28px] font-semibold text-[#1A1A1A] text-center mb-2">
                Verify Your Email
              </h2>
              <p className="text-center text-sm text-[#4A5565] -mt-3">
                Enter the email address you registered with and we'll send you a
                verification code.
              </p>

              <InputField
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                inputClass="rounded-xl border-2 border-[#5D5D5D]"
              />

              <button
                type="submit"
                disabled={sendOtpMutation.isPending}
                className="mt-2 w-full bg-[#F6A62D] hover:bg-[#e5961e] transition-colors text-white font-semibold py-3 rounded-xl text-[16px]"
              >
                {sendOtpMutation.isPending ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          ) : (
            /* ── OTP Step ── */
            <form
              onSubmit={handleVerifyOtp}
              className="w-[598px] flex flex-col gap-5 bg-[#F3F3F3] py-8 px-10 rounded-3xl items-center"
            >
              <h2 className="text-[28px] font-semibold text-[#1A1A1A] text-center mb-1">
                Enter OTP
              </h2>
              <p className="text-center text-sm text-[#4A5565]">
                A 6-digit code was sent to{" "}
                <span className="font-medium text-[#1A1A1A]">{email}</span>
              </p>

              <div className="flex gap-4 justify-center my-6">
                {[...Array(6)].map((_, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength={1}
                    ref={(el) => (inputs.current[i] = el)}
                    onChange={(e) => handleOtpChange(e, i)}
                    onKeyDown={(e) => handleOtpKeyDown(e, i)}
                    value={otp[i]}
                    className="w-[47px] h-[49px] border border-[#F6A62D] rounded-[10px] text-center text-xl font-bold text-[#F6A62D] outline-none bg-white"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={verifyOtpMutation.isPending}
                className="w-full bg-[#F6A62D] hover:bg-[#e5961e] transition-colors text-white font-semibold py-3 rounded-xl text-[16px]"
              >
                {verifyOtpMutation.isPending ? "Verifying..." : "Verify"}
              </button>

              <button
                type="button"
                onClick={() => sendOtpMutation.mutate()}
                disabled={sendOtpMutation.isPending}
                className="text-sm text-[#F6A62D] hover:underline"
              >
                {sendOtpMutation.isPending ? "Resending..." : "Resend OTP"}
              </button>

              <button
                type="button"
                onClick={() => setStep("email")}
                className="text-sm text-[#4A5565] flex items-center gap-1"
              >
                <FaArrowLeft/> Change email
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
};

export default VerifyEmail;
