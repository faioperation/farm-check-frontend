import React from "react";
import Breadcrumb from "../../components/Bredcumb";
import Plan from "../../components/Plan";
import { BsWallet2 } from "react-icons/bs";
import Table from "../../components/Table";
import { useQuery, useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Subscription = () => {
  const axiosSecure = useAxiosSecure();

  //  GET PLANS API
  const { data: plans = [], isLoading } = useQuery({
    queryKey: ["subscriptionPlans"],
    queryFn: async () => {
      const res = await axiosSecure.get("/farm-admin/subscription/plans");
      return res.data.data || [];
    },
  });

  // GET CURRENT ACTIVE PLAN
  const { data: currentPlan } = useQuery({
    queryKey: ["currentPlan"],
    queryFn: async () => {
      const res = await axiosSecure.get("/farm-admin/subscription/current");
      return res.data.data || null;
    },
  });

  // HANDLE UPGRADE / SUBSCRIBE
  const checkoutMutation = useMutation({
    mutationFn: ({ planId, priceType }) =>
      axiosSecure.post("/farm-admin/payment/checkout", { planId, priceType }),
    onSuccess: (res) => {
      const link = res.data?.data?.url || res.data?.data?.link || res.data?.url;
      if (link) window.location.href = link;
    },
    onError: (err) => {
      console.error("Checkout error:", err);
    },
  });

  const handleSubscribe = (planId, priceType) => {
    checkoutMutation.mutate({ planId, priceType });
  };

  // loading plan id — only the plan currently being checked out
  const loadingPlanId = checkoutMutation.isPending
    ? checkoutMutation.variables?.planId
    : null;

  // ===== BILLING HISTORY API =====
  const { data: billingHistory = [], isLoading: billingLoading } = useQuery({
    queryKey: ["billingHistory"],
    queryFn: async () => {
      const res = await axiosSecure.get("/farm-admin/subscription/billing-history");
      return res.data.data || [];
    },
  });

  
  const formatDate = (dateStr) =>
    dateStr ? dateStr.split("T")[0].split("-").reverse().join("-") : "—";

  const TableHeads = [
    {
      Title: "Billing Date",
      key: "billingDate",
      width: "20%",
      render: (row) => formatDate(row.billingDate),
    },
    { Title: "Plan", key: "planName", width: "15%" },
    {
      Title: "Amount",
      key: "amount",
      width: "18%",
      render: (row) => `€${row.amount} / ${row.priceType}`,
    },
    {
      Title: "Status",
      key: "status",
      width: "15%",
      render: (row) => {
        const isPaid = row.status?.toLowerCase() === "paid";
        return (
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              isPaid
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {row.status}
          </span>
        );
      },
    },
    {
      Title: "Expire Date",
      key: "endDate",
      width: "17%",
      render: (row) => formatDate(row.endDate),
    },
    {
      Title: "Actions",
      key: "actions",
      width: "15%",
      render: (row) => {
        const isUnpaid = row.status?.toLowerCase() !== "paid";
        const isRenewing =
          checkoutMutation.isPending &&
          checkoutMutation.variables?.planId === row.planId;
        return (
          <div className="flex justify-center">
            {isUnpaid ? (
              <button
                onClick={() =>
                  checkoutMutation.mutate({
                    planId: row.planId,
                    priceType: row.priceType,
                  })
                }
                disabled={isRenewing}
                className="text-[#0A0A0A] cursor-pointer border border-[#0A0A0A]/10 rounded-lg px-4 py-2 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isRenewing ? "Processing…" : "Renew now"}
              </button>
            ) : (
              <span className="text-gray-400">—</span>
            )}
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return <div className="p-10">Loading subscription...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Breadcrumb />
          <p className="text-[#4A5565] text-sm md:text-base mt-1.5">
            Manage your farm's subscription and payment details
          </p>
        </div>

        <div className={`w-max p-2 rounded ${currentPlan?.status !== "ACTIVE" || (currentPlan?.endDate && new Date(currentPlan.endDate) < new Date()) ? "bg-red-100" : "bg-[#FFF6E9]"}`}>
          <p className={`${currentPlan?.status !== "ACTIVE" || (currentPlan?.endDate && new Date(currentPlan.endDate) < new Date()) ? "text-red-700 font-semibold" : "text-[#0A0A0A]"}`}>
            {currentPlan?.status !== "ACTIVE" || (currentPlan?.endDate && new Date(currentPlan.endDate) < new Date()) ? "Expired on : " : "Next renewal date : "}
            {currentPlan?.endDate?.split("T")[0].split("-").reverse().join("-") ?? "—"}
          </p>
        </div>
      </div>

      <Plan
        plans={plans}
        features={currentPlan?.feature || []}
        currentPlanId={currentPlan?.planId}
        isExpiredPlan={
          currentPlan?.status !== "ACTIVE" ||
          (currentPlan?.endDate && new Date(currentPlan.endDate) < new Date())
        }
        currentBillingCycle={currentPlan?.priceType ?? "monthly"}
        onSubscribe={handleSubscribe}
        loadingPlanId={loadingPlanId}
      />

      {/* Billing History */}
      <div>
        <h3 className="text-[#0A0A0A] text-xl mt-10 mb-4">
          Billing History
        </h3>

        <div className="bg-white rounded-lg border-2 border-[#E5E7EB] overflow-x-scroll md:overflow-x-hidden">
          {billingLoading ? (
            <p className="p-6 text-[#4A5565]">Loading billing history...</p>
          ) : billingHistory.length === 0 ? (
            <p className="p-6 text-[#4A5565]">No billing history found.</p>
          ) : (
            <Table
              TableHeads={TableHeads}
              TableRows={billingHistory}
            />
          )}
        </div>
      </div>

    </div>
  );
};

export default Subscription;
