import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#1c170d] w-full min-h-[200px] flex flex-col items-center justify-center text-center text-base text-[#e8f2f2] box-border py-10 px-5 gap-6 relative z-10">
      <div className="w-full max-w-[1200px] flex flex-col items-center justify-center gap-6">
        <div className="w-full flex flex-col gap-4 items-center">
          <div className="flex flex-wrap gap-4 justify-center text-center md:gap-8">
            <div className="min-w-[120px] flex flex-col items-center justify-start cursor-pointer" onClick={() => navigate('/about-us')}>
              <div className="text-base leading-6 font-['Plus_Jakarta_Sans'] text-[#e8f2f2] text-center hover:underline">About Us</div>
            </div>
            <div className="min-w-[120px] flex flex-col items-center justify-start cursor-pointer" onClick={() => navigate('/contact')}>
              <div className="text-base leading-6 font-['Plus_Jakarta_Sans'] text-[#e8f2f2] text-center hover:underline">Contact</div>
            </div>
            <div className="min-w-[120px] flex flex-col items-center justify-start cursor-pointer" onClick={() => navigate('/terms')}>
              <div className="text-base leading-6 font-['Plus_Jakarta_Sans'] text-[#e8f2f2] text-center hover:underline">Terms of Service</div>
            </div>
            <div className="min-w-[120px] flex flex-col items-center justify-start cursor-pointer" onClick={() => navigate('/PrivacyPolicy')}>
              <div className="text-base leading-6 font-['Plus_Jakarta_Sans'] text-[#e8f2f2] text-center hover:underline">Privacy Policy</div>
            </div>
          </div>

          <div className="flex justify-center gap-4 flex-wrap items-center">
            <img className="w-6 h-6" alt="Facebook" src="/Figma_photoes/facebook.svg" />
            <img className="w-6 h-6" alt="Twitter" src="/Figma_photoes/twitter.svg" />
            <img className="w-6 h-6" alt="Instagram" src="/Figma_photoes/insta.svg" />
          </div>

          <div className="flex flex-col items-center justify-center text-sm text-[#ccc]">
            <div className="text-sm leading-6 font-['Plus_Jakarta_Sans'] text-[#e8f2f2] text-center">@2025 WanderNest, All rights reserved.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
