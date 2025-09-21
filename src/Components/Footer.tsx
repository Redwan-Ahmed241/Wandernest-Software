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
        { label: "Terms of Service", path: "/terms" },
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
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg">
                <img
                  src="/Figma_photos/wandernest.svg"
                  alt="WanderNest"
                  className="w-7 h-7 filter brightness-0 invert"
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
                WanderNest
              </span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Discover Bangladesh's hidden gems and create unforgettable
              memories with our curated travel experiences.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-gray-600 hover:scale-110 ${social.hoverColor}`}
                >
                  <img
                    src={social.icon}
                    alt={social.name}
                    className="w-5 h-5"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-lg font-semibold text-white">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => navigate(link.path)}
                      className="text-gray-300 hover:text-white transition-colors duration-200 hover:translate-x-1 transform"
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
      <div className="border-t border-gray-700 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4">
            <div className="text-gray-400 text-sm">
              © 2025 WanderNest. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
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
