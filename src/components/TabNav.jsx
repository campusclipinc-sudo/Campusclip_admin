import React from "react";
import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "../scss/tabnav.scss";

// Common tab navigation component
// For routing-based tabs: props.items = [{ label: string, to: string }]
// For state-based tabs: props.items = [{ label: string, eventKey: string }], props.activeKey, props.onSelect
const TabNav = ({ items = [], activeKey, onSelect }) => {
  const location = useLocation();
  
  // Check if using routing-based navigation (has 'to' prop) or state-based (has 'eventKey' prop)
  const isRoutingBased = items.length > 0 && items[0].to !== undefined;
  
  if (isRoutingBased) {
    // Routing-based navigation (existing behavior - backward compatible)
    return (
      <div className="tabnav">
        <Nav variant="tabs" className="tabnav-list">
          {items.map((it) => (
            <Nav.Item key={it.to}>
              <Nav.Link as={Link} to={it.to} active={location.pathname === it.to}>
                {it.label}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
      </div>
    );
  }
  
  // State-based navigation (new feature)
  return (
    <div className="tabnav">
      <Nav variant="tabs" className="tabnav-list" activeKey={activeKey} onSelect={onSelect}>
        {items.map((it) => (
          <Nav.Item key={it.eventKey}>
            <Nav.Link eventKey={it.eventKey}>
              {it.label}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    </div>
  );
};

export default TabNav;
