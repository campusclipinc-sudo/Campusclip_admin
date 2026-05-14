import React from "react";
import { Container, Nav, Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faMoon,
  faSun,
  faChevronLeft,
  faSignOutAlt,
  faUser,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { isUserLoggedIn, logout } from "../store/userSlice";
import { useNavigate, useLocation } from "react-router-dom";

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/classes": "Classes",
  "/clubs": "Clubs",
  "/events": "Events",
  "/transactions": "Transactions",
  "/students": "Students",
  "/feed": "Feed",
  "/settings": "Settings",
  "/profile": "Profile",
};

const getPageTitle = (pathname) => {
  const match = Object.keys(PAGE_TITLES).find((key) =>
    pathname === key || (key !== "/dashboard" && pathname.startsWith(key))
  );
  return match ? PAGE_TITLES[match] : "Admin";
};

const AppHeader = ({ onHamburgerClick, onCollapseClick, collapsed }) => {
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const loggedIn = useSelector(isUserLoggedIn);
  const user = useSelector((s) => s.user?.user);

  const avatarLabel = (user?.name || user?.email || "U")
    .toString()
    .charAt(0)
    .toUpperCase();

  const displayName = user?.name || user?.email || "Admin";
  const pageTitle = getPageTitle(location.pathname);

  return (
    <nav className="admin-header navbar">
      <Container fluid className="px-0">
        <div className="d-flex align-items-center gap-2">
          {/* Desktop collapse toggle */}
          <button
            className="collapse-btn-modern d-none d-lg-inline-flex"
            onClick={onCollapseClick}
            aria-label="Toggle sidebar"
          >
            <FontAwesomeIcon
              icon={faChevronLeft}
              style={{
                transform: collapsed ? "rotate(180deg)" : "none",
                transition: "transform 220ms ease",
                fontSize: "0.8rem",
              }}
            />
          </button>

          {/* Mobile hamburger */}
          <button
            className="collapse-btn-modern d-lg-none"
            onClick={onHamburgerClick}
            aria-label="Open menu"
          >
            <FontAwesomeIcon icon={faBars} style={{ fontSize: "0.9rem" }} />
          </button>

          {/* Page title */}
          <span className="header-page-title d-none d-sm-inline ms-1">
            {pageTitle}
          </span>
        </div>

        <Nav className="ms-auto align-items-center gap-2 flex-row">
          {/* Theme toggle */}
          <button
            className="icon-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <FontAwesomeIcon
              icon={theme === "dark" ? faSun : faMoon}
              style={{ fontSize: "0.85rem" }}
            />
          </button>

          {/* Notifications (decorative) */}
          <button className="icon-btn" aria-label="Notifications">
            <FontAwesomeIcon
              icon={faBell}
              style={{ fontSize: "0.85rem" }}
            />
          </button>

          {/* Profile dropdown */}
          {loggedIn && (
            <Dropdown align="end">
              <Dropdown.Toggle as="div" className="profile-toggle">
                <div className="d-flex align-items-center gap-2 cursor-pointer">
                  <div
                    className="profile-avatar"
                    title={displayName}
                  >
                    {avatarLabel}
                  </div>
                  <div className="profile-user-info d-none d-md-block">
                    <div className="user-name">{displayName}</div>
                    <div className="user-role">Administrator</div>
                  </div>
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu className="profile-menu">
                <Dropdown.Item onClick={() => navigate("/profile")}>
                  <FontAwesomeIcon icon={faUser} />
                  Profile
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item
                  className="text-danger"
                  onClick={() => {
                    dispatch(logout());
                    navigate("/login");
                  }}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </Nav>
      </Container>
    </nav>
  );
};

export default AppHeader;
