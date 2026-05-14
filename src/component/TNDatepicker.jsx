// TNDatepicker.jsx
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../scss/TNDatepicker.scss";
const TNDatepicker = ({
  selected,
  onChange,
  placeholderText = "Select date",
  dateFormat = "yyyy-MM-dd",
  className = "",
  ...props
}) => {
  return (
    <div className={`tn-datepicker ${className}`}>
      <DatePicker
        selected={selected}
        onChange={onChange}
        placeholderText={placeholderText}
        dateFormat={dateFormat}
        popperPlacement="bottom-start"
        showPopperArrow={false}
        {...props}
      />
    </div>
  );
};

export default TNDatepicker;
