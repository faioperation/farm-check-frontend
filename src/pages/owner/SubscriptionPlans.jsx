import React, { useState } from "react";
import Breadcrumb from "../../components/Bredcumb";
import { Link } from "react-router-dom";

import { FaPlus } from "react-icons/fa6";
import ManagePlan from "../../components/ManagePlan";
import { FiX } from "react-icons/fi";
import InputField from "../../components/InputField";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const SubscriptionPlans = () => {
  const [addPlan, setAddPlan] = useState("false");
  const axiosSecure = useAxiosSecure();

  const {
    data: plans = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const res = await axiosSecure.get("/system-owner/plan");
      return res.data.data.plans;
    },
  });

  if (isLoading) {
    return <div className="p-10">Loading plans...</div>;
  }

  if (isError) {
    return <div className="p-10 text-red-500">Failed to load plans</div>;
  }

  const activePlansCount = plans.filter((plan) => plan.isActive).length;
  const trialDays = plans.length > 0 ? plans[0].trialDays : 14;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <Breadcrumb />
          <p className="text-[#4A5565] text-sm md:text-base mt-1.5">
            Manage all SOP documents in one place
          </p>
        </div>

       
      </div>

      <div className="bg-white p-6 rounded-lg border-2 border-[#E5E7EB] my-6">
        <p className="text-[#0A0A0A] text-xl mb-4">Pricing Model</p>

        <div className="grid grid-cols-12 gap-6">
          <div className="bg-white p-6 rounded-lg border-2 border-[#E5E7EB] col-span-12 md:col-span-4">
            <p className="text-sm text-[#4A5565]">Pricing Based On</p>
            <p className="text-[#0A0A0A] text-lg mt-2">Employee Count</p>
          </div>

          <div className="bg-white p-6 rounded-lg border-2 border-[#E5E7EB] col-span-12  md:col-span-4">
            <p className="text-sm text-[#4A5565]">Default Trial Period</p>
            <p className="text-[#0A0A0A] text-lg mt-2">{trialDays}</p>
          </div>

          <div className="bg-white p-6 rounded-lg border-2 border-[#E5E7EB] col-span-12  md:col-span-4">
            <p className="text-sm text-[#4A5565]">Total Active Plans</p>
            <p className="text-[#0A0A0A] text-lg mt-2">{activePlansCount}</p>
          </div>
        </div>
      </div>

      <ManagePlan plans={plans} />

      
    </div>
  );
};

export default SubscriptionPlans;
