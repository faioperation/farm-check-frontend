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

        {/* <button 
        onClick={() => setAddPlan("true")}
        className="bg-[#F6A62D] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#e5942b] cursor-pointer">
          <FaPlus />
          Upload New Plan
        </button> */}
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

      {/* {addPlan === "true" && (
        <div className="fixed inset-0  bg-[#D9D9D9]/80 flex items-center justify-center z-50 ">
          <div className="bg-[#EFEFEF] rounded-3xl  pt-10 pb-10 px-10 w-[40%]">
            <div className="flex  justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#0A0A0A]">
                  Create New Plan
                </h3>
              </div>
              <div className="">
                <FiX
                  onClick={() => setAddPlan(false)}
                  className="w-7 h-7  cursor-pointer text-[#0A0A0A] "
                />
              </div>
            </div>

            <div className="grid grid-cols-12 gap-x-4">
              <InputField
                inputClass={`rounded-lg`}
                label={`Plan Name`}
                placeholder={`e.g., Maintenance`}
                className={`mt-8 col-span-12`}
              />

              <InputField
                inputClass={`rounded-lg`}
                label={`Employee Range`}
                placeholder={`e.g., Maintenance`}
                className={`mt-8 col-span-12`}
              />

              <InputField
                inputClass={`rounded-lg`}
                label={`Monthly Price ($)`}
                placeholder={`e.g., Maintenance`}
                className={`mt-8 col-span-6`}
              />

              <InputField
                inputClass={`rounded-lg`}
                label={`Yearly Price ($)`}
                placeholder={`e.g., Maintenance`}
                className={`mt-8 col-span-6`}
              />

              <InputField
                inputClass={`rounded-lg`}
                label={`Features (one per line)`}
                placeholder={`e.g., Maintenance`}
                className={`mt-8 col-span-12 `}
              />
            </div>

            <div className="flex gap-2 justify-end mt-8 ">
              <button
                onClick={() => setAddPlan(false)}
                className="py-3 px-5 w-full  bg-[#F6A62D] text-white rounded-lg cursor-pointer"
              >
                Add Category
              </button>
              <button
                onClick={() => setAddPlan(false)}
                className="py-3 px-5    border border-[#000000]/10 text-[#0A0A0A] rounded-lg cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default SubscriptionPlans;
