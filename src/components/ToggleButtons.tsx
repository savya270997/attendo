import React from "react";
import "./ToggleButtons.scss";

interface ToggleButtonsProps {
  active: "AM" | "PM" | null;
  onToggle: (value: "AM" | "PM") => void;
}

const ToggleButtons: React.FC<ToggleButtonsProps> = ({ active, onToggle }) => {
  return (
    <div className="toggle-buttons">
      <button
        className={`toggle ${active === "AM" ? "toggle--active" : ""}`}
        onClick={() => onToggle("AM")}
      >
        AM
      </button>
      <button
        className={`toggle ${active === "PM" ? "toggle--active" : ""}`}
        onClick={() => onToggle("PM")}
      >
        PM
      </button>
    </div>
  );
};

export default ToggleButtons;
