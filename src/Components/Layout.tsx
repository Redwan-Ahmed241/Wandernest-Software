import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="flex-1 w-full pt-16">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
