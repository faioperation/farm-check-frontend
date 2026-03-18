import React, { useRef, useState } from "react";
import { FiUpload, FiTrash2 } from "react-icons/fi";
import Breadcrumb from '../../components/Bredcumb'
import UploadImage from "../../components/UploadImage";
import LanguageSupport from "../../components/LanguageSupport";
import { LuSave } from "react-icons/lu";

const SystemSettings = () => {
   const fileInputRef = useRef(null);
  const [logo, setLogo] = useState(null);
  const [error, setError] = useState("");

  /* ===== HANDLE FILE SELECT ===== */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // validation
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Image size must be under 2MB");
      return;
    }

    setError("");
    setLogo(URL.createObjectURL(file));

    
  };

  /* ===== REMOVE LOGO ===== */
  const removeLogo = () => {
    setLogo(null);
    fileInputRef.current.value = "";
  };
  return (
    <div>
      <div>
        <Breadcrumb />
       <p className="text-[#4A5565] text-sm md:text-base mt-1.5">
          Global platform configuration and controls
        </p>
      </div>


     

      <div className="mt-6">
      <LanguageSupport/>

      </div>

      <div className=''>
            <button className='bg-[#F6A62D] text-white px-6 py-3 rounded-lg mt-9  flex items-center gap-2 hover:bg-[#e5942b] cursor-pointer w-full flex justify-center'>
              <LuSave className='w-6 h-6 ' />
              Save 
              {/* All Settings */}
            </button>

            </div>



       
  
      
    </div>
  )
}

export default SystemSettings
