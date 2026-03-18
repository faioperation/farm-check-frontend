import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import Breadcrumb from "../../components/Bredcumb";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import InputField from "../../components/InputField";
import { useNavigate } from "react-router-dom";
import Password from "../../components/Password";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";

const CreateFarm = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    adminName: "",
    adminEmail: "",
    password: "",
    country: "",
    defaultLanguage: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  //   Create Farm Mutation
  const createFarmMutation = useMutation({
    mutationFn: async () => {
      return await axiosSecure.post("/system-owner/farm", formData);
    },
    onSuccess: () => {
      toast.success("Farm created successfully");
      queryClient.invalidateQueries(["farms"]);
      navigate("/owner/farm/management");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to create farm"
      );
    },
  });

  const handleSubmit = () => {
    const { name, adminName, adminEmail, password, country, defaultLanguage } =
      formData;

    if (
      !name ||
      !adminName ||
      !adminEmail ||
      !password ||
      !country ||
      !defaultLanguage
    ) {
      return toast.error("All fields are required");
    }

    createFarmMutation.mutate();
  };

  return (
    <div>
      <div
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 cursor-pointer"
      >
        <FaArrowLeft className=" text-[#4A5565] " />
        <p className="text-[#4A5565]">Back to Farms</p>
      </div>

      <div className="bg-white rounded-lg border-2 border-[#E5E7EB] mt-6 p-6">
        <div className="flex items-center gap-2">
          <div className="bg-[#FFF6E9] rounded-lg p-3">
            <HiOutlineBuildingOffice2 className="text-[#F6A62D] w-6 h-6" />
          </div>
          <div>
            <Breadcrumb />
            <p className="text-[#4A5565] text-sm md:text-base mt-1.5">
              Add a new farm to the platform
            </p>
          </div>
        </div>

        {/* Farm Details */}
        <div>
          <h3 className="text-xl text-[#0A0A0A] mt-6">Farm Details</h3>

          <div className="grid grid-cols-12 gap-4 border-b border-[#E5E7EB] py-4">

            <InputField
              type="text"
              label="Farm Name"
              placeholder="e.g., Cow Farm"
              inputClass="rounded-lg"
              className="col-span-12"
              onChange={(e) => handleChange("name", e.target.value)}
            />

            <InputField
              type="text"
              label="Admin Name"
              placeholder="e.g., Salman"
              inputClass="rounded-lg"
              className="col-span-12"
              onChange={(e) => handleChange("adminName", e.target.value)}
            />

            <InputField
              type="email"
              label="Admin Email"
              placeholder="admin@farm.com"
              inputClass="rounded-lg"
              className="col-span-12"
              onChange={(e) =>
                handleChange("adminEmail", e.target.value)
              }
            />

              <Password
              label="Password"
              inputClass="rounded-lg"
              className="col-span-12"
              onChange={(e) => handleChange("password", e.target.value)}
            />

            <InputField
              type="text"
              label="Country"
              inputClass="rounded-lg"
              className="col-span-6"
              onChange={(e) => handleChange("country", e.target.value)}
            />

            <InputField
              type="text"
              label="Language"
              inputClass="rounded-lg"
              className="col-span-6"
              onChange={(e) =>
                handleChange("defaultLanguage", e.target.value)
              }
              />
          </div>
        </div>
{/* 
        <div>
          <h3 className="text-xl text-[#0A0A0A] mt-6">Subscription Details</h3>
          <div className=" gap-4 border-b border-[#E5E7EB] py-4">
            <InputField
              inputClass={`rounded-lg`}
              label={`Status `}
              placeholder={``}
              className={`col-span-6`}
            />
            <InputField
          inputClass={`rounded-lg`}
          label={`Plan`}
          placeholder={``}
          className={`col-span-6`}
        />
            <Dropdown
              label={`Plan`}
              placeholder={`Select Plan`}
              options={["Basic", "Professional", "Enterprise "]}
              onSelect={(value) => console.log(value)}
              className={``}
            />
            <InputField
              inputClass={`rounded-lg`}
              label={`Employee Limit`}
              placeholder={``}
              className={`col-span-12`}
            />
          </div>
        </div> */}

        {/* Buttons */}
        <div className="grid grid-cols-12 gap-4 mt-4">
          <button
            onClick={handleSubmit}
            disabled={createFarmMutation.isPending}
            className="py-3 px-5 col-span-8 md:col-span-10 bg-[#F6A62D] text-white rounded-lg"
          >
            {createFarmMutation.isPending
              ? "Creating..."
              : "Create Farm"}
          </button>

          <button
            onClick={() => navigate(-1)}
            className="py-3 px-5 col-span-4 md:col-span-2 bg-[#E5E7EB] text-[#364153] rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateFarm;
