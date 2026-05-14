import React, { useState } from "react";
import { Container } from "react-bootstrap";
import Sidebar from "./Sidebar";
import AppHeader from "./AppHeader";
import { useTheme } from "../context/ThemeContext";
import "../scss/layout.scss";

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme } = useTheme();

  const toggleSidebar = () => setCollapsed((c) => !c);
  const toggleMobileSidebar = () => setMobileOpen((o) => !o);

  return (
    <div className={`admin-shell ${collapsed ? "is-collapsed" : ""} ${mobileOpen ? "is-mobile-open" : ""}`} data-theme={theme}>
      {mobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-label="Close sidebar"
          role="button"
        />
      )}
      <Sidebar
        collapsed={collapsed}
        onCloseMobile={() => setMobileOpen(false)}
        mobileOpen={mobileOpen}
        onCollapseClick={toggleSidebar}
        onHamburgerClick={toggleMobileSidebar}
      />
      <div className="admin-main">
        <AppHeader onHamburgerClick={toggleMobileSidebar} onCollapseClick={toggleSidebar} collapsed={collapsed} />
        <Container fluid className="admin-content py-3">
          {children}
        </Container>
      </div>
    </div>
  );
};

export default Layout;
