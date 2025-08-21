import React from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
 


const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1, paddingTop: '64px' }}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
