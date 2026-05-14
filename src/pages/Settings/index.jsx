import React from "react";
import { Card } from "react-bootstrap";
import TabNav from "../../components/TabNav";
import General from "./general";
import "../../scss/settings.scss";

const Settings = () => {
  return (
    <div className="settings-page">
      <h2 className="page-title mb-3">Settings</h2>
      <TabNav items={[{ label: "General", to: "/settings" }]} />
      <Card className="settings-card shadow-sm">
        <Card.Body>
          <General />
        </Card.Body>
      </Card>
    </div>
  );
};

export default Settings;
