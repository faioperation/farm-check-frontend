import React, { useState, useEffect } from "react";
import Breadcrumb from "../../components/Bredcumb";
import InputField from "../../components/InputField";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { LuSave } from "react-icons/lu";
import UploadImage from "../../components/UploadImage";
import { useQuery, useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";

const Settings = () => {
  const axiosSecure = useAxiosSecure();

  const [farmName, setFarmName] = useState("");
  const [logo, setLogo] = useState(null);

  //   GET SETTINGS
  const { data, isLoading } = useQuery({
    queryKey: ["farmSettings"],
    queryFn: async () => {
      const res = await axiosSecure.get("/farm-admin/settings");
      return res.data.data;
    },
  });

  //   Populate state when data loads
  useEffect(() => {
    if (data) {
      setFarmName(data.name || "");
      setLogo(data.logo || null);
    }
  }, [data]);

  // UPDATE SETTINGS
  const updateMutation = useMutation({
    mutationFn: async () => {
      return await axiosSecure.patch("/farm-admin/settings", {
        name: farmName,
      });
    },
    onSuccess: () => {
      toast.success("Settings updated successfully");
    },
    onError: (error) => {
      console.log(error.response?.data);
      toast.error(error.response?.data?.message || "Failed to update settings");
    },
  });

  const handleSubmit = () => {
    if (!farmName) {
      return toast.error("Farm name is required");
    }

    updateMutation.mutate();
  };

  if (isLoading) {
    return <div className="p-10">Loading settings...</div>;
  }

  return (
    <div>
      <div>
        <Breadcrumb />
        <p className="text-[#4A5565] text-sm md:text-base mt-1.5">
          Configure settings for Farm check
        </p>
      </div>

      {/* Farm Info */}
      <div className="bg-white rounded-lg border-2 border-[#E5E7EB] mt-6 p-6">
        <div className="flex items-center mb-4 gap-2">
          <HiOutlineOfficeBuilding className="w-6 h-6 text-[#4A5565]" />
          <h2 className="text-xl text-[#0A0A0A]">Farm Information</h2>
        </div>

        <InputField
          inputClass="rounded-lg"
          label="Farm Name"
          placeholder="Enter your farm name"
          value={farmName}
          onChange={(e) => setFarmName(e.target.value)}
        />

        <p className="text-[#6A7282] mt-2">
          This name will be displayed throughout the application
        </p>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={updateMutation.isPending}
          className="bg-[#F6A62D] text-white px-6 py-3 rounded-lg mt-9 flex items-center gap-2 hover:bg-[#e5942b] cursor-pointer"
        >
          <LuSave className="w-6 h-6" />
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default Settings;
