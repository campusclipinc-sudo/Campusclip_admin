// DetailField.jsx (small tweak: support inline layout)
import React from "react";
import { Col } from "react-bootstrap";

const DetailField = ({
  label,
  value,
  span = 6,
  className = "",
  valueClassName = "",
}) => {
  return (
    <Col xs={12} md={span} className={`mb-3 ${className}`}>
      <div className="d-flex flex-column">
        <span className="text-uppercase text-muted small fw-semibold">
          {label}
        </span>
        <span className={`fw-semibold ${valueClassName}`}>
          {value || "-"}
        </span>
      </div>
    </Col>
  );
};

export default DetailField;
