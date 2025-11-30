import React from "react";
import { useState } from "react";
import { SidebarVisibilityContext } from "../Context/VisibilityContext";
import Navbar from "./navbar";
import Footer from "./footer";
import SidebarWrapper from "./SidebarWrapper";
import { useAuth } from "../Authentication/auth-context";
import ChatBot from "./ChatBot";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const { isAuthenticated } = useAuth();
  return (
    <SidebarVisibilityContext.Provider
      value={{ visible: sidebarVisible, setVisible: setSidebarVisible }}
    >
      <div className="flex flex-col min-h-screen w-full bg-gray-50">
        {/* Navbar */}
        <Navbar />

        {/* Sidebar only if authenticated */}
        <SidebarVisibilityContext.Provider
          value={{ visible: sidebarVisible, setVisible: setSidebarVisible }}
        >
          {isAuthenticated && sidebarVisible && (
            <SidebarWrapper sidebarVisible={sidebarVisible} />
          )}
          <main
            className={`flex-1 w-full pt-8 px-0 transition-all duration-500 ${
              isAuthenticated && sidebarVisible ? "ml-20" : "ml-0"
            }`}
          >
            {children}
          </main>
        </SidebarVisibilityContext.Provider>

        {/* Footer */}
        <div
          className={
            isAuthenticated && sidebarVisible
              ? "ml-60 transition-all duration-500"
              : "ml-0 transition-all duration-500"
          }
        >
          <Footer />
        </div>
        <ChatBot />
      </div>
    </SidebarVisibilityContext.Provider>
  );
};

export default Layout;
