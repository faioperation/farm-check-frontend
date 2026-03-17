import React, { useState } from "react";
import ToggleButton from "./ToggleButton";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";

const Card = ({ name, price, features, employees, farms, trialDays, isAnnual, monthlyPrice, yearlyPrice }) => {
  return (
    <div className="bg-white rounded-lg border-2 border-[#E5E7EB] py-8 px-6 flex flex-col hover:shadow-lg transition-all duration-300 md:col-span-4">
      {/* Header + Actions */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-2xl text-[#0A0A0A]">{name}</p>
          <p className="text-[#4A5565] mt-1">{employees}</p>
        </div>
      </div>

      {/* Price */}
      <div className="flex flex-col my-4">
        <div className="flex items-end">
          <p className="text-4xl text-[#0A0A0A]">€{price}</p>
          <span className="text-[#4A5565] ml-1">
            /{isAnnual ? "year" : "month"}
          </span>
        </div>

        {/* Yearly calculation / Savings */}
      
      </div>

      {/* Trial */}
      <div className="bg-[#EFF6FF] p-3 rounded-lg">
        <p className="text-[#1447E6]">{trialDays } days free trial</p>
      </div>

      {/* Features */}
      {features && features.length > 0 ? (
        <ul className="space-y-4 mb-14 mt-8">
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
        <div className="mb-14 mt-8">
          <p className="text-sm text-[#4A5565] italic">No features listed.</p>
        </div>
      )}

      {/* Footer */}
      <p className="text-[#101828] border-t border-[#F3F4F6] pt-6 mt-auto">
        {farms}
        <span className="text-[#4A5565] ml-1">farms using this plan</span>
      </p>
    </div>
  );
};

const ManagePlan = ({ plans = [] }) => {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="">
      {/* Toggle */}
      <div className="flex items-center justify-center gap-2 mb-10">
        <ToggleButton isAnnual={isAnnual} setIsAnnual={setIsAnnual} />
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-12  gap-6">
        {plans.map((plan, i) => (
          <Card
            key={plan.id || i}
            name={plan.name}
            employees={`Up to ${plan.employeeLimitDisplay} users`}
            price={isAnnual ? plan.priceYearly : plan.priceMonthly}
            isAnnual={isAnnual}
            monthlyPrice={plan.priceMonthly}
            yearlyPrice={plan.priceYearly}
            farms={plan.farmsUsing}
            features={plan.features}
            trialDays={plan.trialDays}
          />
        ))}
        {plans.length === 0 && (
          <div className="col-span-12 text-center text-[#4A5565] p-10">
            No plans available.
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagePlan;
