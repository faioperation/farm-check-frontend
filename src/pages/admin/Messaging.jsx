import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Breadcrumb from "../../components/Bredcumb";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import MessageList from "./MessageList";
import Inbox from "./Inbox";

const Messaging = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "oversight";

  const setActiveTab = (tab) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("tab", tab);
    // If switching to oversight, clear conversation param to be clean
    if (tab === "oversight") {
        newParams.delete("conversation");
    }
    setSearchParams(newParams);
  };

  // ================= FETCH MESSAGES =================
  const { data: messages = [] } = useQuery({
    queryKey: ["oversightMessages"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        "/farm-admin/messages/oversight/messages"
      );
      const rawData = res.data?.data || [];
      
      // Filter out messages sent by ADMIN (including 'farm admin', 'admin', etc.)
      const filteredData = rawData.filter(msg => {
          const senderRole = msg.sender?.role?.toLowerCase() || "";
          // Check for exact "admin", or "farm admin", or "farm_admin"
          return !senderRole.includes("admin");
      });

      // Sort by creation time descending (newest first)
      filteredData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Map backend data to frontend structure
      return filteredData.map((msg) => ({
        id: msg.id,
        text: msg.content,
        from: msg.sender?.name || "Unknown",
        fromRole: msg.sender?.role || "",
        to: msg.receiver?.name || "Unknown",
        toRole: msg.receiver?.role || "",
        unread: !msg.isRead,
        time: new Date(msg.createdAt).toLocaleString(), // Simple formatting
      }));
    },
  });

  // ================= FETCH STATS =================
  const { data: stats } = useQuery({
    queryKey: ["messageStats"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        "/farm-admin/messages/oversight/stats"
      );
      // Map stats if necessary, assuming structure based on toggle response
      const data = res.data?.data || {};
      return {
        total: data.totalMessages || 0, // guessing field name or defaulting
        unread: data.unreadMessagesCount || 0, // guessing field name or defaulting
        enabled: data.isMessagingEnabled !== undefined ? data.isMessagingEnabled : true,
      };
    },
  });

  // ================= TOGGLE =================
  const toggleMutation = useMutation({
    mutationFn: async () => {
      return await axiosSecure.patch(
        "/farm-admin/messages/oversight/toggle"
      );
    },
    onSuccess: () => {
      toast.success("Messaging status updated");
      queryClient.invalidateQueries(["messageStats"]);
    },
  });

  // ================= CLEAR ALL =================
  const clearAllMutation = useMutation({
    mutationFn: async () => {
      return await axiosSecure.delete(
        "/farm-admin/messages/oversight/clear"
      );
    },
    onSuccess: () => {
      toast.success("All messages cleared");
      queryClient.invalidateQueries(["oversightMessages"]);
      queryClient.invalidateQueries(["messageStats"]);
    },
  });

  // ================= DELETE SINGLE =================
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.delete(
        `/farm-admin/messages/oversight/${id}`
      );
    },
    onSuccess: () => {
      toast.success("Message deleted");
      queryClient.invalidateQueries(["oversightMessages"]);
      queryClient.invalidateQueries(["messageStats"]);
    },
  });

  // ================= MARK AS READ =================
  const markAsReadMutation = useMutation({
    mutationFn: async (id) => {
      // Trying standard REST partial update
      return await axiosSecure.patch(
        `/farm-admin/messages/oversight/${id}`,
        { isRead: true }
      );
    },
    onSuccess: () => {
      // Invalidate to update unread count and message highlighting
      queryClient.invalidateQueries(["oversightMessages"]);
      queryClient.invalidateQueries(["messageStats"]);
    },
  });

  const totalMessages = stats?.total || 0;
  const unreadMessagesCount = stats?.unread || 0;
  const enabled = stats?.enabled ?? true;

  return (
    <div>
      <div>
        <Breadcrumb />
        <p className="text-[#4A5565] text-sm md:text-base mt-1.5">
          Monitor communication between employees and managers
        </p>
      </div>

      <div className="flex w-full mt-6 border-b border-[#DEDEDE]">
        <button
          onClick={() => setActiveTab("oversight")}
          className={`px-20 py-2  cursor-pointer ${
            activeTab === "oversight"
              ? "border-[#F6A62D] border-b text-[#0A0A0A]"
              : "text-[#4A5565]"
          }`}
        >
          Oversight
        </button>

        <button
          onClick={() => setActiveTab("create")}
          className={`px-20 py-2  cursor-pointer ${
            activeTab === "create"
              ? "border-[#F6A62D] border-b text-[#0A0A0A]"
              : "text-[#4A5565]"
          }`}
        >
          Inbox
        </button>
      </div>

      <div className="mt-6 col-span-12">
        {activeTab === "oversight" && (
          <div>
            <div className="grid grid-cols-12 gap-6 mt-6">
              <div className=" p-6 bg-white rounded-lg border-2 border-[#E5E7EB] col-span-12 md:col-span-4">
                <p className="text-sm text-gray-500">Total Messages</p>
                <p className="text-2xl text-[#0A0A0A] font-semibold mt-1">
                  {totalMessages}
                </p>
              </div>

              <div className=" p-6 bg-white rounded-lg border-2 border-[#E5E7EB] col-span-12 md:col-span-4">
                <p className="text-sm text-gray-500">Unread Messages</p>
                <p className="text-2xl text-[#F54900] font-semibold mt-1">
                  {unreadMessagesCount}
                </p>
              </div>

              <div className="bg-white rounded-lg border-2 border-[#E5E7EB] p-6 col-span-12 md:col-span-4 ">
                <div>
                  <p className="text-sm text-gray-500">Messaging Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => toggleMutation.mutate()}
                      className={`w-11 h-6 rounded-full flex items-center px-1 ${
                        enabled
                          ? " border-2 border-[#00A63E]"
                          : "border-2 border-red-600"
                      }`}
                    >
                      <span
                        className={`border-2 border-[#00A63E] w-4 h-4 rounded-full transform transition ${
                          enabled
                            ? "translate-x-4 "
                            : "border-red-600 border"
                        }`}
                      />
                    </button>
                    <p
                      className={`font-medium ${
                        enabled ? "text-[#00A63E]" : "text-red-600"
                      }`}
                    >
                      {enabled ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <MessageList
              messages={messages}
              onDelete={(id) => deleteMutation.mutate(id)}
              onClearAll={() => clearAllMutation.mutate()}
              onMarkAsRead={(id) => markAsReadMutation.mutate(id)}
            />
          </div>
        )}

        {activeTab === "create" && <Inbox />}
      </div>
    </div>
  );
};

export default Messaging;
