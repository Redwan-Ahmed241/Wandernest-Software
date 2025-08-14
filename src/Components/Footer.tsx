import React from "react";
import { useNavigate } from "react-router-dom";
// Tailwind conversion: all styles are now inline utility classes

const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#1c170d] w-full min-h-[200px] flex flex-col items-center justify-center text-center text-base text-[#e8f2f2] box-border py-10 px-5 gap-6 relative z-10">
      <div className="w-full max-w-[1200px] flex flex-col items-center justify-center gap-6">
        <div className="w-full flex flex-col gap-4 items-center">
          <div className="flex flex-wrap gap-4 md:gap-8 justify-center text-center">
            <button
              className="min-w-[120px] flex flex-col items-center cursor-pointer"
              onClick={() => navigate("/about-us")}
            >
              <span className="text-base leading-6 font-sans text-[#e8f2f2] hover:underline">
                About Us
              </span>
            </button>
            <button
              className="min-w-[120px] flex flex-col items-center cursor-pointer"
              onClick={() => navigate("/contact")}
            >
              <span className="text-base leading-6 font-sans text-[#e8f2f2] hover:underline">
                Contact
              </span>
            </button>
            <button
              className="min-w-[120px] flex flex-col items-center cursor-pointer"
              onClick={() => navigate("/terms")}
            >
              <span className="text-base leading-6 font-sans text-[#e8f2f2] hover:underline">
                Terms of Service
              </span>
            </button>
            <button
              className="min-w-[120px] flex flex-col items-center cursor-pointer"
              onClick={() => navigate("/PrivacyPolicy")}
            >
              <span className="text-base leading-6 font-sans text-[#e8f2f2] hover:underline">
                Privacy Policy
              </span>
            </button>
          </div>

          <div className="flex justify-center gap-4 flex-wrap items-center">
            <img
              className="w-6 h-6"
              alt="Facebook"
              src="/Figma_photoes/facebook.svg"
            />
            <img
              className="w-6 h-6"
              alt="Twitter"
              src="/Figma_photoes/twitter.svg"
            />
            <img
              className="w-6 h-6"
              alt="Instagram"
              src="/Figma_photoes/insta.svg"
            />
          </div>

          <div className="flex flex-col items-center justify-center text-sm text-gray-400">
            <span className="text-base leading-6 font-sans text-[#e8f2f2]">
              @2025 WanderNest, All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
