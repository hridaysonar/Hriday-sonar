import React from "react";
import { BsLinkedin, BsGithub, BsFacebook, BsTwitterX } from "react-icons/bs";
import { MdOutlineEmail } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12">
      <div className="w-full xl:w-9/12 mx-auto flex   sm:flex-row justify-between items-center px-4">
        
        {/* Left Side - Copyright Text */}
        <p className="text-sm   mt-4 sm:-mt-1 ">
          &copy; 2025 <span className="border px-5 ml-2 rounded-full  border-white pt-[3px] pb-[3px]">/ Hriday </span>
        </p>

        {/* Right Side - Social Icons */}
        <div className="flex gap-5 mt-3 sm:mt-0">
          <a href="https://www.facebook.com/share/1ET2TZ9CUK/" target="_blank" rel="noopener noreferrer" className="text-white text-xl hover:shadow-lg transition-all duration-300">
            <BsFacebook />
          </a>
          <a href="https://www.linkedin.com/in/hridoy-sonar-94b42a331?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="text-white text-xl hover:shadow-lg transition-all duration-300">
            <BsLinkedin />
          </a>
        
          <a href="https://github.com/hridaysonar" target="_blank" rel="noopener noreferrer" className="text-white text-xl hover:shadow-lg transition-all duration-300">
            <BsGithub />
          </a>
          <a href="mailto:mdhridaysonar@gmail.com" className="text-white text-xl hover:shadow-lg transition-all duration-300">
            <MdOutlineEmail />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
