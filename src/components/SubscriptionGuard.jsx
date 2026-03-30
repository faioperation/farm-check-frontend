import { Navigate, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL } from "../config/api";

const SubscriptionGuard = () => {
  const userRole = Cookies.get("userRole");
  const token = Cookies.get("token");
  const isFarmAdmin = userRole === "FARM_ADMIN";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["subscriptionGuard"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/farm-admin/subscription/current`, {
        headers: { authorization: `Bearer ${token}` },
      });
      console.log("[SubscriptionGuard] subscription:", res.data.data);
      return res.data.data;
    },
    enabled: isFarmAdmin && !!token,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  // SYSTEM_OWNER — no guard
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

  // Error fetching subscription or subscription not active → go to billing
  if (isError || data?.status !== "ACTIVE") {
    console.warn("[SubscriptionGuard] No active subscription, redirecting to billing.");
    return <Navigate to="/admin/subscription/billing" replace />;
  }

  return <Outlet />;
};

export default SubscriptionGuard;

