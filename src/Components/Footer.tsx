import React from "react";
import { useNavigate } from "react-router-dom";

const Footer: React.FC = () => {
  const navigate = useNavigate();
  return (
    <footer className="w-full bg-white border-t border-border py-8 mt-12">
      <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center">
          <button
            className="text-primary-dark font-jakarta text-base hover:text-primary transition"
            onClick={() => navigate("/about-us")}
          >
            About Us
          </button>
          <button
            className="text-primary-dark font-jakarta text-base hover:text-primary transition"
            onClick={() => navigate("/contact")}
          >
            Contact
          </button>
          <button
            className="text-primary-dark font-jakarta text-base hover:text-primary transition"
            onClick={() => navigate("/terms")}
          >
            Terms of Service
          </button>
          <button
            className="text-primary-dark font-jakarta text-base hover:text-primary transition"
            onClick={() => navigate("/PrivacyPolicy")}
          >
            Privacy Policy
          </button>
        </div>
        <div className="flex gap-4 items-center">
          <img
            className="w-6 h-6"
            alt="Facebook"
            src="/figma_photos/facebook.svg"
          />
          <img
            className="w-6 h-6"
            alt="Twitter"
            src="/figma_photos/twitter.svg"
          />
          <img
            className="w-6 h-6"
            alt="Instagram"
            src="/figma_photos/insta.svg"
          />
        </div>
      </div>
      <div className="text-center text-sm text-primary-dark mt-6 font-jakarta">
        @2025 WanderNest, All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
