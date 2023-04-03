import React, { useState, useEffect } from 'react'

export default function Checkbox({ children, value, onChange }:
  {
    value: "" | "checked" | "indeterminate"
    children?: React.ReactNode,
    onChange: (v: "" | "checked" | "indeterminate") => void

  }) {

  function handleCheckboxChange() {
    onChange(value === "" ? "checked" : "")

  }


  return (
    <div className=' '>
      <label>

        <input
          type="checkbox"
          checked={value === "checked"}
          onChange={handleCheckboxChange}
          className="form-checkbox h-4 w-4 text-indigo-600 focus:ring-4 cursor-pointer"
          ref={(el) => {
            if (el) {
              el.indeterminate = value === "indeterminate";
            }
          }}
        />
        <span className=' pl-2 cursor-pointer'>{children}</span>
      </label>
    </div>
  );
}
