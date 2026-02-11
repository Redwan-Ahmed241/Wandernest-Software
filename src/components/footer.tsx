import React from "react";
import { useNavigate } from "react-router-dom";

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const footerSections = [
    {
      title: "Company",
      links: [
        { label: "About Us", path: "/about-us" },
        { label: "Careers", path: "/careers" },
        { label: "Press", path: "/press" },
        { label: "Blog", path: "/blogs" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", path: "/help-center" },
        { label: "Trust & Safety", path: "/trust-safety" },
        { label: "Emergency", path: "/emergency" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Terms of Service", path: "/terms-of-service" },
        { label: "Privacy Policy", path: "/privacy-policy" },
        { label: "Cookie Policy", path: "/cookie-policy" },
      ],
    },
    {
      title: "Services",
      links: [
        { label: "Visa Assistance", path: "/visa-assistance" },
        { label: "Guide hiring", path: "/all-guides" },
        { label: "Hotel Booking", path: "/hotels-rooms" },
        { label: "Package Booking", path: "/packages" },
      ],
    },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      icon: "/Figma_photos/facebook.svg",
      url: "https://facebook.com/wandernest",
      hoverColor: "hover:text-blue-600",
    },
    {
      name: "Twitter",
      icon: "/Figma_photos/twitter.svg",
      url: "https://twitter.com/wandernest",
      hoverColor: "hover:text-blue-400",
    },
    {
      name: "Instagram",
      icon: "/Figma_photos/insta.svg",
      url: "https://instagram.com/wandernest",
      hoverColor: "hover:text-pink-600",
    },
  ];

  return (
    <footer className="bg-gradient-to-br from-[#4a6b5b] to-[#0d1c1c] text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#6ab187] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#abb79a] rounded-full blur-3xl"></div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-10">
          {/* Brand Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-white/20">
                <img
                  src="/Figma_photos/wandernest.svg"
                  alt="WanderNest"
                  className="w-8 h-8 filter brightness-0 invert"
                />
              </div>
              <span className="text-2xl font-bold text-white">
                WanderNest
              </span>
            </div>
            <p className="text-white/80 leading-relaxed text-sm">
              Discover Bangladesh's hidden gems and create unforgettable
              memories with our curated travel experiences.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:scale-110 hover:border-white/30"
                >
                  <img
                    src={social.icon}
                    alt={social.name}
                    className="w-5 h-5 filter brightness-0 invert"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-lg font-bold text-white">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => navigate(link.path)}
                      className="text-white/70 hover:text-white transition-all duration-200 hover:translate-x-1 transform text-sm"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black/20 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-white/60 text-sm">
              © 2025 WanderNest. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm text-white/60">
              <span>Made with ❤️ in Bangladesh</span>
              <div className="flex items-center space-x-2">
                <span>🌍</span>
                <span>Explore • Dream • Discover</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
