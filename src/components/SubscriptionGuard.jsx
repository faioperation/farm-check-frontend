import { Navigate, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL } from "../config/api";

const SubscriptionGuard = () => {
  const userRole = Cookies.get("userRole");
  const token = Cookies.get("token");
  const isFarmAdmin = userRole === "FARM_ADMIN";
  const toastShown = useRef(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["subscriptionGuard"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/farm-admin/subscription/current`, {
        headers: { authorization: `Bearer ${token}` },
      });
      return res.data.data;
    },
    enabled: isFarmAdmin && !!token,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  // SYSTEM_OWNER — no guard needed
  if (!isFarmAdmin) {
    return <Outlet />;
  }

  // Waiting for subscription check
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#4A5565]">Checking subscription...</p>
      </div>
    );
  }

  // No active subscription → redirect to billing
  // Skip toast on first redirect right after login
  if (isError || data?.status !== "ACTIVE") {
    const isFreshLogin = sessionStorage.getItem("fresh_login") === "1";
    if (isFreshLogin) {
      // First redirect after login — clear flag, no toast
      sessionStorage.removeItem("fresh_login");
    } else if (!toastShown.current) {
      // User manually tried to access a protected page
      toastShown.current = true;
      toast.error("Please upgrade your plan to access this page.", {
        duration: 4000,
      });
    }
    return <Navigate to="/admin/subscription/billing" replace />;
  }

  return <Outlet />;
};

export default SubscriptionGuard;
