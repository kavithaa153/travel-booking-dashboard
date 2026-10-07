import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

import "./Layout.css";

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="app-layout">

      <Sidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        />
      )}

      <div className="main-section">

        <Navbar
          onMenuClick={openSidebar}
        />

        <main className="main-content">
          <Outlet />
        </main>

        <Footer />

      </div>

    </div>
  );
}

export default Layout;