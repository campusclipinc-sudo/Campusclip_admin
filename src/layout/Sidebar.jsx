import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faGear,
  faSchool,
  faUsers,
  faCalendarDays,
  faHouse,
  faCreditCard,
  faUserGraduate,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../../src/assets/logo.png";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      {
        to: "/dashboard",
        icon: faChartLine,
        label: "Dashboard",
        iconColor: "#6366f1",
        iconBg: "rgba(99,102,241,0.18)",
        exact: true,
      },
    ],
  },
  {
    label: "Management",
    items: [
      {
        to: "/classes",
        icon: faSchool,
        label: "Classes",
        iconColor: "#8b5cf6",
        iconBg: "rgba(139,92,246,0.18)",
      },
      {
        to: "/clubs",
        icon: faUsers,
        label: "Clubs",
        iconColor: "#ec4899",
        iconBg: "rgba(236,72,153,0.18)",
      },
      {
        to: "/students",
        icon: faUserGraduate,
        label: "Students",
        iconColor: "#06b6d4",
        iconBg: "rgba(6,182,212,0.18)",
      },
      {
        to: "/feed",
        icon: faHouse,
        label: "Feed",
        iconColor: "#10b981",
        iconBg: "rgba(16,185,129,0.18)",
      },
    ],
  },
  {
    label: "Finance",
    items: [
      {
        to: "/events",
        icon: faCalendarDays,
        label: "Events",
        iconColor: "#f59e0b",
        iconBg: "rgba(245,158,11,0.18)",
      },
      {
        to: "/transactions",
        icon: faCreditCard,
        label: "Transactions",
        iconColor: "#22c55e",
        iconBg: "rgba(34,197,94,0.18)",
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        to: "/settings",
        icon: faGear,
        label: "Settings",
        iconColor: "#94a3b8",
        iconBg: "rgba(148,163,184,0.18)",
      },
    ],
  },
];

const Sidebar = ({ collapsed, mobileOpen, onCloseMobile }) => {
  const location = useLocation();
  const [frontLogo, setFrontLogo] = useState(null);

  useEffect(() => {
    const loadLogo = () => {
      const stored = localStorage.getItem("front_logo");
      setFrontLogo(stored || null);
    };
    loadLogo();
    const handler = () => loadLogo();
    window.addEventListener("front_logo_updated", handler);
    return () => window.removeEventListener("front_logo_updated", handler);
  }, []);

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.to;
    return location.pathname.startsWith(item.to);
  };

  return (
    <aside
      className={`admin-sidebar ${collapsed ? "collapsed" : ""} ${
        mobileOpen ? "open" : ""
      }`}
    >
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="logo-wrap">
          <img src={frontLogo || logo} alt="Logo" />
        </div>
        {!collapsed && (
          <div className="brand-text">
            <span className="brand-name">CampusClip</span>
            <span className="brand-sub">Admin Panel</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav flex-column">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <span className="nav-group-label">{group.label}</span>
            )}
            {group.items.map((item) => {
              const active = isActive(item);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onCloseMobile}
                  className={`nav-link${active ? " active" : ""}`}
                  title={collapsed ? item.label : undefined}
                >
                  <span
                    className="nav-icon-box"
                    style={
                      active
                        ? {}
                        : { background: item.iconBg, color: item.iconColor }
                    }
                  >
                    <FontAwesomeIcon icon={item.icon} />
                  </span>
                  <span className="item-label">{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="sidebar-footer">
          <div className="sidebar-version">v1.0.0 · Campus Clip</div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
