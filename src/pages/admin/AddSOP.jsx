import React, { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import Breadcrumb from "../../components/Bredcumb";
import { useNavigate, useParams } from "react-router-dom";
import InputField from "../../components/InputField";
import Dropdown from "../../components/Dropdown";
import UploadPDF from "../../components/UploadPDF";
import CreateDigitalModule from "../../components/CreateDigitalModule";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";

const AddSOP = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const isEdit = !!id;

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [activeTab, setActiveTab] = useState("upload");
  const [selectedFile, setSelectedFile] = useState(null);
  const [digitalContent, setDigitalContent] = useState("");

  // ================= FETCH SINGLE SOP =================
  const { data: editData, isLoading } = useQuery({
    queryKey: ["singleSop", id],
    enabled: isEdit,
    queryFn: async () => {
      const res = await axiosSecure.get(`/farm-admin/sops/${id}`);
      console.log("SOP Edit Data:", res.data?.data);
      return res.data?.data;
    },
  });

  // ================= PREFILL EDIT DATA =================
  useEffect(() => {
    if (editData) {
      setTitle(editData.title || "");
      setCategory(editData.category || "");

      // PDF SOP
      if (editData.source === "PDF_UPLOAD") {
        setActiveTab("upload");
      }

      // Digital SOP
      if (editData.source === "DIGITAL_MODULE" || editData.source === "DIGITAL_EDITOR") {
        setActiveTab("create");

        let content = "";
        
        // 1. Try parsedContent first
        if (editData.parsedContent?.sections) {
          content = editData.parsedContent.sections[0]?.steps?.join("") || "";
        }
        
        // 2. Fallback to raw content parsing if parsedContent is empty/missing
        if (!content && editData.content) {
            try {
                // If content is a JSON string
                const parsed = JSON.parse(editData.content);
                if (parsed.sections) {
                    content = parsed.sections[0]?.steps?.join("") || "";
                }
            } catch (e) {
                // If content is just a plain HTML string
                content = editData.content;
            }
        }
        
        setDigitalContent(content);
      }
    }
  }, [editData]);

  // ================= CREATE DIGITAL SOP =================
  const createMutation = useMutation({
    mutationFn: async () => {
      const structuredContent = {
        sections: [
          {
            title: "Main Section",
            steps: digitalContent ? [digitalContent] : [],
          },
        ],
      };

      return await axiosSecure.post("/farm-admin/sops/create", {
        title,
        category: category.toUpperCase(),
        content: JSON.stringify(structuredContent),
        source: "DIGITAL_EDITOR",
      });
    },
    onSuccess: () => {
      toast.success("SOP created successfully");
      queryClient.invalidateQueries(["farmSops"]);
      navigate("/admin/sop/management");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Create failed");
    },
  });

  // ================= UPLOAD PDF =================
  const uploadMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category.toUpperCase());
      formData.append("file", selectedFile);
      formData.append("source", "PDF_UPLOAD");

      return await axiosSecure.post("/farm-admin/sops/create", formData);
    },
    onSuccess: () => {
      toast.success("SOP uploaded successfully");
      queryClient.invalidateQueries(["farmSops"]);
      navigate("/admin/sop/management");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Upload failed");
    },
  });

  // ================= UPDATE SOP =================
  const updateMutation = useMutation({
    mutationFn: async () => {
      console.log("Update initiated. Active Tab:", activeTab);

      // PDF UPDATE
      if (activeTab === "upload") {
        if (selectedFile) {
          console.log("Updating PDF with new file...");
          const formData = new FormData();
          formData.append("title", title);
          formData.append("category", category.toUpperCase());
          formData.append("file", selectedFile);
          formData.append("source", "PDF_UPLOAD");

          return await axiosSecure.patch(`/farm-admin/sops/${id}`, formData);
        }

        // If no new file selected, just update title/category
        console.log("Updating PDF params (no new file)...");
        return await axiosSecure.patch(`/farm-admin/sops/${id}`, {
          title,
          category: category.toUpperCase(),
          source: "PDF_UPLOAD",
        });
      }

      // DIGITAL UPDATE
      console.log("Updating Digital SOP...");
      console.log("Content:", digitalContent);
      
      const structuredContent = {
        sections: [
          {
            title: "Main Section",
            steps: digitalContent ? [digitalContent] : [],
          },
        ],
      };

      const payload = {
        title,
        category: category.toUpperCase(),
        content: JSON.stringify(structuredContent),
        source: "DIGITAL_EDITOR",
      };
      
      console.log("Digital Update Payload:", payload);
      return await axiosSecure.patch(`/farm-admin/sops/${id}`, payload);
    },
    onSuccess: (data) => {
      console.log("Update Success:", data);
      toast.success("SOP updated successfully");
      queryClient.invalidateQueries(["farmSops"]);
      queryClient.invalidateQueries(["singleSop", id]); // Invalidate specific SOP
      navigate("/admin/sop/management");
    },
    onError: (error) => {
      console.error("Update Error:", error);
      toast.error(error.response?.data?.message || "Update failed");
    },
  });

  // ================= SUBMIT =================
  const handleSubmit = () => {
    if (!title || !category) {
      return toast.error("Title & Category required");
    }

    if (isEdit) {
      updateMutation.mutate();
      return;
    }

    if (activeTab === "upload") {
      if (!selectedFile) {
        return toast.error("Please select a PDF file");
      }
      uploadMutation.mutate();
    } else {
      if (!digitalContent) {
        return toast.error("Content required");
      }
      createMutation.mutate();
    }
  };

  // ================= IMAGE UPLOAD FOR DIGITAL MODULE =================
  // ================= IMAGE UPLOAD (COMPRESSED BASE64) =================
  const handleImageUpload = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Resize logic (Max width 600px - aggressive compression for DB limits)
          const MAX_WIDTH = 600;
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          // Compress to JPEG with 0.5 quality to significantly reduce size
          const dataUrl = canvas.toDataURL("image/jpeg", 0.5);
          resolve(dataUrl);
        };
        img.onerror = (error) => {
             console.error("Image Load Error:", error);
             reject(error);
        }
      };
      reader.onerror = (error) => {
        console.error("FileReader Error:", error);
        toast.error("Failed to read image file");
        reject(error);
      };
    });
  };

  if (isEdit && isLoading) {
    return <div className="p-10">Loading SOP...</div>;
  }

  return (
    <div>
      <div
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 cursor-pointer"
      >
        <FaArrowLeft className="text-[#4A5565]" />
        <p className="text-[#4A5565]">Back to SOP List</p>
      </div>

      <div className="mt-4">
        <Breadcrumb />
        <p className="text-[#4A5565] text-sm mt-1.5">
          {isEdit ? "Edit SOP" : "Add a new standard operating procedure"}
        </p>
      </div>

      <div className="bg-white rounded-lg border-2 border-[#E5E7EB] p-6 mt-6">
        <div className="grid grid-cols-12 gap-4">

          <InputField
            type="text"
            inputClass="rounded-lg"
            label="SOP Title"
            placeholder="e.g., Safety Protocols"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="col-span-12"
          />

          <Dropdown
            placeholder="Category"
            options={[
              "MILKING",
              "FEEDING",
              "HEALTH",
              "CALVES",
              "MAINTENANCE",
              "EMERGENCIES",
            ]}
            value={category}
            onSelect={(value) => setCategory(value)}
            className="col-span-12"
          />

          <div className="flex bg-[#FFF4E5] rounded-lg p-1.5 w-fit mt-6 col-span-12">
            <button
              onClick={() => setActiveTab("upload")}
              className={`px-8 py-2 rounded-md ${
                activeTab === "upload"
                  ? "bg-[#F6A62D] text-white"
                  : "text-[#4A5565]"
              }`}
            >
              Upload PDF
            </button>

            <button
              onClick={() => setActiveTab("create")}
              className={`px-8 py-2 rounded-md ${
                activeTab === "create"
                  ? "bg-[#F6A62D] text-white"
                  : "text-[#4A5565]"
              }`}
            >
              Create Digital Module
            </button>
          </div>

          <div className="mt-6 col-span-12">
            {activeTab === "upload" && (
              <UploadPDF 
                onFileSelect={(file) => setSelectedFile(file)} 
                existingPdf={editData?.fileUrl}
                existingFileName={editData?.fileName}
              />
            )}

            {activeTab === "create" && (
              <CreateDigitalModule
                value={digitalContent}
                onChange={setDigitalContent}
                onImageUpload={handleImageUpload}
              />
            )}
          </div>

          <div className="col-span-12 flex gap-3 mt-6">
            <button
              onClick={handleSubmit}
              disabled={
                createMutation.isPending ||
                uploadMutation.isPending ||
                updateMutation.isPending
              }
              className="py-3 px-5 bg-[#F6A62D] text-white rounded-lg"
            >
              {createMutation.isPending ||
              uploadMutation.isPending ||
              updateMutation.isPending
                ? "Processing..."
                : isEdit
                ? "Update SOP"
                : "Create SOP"}
            </button>

            <button
              onClick={() => navigate(-1)}
              className="py-3 px-5 bg-[#E5E7EB] text-[#364153] rounded-lg"
            >
              Cancel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddSOP;
