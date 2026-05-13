"use client";
import React, { useState, useEffect } from "react";
import Container from "../Container";
import { FiX, FiMenu } from "react-icons/fi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Image from "../Image";
import logo from "/logo.png";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";

const navitems = [
  { name: "Home", href: "home" },
  { name: "Featured", href: "feature" },
  { name: "Offer", href: "pricing" },
  // { name: "About us", href: "aboutUs" },
  { name: "Contact", href: "contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const navigate = useNavigate();
  const location = useLocation();

  const role = Cookies.get("userRole");
  useEffect(() => {
    if (location.pathname !== "/") return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // Offset for navbar

      navitems.forEach((item) => {
        if (!item.isRoute) {
          const section = document.getElementById(item.href);
          if (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (
              scrollPosition >= sectionTop &&
              scrollPosition < sectionTop + sectionHeight
            ) {
              setActiveSection(item.href);
            }
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const scrollToSection = (id, closeMenu = false) => {
    const doScroll = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    if (closeMenu) setOpen(false);

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(doScroll, 500);
    } else {
      // wait for mobile menu close animation before scrolling
      setTimeout(doScroll, closeMenu ? 350 : 0);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-transparent py-4">
      <Container>
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white/90 py-3 rounded-2xl shadow-sm md:border md:border-black/5 flex items-center justify-between px-6"
        >
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-3xl cursor-pointer p-2 rounded-xl hover:bg-slate-100 transition-colors"
            onClick={() => setOpen(!open)}
          >
            {open ? <FiX /> : <FiMenu />}
          </button>

          <Link to="/"  onClick={() => scrollToSection("home")}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Image
               
                src={logo}
                alt="FarmCheck Logo"
                className="h-10"
              />
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center justify-end gap-1 ">
            {navitems.map((item, index) => (
              <motion.li key={index} whileHover={{ y: -2 }}>
                {item.isRoute ? (
                  <Link
                    to={item.href}
                    className={`py-2 px-4 font-inter text-lg font-medium transition-colors rounded-lg ${
                      location.pathname === item.href
                        ? "text-[#F6A62D] "
                        : "text-slate-600 hover:text-[#F6A62D]"
                    }`}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <button
                    onClick={() => scrollToSection(item.href)}
                    className={`py-2 px-4 font-inter text-lg font-medium transition-colors rounded-lg cursor-pointer ${
                      activeSection === item.href
                        ? "text-[#F6A62D] "
                        : "text-slate-600 hover:text-[#F6A62D]"
                    }`}
                  >
                    {item.name}
                  </button>
                )}
              </motion.li>
            ))}
          </ul>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="hidden md:block"
          >
            {role ? (
              <Link to={role === "SYSTEM_OWNER" ? "/owner/dashboard" : "/admin/home"}>
                <button className="bg-[#F6A62D] text-white font-bold text-base px-6 py-3 rounded-xl cursor-pointer shadow-md shadow-orange-500/20 hover:shadow-orange-500/30 transition-shadow">
                  Dashboard {role && `(${role === "SYSTEM_OWNER" ? "System Owner" : "Farm Admin"})`}
                </button>
              </Link>
            ) : (
              <Link to="/auth/login">
                <button className="bg-[#F6A62D] text-white font-bold text-base px-6 py-3 rounded-xl cursor-pointer shadow-md shadow-orange-500/20 hover:shadow-orange-500/30 transition-shadow">
                  Login for business
                </button>
              </Link>
            )}
          </motion.div>
        </motion.div>

        {/* Mobile Slide Menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white mt-4 rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
            >
              <ul className="flex flex-col items-start gap-2 p-6">
                {navitems.map((item, index) => (
                  <motion.li
                    key={index}
                    className="w-full"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item.isRoute ? (
                      <Link
                        to={item.href}
                        onClick={() => setOpen(false)}
                        className={`py-3 px-4 font-inter text-lg font-medium block rounded-xl transition-all ${
                          location.pathname === item.href
                            ? "text-[#F6A62D] bg-orange-50"
                            : "text-slate-700 hover:bg-orange-50 hover:text-[#F6A62D]"
                        }`}
                      >
                        {item.name}
                      </Link>
                    ) : (
                      <button
                        onClick={() => scrollToSection(item.href, true)}
                        className={`py-3 px-4 font-inter text-lg font-medium block rounded-xl transition-all w-full text-left ${
                          activeSection === item.href
                            ? "text-[#F6A62D] bg-orange-50"
                            : "text-slate-700 hover:bg-orange-50 hover:text-[#F6A62D]"
                        }`}
                      >
                        {item.name}
                      </button>
                    )}
                  </motion.li>
                ))}

                <motion.div
                  className="w-full pt-4 mt-2 border-t border-slate-100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {role ? (
                    <Link to={role === "SYSTEM_OWNER" ? "/owner/dashboard" : "/admin/home"} onClick={() => setOpen(false)}>
                      <button className="bg-[#F6A62D] w-full text-white font-bold text-lg px-4 py-4 rounded-xl shadow-lg shadow-orange-500/20">
                        Dashboard {role && `(${role === "SYSTEM_OWNER" ? "Platform Owner" : "Farm Admin"})`}
                      </button>
                    </Link>
                  ) : (
                    <Link to="/auth/login" onClick={() => setOpen(false)}>
                      <button className="bg-[#F6A62D] w-full text-white font-bold text-lg px-4 py-4 rounded-xl shadow-lg shadow-orange-500/20">
                        Login for business
                      </button>
                    </Link>
                  )}
                </motion.div>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </div>
  );
};

export default Navbar;
