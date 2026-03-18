"use client";

import React, { useState } from "react";
import ToggleButton from "./ToggleButton";

const Card = ({
  id,
  name,
  price,
  isAnnual,
  employees,
  trialDays,
  features,
  isCurrent,
  canUpgrade,
  onSubscribe,
  loadingPlanId,
}) => {
  const isLoading = loadingPlanId === id;
  return (
    <div
      className={`relative bg-white rounded-lg border-2 py-8 px-6 flex flex-col hover:shadow-lg transition-all duration-300 col-span-12 md:col-span-4 ${isCurrent ? "border-[#F6A62D]" : "border-[#E5E7EB]"
        }`}
    >
      {/* Current Badge — top-right */}
      {isCurrent && (
        <span className="absolute top-3 right-3 bg-[#F6A62D] text-white text-xs font-semibold px-3 py-1 rounded-full">
          Current
        </span>
      )}

      {/* Plan Name */}
      <div>
        <p className="text-2xl text-[#0A0A0A]">{name}</p>
        <p className="text-[#4A5565] mt-1">Up to {employees} users</p>
      </div>

      {/* Price */}
      <div className="flex flex-col my-4">
        <div className="flex items-end">
          <p className="text-4xl text-[#0A0A0A]">€{price}</p>
          <span className="text-[#4A5565] ml-1">
            /{isAnnual ? "Year" : "Month"}
          </span>
        </div>
       {/* {isAnnual && (
          <p className="text-[#4A5565] mt-1">
            save €{yearlyPrice - monthlyPrice * 12}
          </p>
        )}  */}
      </div>

      {/* Trial */}
      <div className="bg-[#EFF6FF] p-3 rounded-lg">
        <p className="text-[#1447E6]">{trialDays} days free trial</p>
      </div>

      {/* Features */}
      {features && features.length > 0 ? (
        <ul className="space-y-4 mt-8 mb-6">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start">
              {feature && (
                <span className="text-[#00A63E] text-lg mr-2">✔</span>
              )}
              <span className="text-[#364153]">{feature}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 mb-6">
          <p className="text-sm text-[#4A5565] italic">No features listed.</p>
        </div>
      )}

      {/* Upgrade Button */}
      {canUpgrade && (
        <button
          onClick={() => !isLoading && onSubscribe && onSubscribe(id, isAnnual ? "yearly" : "monthly")}
          disabled={isLoading}
          className="mt-auto w-full py-2.5 rounded-lg border border-[#F6A62D] text-[#F6A62D] hover:text-white  font-medium hover:bg-[#F6A62D]/90 transition-all duration-400 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? "Processing…" : `Upgrade Plan`}
        </button>
      )}
    </div>
  );
};

const Plan = ({ plans = [], currentPlanId, currentBillingCycle = "monthly", onSubscribe, loadingPlanId }) => {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div>
      {/* Toggle */}
      <div className="flex items-center justify-center gap-2 mt-10">
        <ToggleButton isAnnual={isAnnual} setIsAnnual={setIsAnnual} />

        <div className="bg-[#FFF6E9] w-max p-1 rounded-lg">
          {/* <p className="text-[#F6A62D]">Save 17%</p> */}
        </div>
      </div>

      <p className="text-[#0A0A0A] text-xl mt-10 mb-4">
        Available Plans
      </p>

      {/* Cards */}
      <div className="grid grid-cols-12 gap-6">
        {Array.isArray(plans) && plans.map((plan) => (
          <Card
            key={plan.id}
            id={plan.id}
            name={plan.name}
            employees={plan.employeeLimitDisplay}
            price={
              isAnnual
                ? plan.priceYearly
                : plan.priceMonthly
            }
            isAnnual={isAnnual}
            monthlyPrice={plan.priceMonthly}
            yearlyPrice={plan.priceYearly}
            trialDays={plan.trialDays}
            features={plan.features}
            isCurrent={currentPlanId === plan.id}
            canUpgrade={
              currentPlanId !== plan.id ||
              currentBillingCycle !== (isAnnual ? "yearly" : "monthly")
            }
            onSubscribe={onSubscribe}
            loadingPlanId={loadingPlanId}
          />
        ))}
      </div>
    </div>
  );
};

export default Plan;
