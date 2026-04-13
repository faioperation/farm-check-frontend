import React from 'react'
import { useNavigate } from 'react-router-dom'
import { IoArrowBack } from 'react-icons/io5'
import { MdOutlineEmail, MdOutlinePhone } from 'react-icons/md'

const PrivacyPolicy = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">

      {/* Top Info Bar */}
      <div className="w-full border-b border-gray-200 px-4 sm:px-8 py-3 flex items-center justify-between text-xs sm:text-sm text-[#364153]">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors flex-shrink-0"
        >
          <IoArrowBack className="w-4 h-4 text-[#364153]" />
        </button>

        <span className="hidden sm:inline">Hello! Welcome to Farm-Check</span>

        <div className="flex items-center gap-2 sm:gap-6">
          <span className="flex items-center gap-1">
            <MdOutlineEmail className="w-4 h-4" />
            <span className="hidden md:inline">farmchecksupport@gmail.com</span>
          </span>
          <span className="flex items-center gap-1">
            <MdOutlinePhone className="w-4 h-4" />
            <span className="hidden md:inline">+31625281836</span>
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="w-full px-4 sm:px-8 lg:px-16 pt-8 pb-16">
        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-[#1A1A1A] mb-6 sm:mb-8">Privacy Policy</h1>

        <div className="space-y-6 sm:space-y-8 text-[#364153] text-base sm:text-lg lg:text-xl leading-relaxed">
          <p>Farm Check values your privacy.</p>

          <p>
            Farm Check is a Software-as-a-Service (SaaS) platform designed for farm administrators, managers, and employees to manage daily operations efficiently. The app is intended for authorized users within an organization.
          </p>

          <div className="space-y-2">
            <h2 className="font-bold text-[#1A1A1A]">Account & Access:</h2>
            <p>
              User accounts are created and managed by the farm administrator through a centralized dashboard. Only authorized managers and employees can access the app. Administrators have full control to create, manage, and delete user accounts at any time.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-bold text-[#1A1A1A]">Data Collection:</h2>
            <p>We collect only the information necessary to operate the service, which may include:</p>
            <ul className="list-disc pl-6 sm:pl-8 space-y-1">
              <li>User account information (such as name and email address)</li>
              <li>Operational data related to tasks, SOP execution, and workflow activities</li>
              <li>Messages and content shared within the in-app chat system</li>
              <li>Technical data required for app functionality and performance</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="font-bold text-[#1A1A1A]">Usage of Data:</h2>
            <p>All collected data is used strictly for:</p>
            <ul className="list-disc pl-6 sm:pl-8 space-y-1">
              <li>Providing and maintaining the service</li>
              <li>Managing user accounts and roles</li>
              <li>Enabling communication between team members (chat feature)</li>
              <li>Improving app performance and user experience</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="font-bold text-[#1A1A1A]">Data Sharing:</h2>
            <p>
              We do not sell or share personal data with third parties. Data may only be processed by trusted infrastructure providers strictly for hosting and technical operation purposes.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-bold text-[#1A1A1A]">User Control:</h2>
            <p>
              Since this is an organization-based system, individual users cannot self-register. All accounts are controlled by the organization’s administrator, who can update or delete user data upon request.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-bold text-[#1A1A1A]">Data Security:</h2>
            <p>
              We implement appropriate technical and organizational measures to protect user data and ensure secure access.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-bold text-[#1A1A1A]">Contact:</h2>
            <p>For any privacy-related questions or requests, please contact:</p>
            <p className="font-medium text-[#1A1A1A] hover:underline cursor-pointer">
              <a href="mailto:farmchecksupport@gmail.com">farmchecksupport@gmail.com</a>
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}

export default PrivacyPolicy
