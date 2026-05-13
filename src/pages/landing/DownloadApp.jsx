import React from "react";
import Container from "../../components/Container";
import Image from "../../components/Image";
import appleStore from "/appleStore.png";
import googlePlay from "/googlePlay.png";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const DownloadApp = () => {
  return (
    <div className="bg-[#F6A62D] py-24 overflow-hidden">
      <Container>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h3 className="text-3xl md:text-5xl font-bold text-white leading-tight">
            Ready to simplify your <br className="hidden md:block" /> farm
            operations?
          </h3>

          <p className="text-lg md:text-xl text-white mt-6 max-w-2xl mx-auto">
            Download the app to manage tasks, SOPs, and team communication
            directly from your phone. Start your free trial today.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-12">
            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="https://play.google.com/store/apps/details?id=com.farmcheckapp.app" className="block">
                <Image src={googlePlay} alt="Google Play" className="h-14" />
              </Link>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="https://apps.apple.com/us/app/farm-check-app/id6760742892" className="block">
                <Image src={appleStore} alt="App Store" className="h-14" />
              </Link>
            </motion.button>
          </div>
        </motion.div>
      </Container>
    </div>
  );
};

export default DownloadApp;
