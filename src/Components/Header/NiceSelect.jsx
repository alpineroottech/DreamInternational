import React, { useState, useRef, useEffect } from "react";

const NiceSelect = ({ options = [], placeholder = "Select", onChange }) => {
  const [selected, setSelected] = useState(placeholder);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setSelected(placeholder);
  }, [placeholder]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const pick = (option) => {
    setSelected(option.label);
    setIsOpen(false);
    onChange?.(option.value);
  };

  return (
    <div className="nice-select-wrapper">
      <div className={`nice-select ${isOpen ? "open" : ""}`} ref={dropdownRef} onClick={() => setIsOpen(!isOpen)}>
        <span className="current">{selected}</span>
        <ul className="list">
          {options.map((option, index) => (
            <li
              key={`${option.value}-${index}`}
              className="option"
              onClick={(e) => {
                e.stopPropagation();
                pick(option);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NiceSelect;
