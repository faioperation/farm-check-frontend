import React, { useRef, useState } from "react";
import Container from "../../components/Container";
import InputField from "../../components/InputField";
import { motion } from "framer-motion";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';

const Contact = () => {
  const formRef = useRef();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Replace these with your actual EmailJS credentials
    const serviceId = "service_zoux3ru";
    const templateId = "template_bup4wlv";
    const publicKey = "M-TrnCB_xCVsTnsX8";

    emailjs
      .sendForm(serviceId, templateId, formRef.current, publicKey)
      .then(
        (result) => {
          toast.success("Message sent successfully!");
          setLoading(false);
          e.target.reset(); // Reset form fields
        },
        (error) => {
          toast.error("Failed to send the message, please try again.");
          setLoading(false);
          console.error(error);
        }
      );
  };

  return (
    <div id="contact" className="py-24 bg-white overflow-hidden">
      <Container>
        <div className="flex flex-col lg:flex-row bg-[#0F172B] rounded-[20px] overflow-hidden shadow-2xl ">
          {/* Left Column: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
            className="lg:w-[38%] bg-[#0F172B] p-10 md:p-14 relative overflow-hidden flex flex-col justify-start"
          >
            {/* Background Decorative Circles */}
            <div className="absolute bottom-[-60px] right-[-60px] w-[350px] h-[350px] bg-slate-800/40 rounded-full z-0"></div>
            <div className="absolute top-[20%] right-[-80px] w-[180px] h-[180px] bg-slate-700/20 rounded-full blur-xl z-0"></div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Contact Information
              </h2>
              <p className="text-[#90A1B9] text-lg leading-relaxed mb-16 opacity-90 font-light">
                We are committed to processing the information in order to
                contact you and talk about your project.
              </p>

              <div className="space-y-12">
                <div className="flex items-center gap-6 group">
                  <FiPhone className="w-6 h-6 text-white" />
                  <a
                    href="tel:+31625281836"
                    className="text-white text-lg hover:text-[#F6A62D] transition-colors"
                  >
                    +31625281836
                  </a>
                </div>

                <div className="flex items-center gap-6 group">
                  <FiMail className="w-6 h-6 text-white" />
                  <a
                    href="mailto:farmcheck.app@gmail.com"
                    className="text-white text-lg hover:text-[#F6A62D] transition-colors"
                  >
                    farmcheck.app@gmail.com
                  </a>
                </div>

                <div className="flex items-start gap-6 group">
                  <FiMapPin className="w-6 h-6 text-white mt-1" />
                  <p className="text-white text-lg leading-relaxed">
                    Molenhof 7, 5827 AR Vortum-Mullem,
                    <br />
                    The Netherlands
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
            className="lg:w-[62%] bg-white p-10 md:p-16 lg:p-20"
          >
            <form ref={formRef} className="space-y-10" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <InputField
                  label={
                    <span className="text-[#364153] font-medium text-lg">
                      Name<span className="text-red-500 ml-1">*</span>
                    </span>
                  }
                  name="user_name"
                  placeholder="Enter your name"
                  inputClass="rounded-xl border-[#E5E7EB] focus:border-[#F6A62D] py-5 px-6 transition-all"
                  required
                />
                <InputField
                  label={
                    <span className="text-[#364153] font-medium text-lg">
                      Email<span className="text-red-500 ml-1">*</span>
                    </span>
                  }
                  name="user_email"
                  placeholder="Enter your email"
                  type="email"
                  inputClass="rounded-xl border-[#E5E7EB] focus:border-[#F6A62D] py-5 px-6 transition-all"
                  required
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[#364153] font-medium text-lg">
                  Message
                </label>
                <textarea
                  name="message"
                  placeholder="Write your message..."
                  className="border border-[#E5E7EB] outline-none p-5 text-[#364153] placeholder:text-[#0A0A0A]/30 rounded-xl min-h-[180px] focus:border-[#F6A62D] transition-all resize-none"
                  required
                ></textarea>
              </div>

              <div className="flex justify-start lg:justify-end pt-6">
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: "#e5942b" }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="bg-[#F6A62D] text-white font-bold py-5 px-16 rounded-xl transition-all duration-300 shadow-xl shadow-orange-500/20 w-full md:w-auto text-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending..." : "Send Message"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </Container>
    </div>
  );
};

export default Contact;
