import React, { useState } from "react";
import Breadcrumb from "../../components/Bredcumb";
import Table from "../../components/Table";
import { FaSearch } from "react-icons/fa";
import Pagination from "../../components/Pagination";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const TaskOversight = () => {
  const axiosSecure = useAxiosSecure();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  //  FETCH TASKS
  const { data, isLoading } = useQuery({
    queryKey: ["oversightTasks", currentPage],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/farm-admin/oversight/tasks?page=${currentPage}&limit=${itemsPerPage}`
      );
      return res.data.data;
    },
    keepPreviousData: true,
  });

  const tasks = data?.tasks || [];
  const totalTasks = data?.meta?.total || 0;

  //    FILTER (frontend side search)
  const filteredData = tasks.filter(
    (t) =>
      t.title?.toLowerCase().includes(search.toLowerCase()) ||
      t.assignedTo?.name?.toLowerCase().includes(search.toLowerCase())
  );

  //   Status style helper
  const statusStyle = {
    COMPLETED: "bg-[#DCFCE7] text-[#008236]",
    PENDING: "bg-[#FFEDD4] text-[#CA3500]",
    IN_PROGRESS: "bg-blue-100 text-blue-600",
  };

  //   TableHeads
  const TableHeads = [
    {
      Title: "Task",
      key: "title",
      width: "20%",
    },
    {
      Title: "Assigned To",
      key: "assignedTo",
      width: "20%",
      render: (row) => row.assignedTo?.name || "—",
    },
    {
      Title: "Assigned By",
      key: "createdBy",
      width: "15%",
      render: (row) => row.createdBy?.name || "—",
    },
    {
      Title: "Status",
      key: "status",
      width: "15%",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded text-sm ${
            statusStyle[row.status] || "bg-gray-100 text-gray-600"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      Title: "Due Time",
      key: "scheduledAt",
      width: "15%",
      render: (row) =>
        new Date(row.scheduledAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      Title: "Created",
      key: "createdAt",
      width: "15%",
      render: (row) =>
        new Date(row.createdAt).toISOString().split("T")[0],
    },
  ];

  const totalPages = Math.ceil(totalTasks / itemsPerPage);

  if (isLoading) {
    return <div className="p-10">Loading tasks...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div>
        <Breadcrumb />
        <p className="text-[#4A5565] text-sm md:text-base mt-1.5">
          Monitor all tasks across your farm operations
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-12 gap-6 mt-6">
        <div className="col-span-6 md:col-span-3 bg-white p-6 rounded-lg border-2 border-[#E5E7EB]">
          <p className="text-[#4A5565]">Total Tasks</p>
          <p className="text-xl font-semibold text-[#0A0A0A] mt-1">{totalTasks}</p>
        </div>


        <div className="col-span-6 md:col-span-3 bg-white p-6 rounded-lg border-2 border-[#E5E7EB]">
          <p className="text-[#4A5565]">Pending</p>
          <p className="text-xl font-semibold text-[#F54900] mt-1">
            {tasks.filter((t) => t.status === "PENDING").length}
          </p>
        </div>

        <div className="col-span-6 md:col-span-3 bg-white p-6 rounded-lg border-2 border-[#E5E7EB]">
          <p className="text-[#4A5565]">Completed</p>
          <p className="text-xl font-semibold text-[#00A63E] mt-1">
            {tasks.filter((t) => t.status === "COMPLETED").length}
          </p>
        </div>
        <div className="col-span-6 md:col-span-3 bg-white p-6 rounded-lg border-2 border-[#E5E7EB]">
          <p className="text-[#4A5565]">In Progress</p>
          <p className="text-xl font-semibold text-[#155DFC] mt-1">
            {tasks.filter((t) => t.status === "IN_PROGRESS").length}
          </p>
        </div>

        {/* Search */}
        <div className="relative col-span-12">
          <FaSearch className="absolute top-1/2 -translate-y-1/2 left-3 text-[#99A1AF]" />
          <input
            type="text"
            placeholder="Search task..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 p-4 border border-[#D1D5DC] rounded-md outline-none text-[#99A1AF] placeholder:text-[#99A1AF]"
          />
        </div>

        {/* Table */}
        <div className="col-span-12 bg-white rounded-lg border-2 border-[#E5E7EB] overflow-x-scroll md:overflow-hidden">
          <Table TableHeads={TableHeads} TableRows={filteredData} />
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default TaskOversight;
