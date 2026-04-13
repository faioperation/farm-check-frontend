import React from 'react'
import { useNavigate } from 'react-router-dom'
import { IoArrowBack } from 'react-icons/io5'
import { MdOutlineEmail, MdOutlinePhone } from 'react-icons/md'

const TermsService = () => {
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

      {/* Back arrow */}

      {/* Content */}
      <div className="w-full px-4 sm:px-8 lg:px-16 pt-8 pb-16">
        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-[#1A1A1A] mb-6 sm:mb-8">Terms of Service</h1>

        <div className="space-y-4 sm:space-y-6 text-[#364153] text-base sm:text-lg lg:text-3xl leading-relaxed">
          <p>
            By accessing or using the Farm-Check platform, you agree to comply with these terms of service.
          </p>

          <div>
            <h2 className="font-semibold text-[#1A1A1A] mb-1">1. Purpose of the App</h2>
            <p>
              FarmCheck provides a digital platform to create, manage, and execute Standard
              Operating Procedures (SOPs) as operational workflows. The App is intended as a support
              tool only and does not replace professional judgment, training, or established operational
              responsibilities.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-[#1A1A1A] mb-2">2. User Responsibility</h2>
            <p className="mb-2">You acknowledge and agree that:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>You are solely responsible for how FarmCheck is used within your operations.</li>
              <li>SOPs uploaded, created, or executed using the App remain your responsibility.</li>
              <li>FarmCheck does not verify, validate, or guarantee the correctness, completeness, or suitability of any SOP content.</li>
              <li>You are responsible for ensuring that all procedures comply with applicable laws, regulations, safety standards, and industry requirements.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-[#1A1A1A] mb-1">3. No Professional or Operational Advice</h2>
            <p>
              FarmCheck does not provide professional, agricultural, legal, safety, or operational
              advice. Any information or workflows generated through the App are for organizational
              support purposes only. Use of the App is at your own risk.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-[#1A1A1A] mb-2">4. Limitation of Liability</h2>
            <p className="mb-2">To the maximum extent permitted by law:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>FarmCheck shall not be liable for any direct, indirect, incidental, consequential, or special damages, including but not limited to loss of data, loss of profits, operational disruptions, injuries, damages, or losses arising from the use or inability to use the App.</li>
              <li>FarmCheck is not responsible for outcomes resulting from SOP execution, non-execution, misinterpretation, or misuse of procedures.</li>
              <li>FarmCheck shall not be liable for any damage, injury, loss, or claim arising from actions taken based on content managed or executed through the App.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-[#1A1A1A] mb-1">5. Disclaimer of Warranties</h2>
            <p>
              FarmCheck is provided "as is" and "as available", without warranty of any kind, express
              or implied. FarmCheck does not guarantee uninterrupted availability, accuracy, reliability,
              or fitness for a particular purpose.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-[#1A1A1A] mb-1">6. Indemnification</h2>
            <p className="mb-2">
              You agree to indemnify and hold harmless FarmCheck, its owners, and affiliates from any
              claims, damages, liabilities, costs, or expenses arising from:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Your use of the App</li>
              <li>SOP content you create, upload, or execute</li>
              <li>Violations of applicable laws or third-party rights</li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-[#1A1A1A] mb-1">7. Subscription and Trial</h2>
            <p>
              FarmCheck may be offered as a paid service with a free trial period. Subscription terms,
              pricing, and billing conditions are presented within the App and may change over time.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-[#1A1A1A] mb-1">8. Termination</h2>
            <p>
              FarmCheck reserves the right to suspend or terminate access to the App at any time for
              violation of these Terms or misuse of the service.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-[#1A1A1A] mb-1">9. Changes to the Terms</h2>
            <p>
              FarmCheck may update these Terms from time to time. Continued use of the App after
              changes become effective constitutes acceptance of the revised Terms.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-[#1A1A1A] mb-1">10. Governing Law</h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of the
              jurisdiction in which FarmCheck operates, without regard to conflict of law principles.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsService
