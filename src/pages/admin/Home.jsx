import React from "react";
import { FaArrowTrendUp } from "react-icons/fa6";
import {
  FiCheckSquare,
  FiFileText,
  FiMessageSquare,
  FiUsers,
} from "react-icons/fi";
import { MdOutlineErrorOutline } from "react-icons/md";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Home = () => {
  const axiosSecure = useAxiosSecure();

  const formatDate = (dateString) =>
    new Date(dateString).toISOString().split("T")[0];

  const { data, isLoading, isError } = useQuery({
    queryKey: ["farmAdminDashboard"],
    queryFn: async () => {
      const res = await axiosSecure.get("/farm-admin/dashboard");
      return res.data.data;
    },
  });

  if (isLoading) {
    return <div className="p-10">Loading dashboard...</div>;
  }

  if (isError || !data) {
    return (
      <div className="p-10 text-[#4A5565]">
        Loading dashboard data...
      </div>
    );
  }

  const { user, stats, subscription } = data;

  return (
    <div>
      {/* Header */}
      <div>
        <h1 className="text-2xl text-[#0A0A0A] mb-2">
          Welcome back, {user.name}
        </h1>
        <p className="text-[#4A5565]">
          Here's what's happening with your farm today
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6 mt-8">

        {/* Employees */}
        <div className="col-span-12 md:col-span-3 bg-white p-6 rounded-lg border-2 border-[#E5E7EB]">
          <div className="bg-[#2B7FFF] p-3 rounded-lg w-fit mb-7">
            <FiUsers className="w-6 h-6 text-white" />
          </div>
          <p className="text-[#4A5565]">Total Employees</p>
          <h2 className="text-xl font-semibold text-[#0A0A0A] my-1">
            {stats.users.total}
          </h2>
          <p className="text-[#4A5565]">
            +{stats.users.addedThisMonth} this month
          </p>
        </div>

        {/* SOPs */}
        <div className="col-span-12 md:col-span-3 bg-white p-6 rounded-lg border-2 border-[#E5E7EB]">
          <div className="bg-[#00C950] p-3 rounded-lg w-fit mb-7">
            <FiFileText className="w-6 h-6 text-white" />
          </div>
          <p className="text-[#4A5565]">SOP Modules</p>
          <h2 className="text-xl font-semibold text-[#0A0A0A] my-1">
            {stats.sops.total}
          </h2>
          <p className="text-[#4A5565]">
            {stats.sops.updatedToday} updated today
          </p>
        </div>

        {/* Tasks */}
        <div className="col-span-12 md:col-span-3 bg-white p-6 rounded-lg border-2 border-[#E5E7EB]">
          <div className="bg-[#F0B100] p-3 rounded-lg w-fit mb-7">
            <FiCheckSquare className="w-6 h-6 text-white" />
          </div>
          <p className="text-[#4A5565]">Tasks</p>
          <h2 className="text-xl font-semibold text-[#0A0A0A] my-1">
            {stats.tasks.total}
          </h2>
          <p className="text-[#4A5565]">
            {stats.tasks.completed} completed
          </p>
        </div>

        {/* Messages */}
        <div className="col-span-12 md:col-span-3 bg-white p-6 rounded-lg border-2 border-[#E5E7EB]">
          <div className="bg-[#2B7FFF] p-3 rounded-lg w-fit mb-7">
            <FiMessageSquare className="w-6 h-6 text-white" />
          </div>
          <p className="text-[#4A5565]">Today’s Messages</p>
          <h2 className="text-xl font-semibold text-[#0A0A0A] my-1">
            {stats.messages.today}
          </h2>
          <p className="text-[#4A5565]">
            {stats.messages.unread} unread
          </p>
        </div>

        {/* Subscription */}
        <div className="col-span-12 bg-white p-6 rounded-lg border-2 border-[#E5E7EB]">
          <div className="flex justify-between pb-4">
            <span className="text-xl text-[#0A0A0A]">
              Subscription Status
            </span>
            <span className="text-[#00A63E]">
              <FaArrowTrendUp />
            </span>
          </div>

          <div className="flex justify-between py-3">
            <span className="text-[#4A5565]">Current Plan</span>
            <span className="font-normal text-[#00A63E] bg-[#DCFCE7] py-1 px-2 rounded">
              {subscription.plan}
            </span>
          </div>

          <div className="flex justify-between py-3">
            <span className="text-[#4A5565]">Employee Count</span>
            <span className="text-[#4A5565]">
              {subscription.currentUsers}/
              {subscription.employeeLimit}
            </span>
          </div>

          <div className="flex justify-between py-3">
            <span className="text-[#4A5565]">
              Next Billing Date
            </span>
            <span className="text-[#4A5565]">
              {formatDate(subscription.nextBillingDate)}
            </span>
          </div>

          <div className="border-t border-[#E5E7EB] mt-4 pt-4">
            <p className="text-[#4A5565] flex items-center gap-2">
              <MdOutlineErrorOutline />
              {subscription.remainingUsers} employees remaining in your plan
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-span-12  bg-[#F6A62D]  p-6 rounded-lg ">
          <p className="text-[#ffffff] text-xl">Quick Actions</p>
          <div className="grid grid-cols-12 gap-6 ">


            <Link to="/admin/user/management/add/user" className="col-span-12 md:col-span-4">
            <div className=" bg-white/20 gap-2 flex flex-col justify-center items-center rounded-lg p-4 mt-4 cursor-pointer">
              <button className=" p-3 rounded-lg w-fit">
                <FiUsers className="w-6 h-6 text-white " />
              </button>
              <span className="text-white">Add New User</span>
            </div>
            </Link>

            <Link to="/admin/sop/management/upload/sop" className="col-span-12 md:col-span-4">
            <div className=" bg-white/20 gap-2 flex flex-col justify-center items-center rounded-lg p-4 mt-4 cursor-pointer">
              <button className=" p-3 rounded-lg w-fit">
                <FiFileText className="w-6 h-6 text-white " />
              </button>
              <span className="text-white">Upload SOP</span>
            </div>
            </Link>

            <Link to="/admin/messaging/oversight" className="col-span-12 md:col-span-4">
            <div className=" bg-white/20 gap-2 flex flex-col justify-center items-center rounded-lg p-4 mt-4 cursor-pointer">
              <button className=" p-3 rounded-lg w-fit ">
                <FiCheckSquare className="w-6 h-6 text-white " />
              </button>
              <span className="text-white">View All Messages</span>
            </div>
            </Link>

            {/* <div className="col-span-4 bg-white/20 gap-2 flex flex-col justify-center items-center rounded-lg p-4 mt-4 cursor-pointer">
             
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
