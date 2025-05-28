import React, { useState } from "react";
import { FaEllipsisV, FaHistory } from "react-icons/fa";
import "../styles/components/_helper-card.scss";

interface HelperProps {
  helper: {
    id: string;
    name: string;
    phone: string;
    status: { am: boolean; pm: boolean };
  };
}

const HelperCard: React.FC<HelperProps> = ({ helper }) => {
  const [amPresent, setAmPresent] = useState(helper.status.am);
  const [pmPresent, setPmPresent] = useState(helper.status.pm);
  const [showHistory, setShowHistory] = useState(false);

  const toggleAm = () => setAmPresent((prev) => !prev);
  const togglePm = () => setPmPresent((prev) => !prev);
  const toggleFullDay = () => {
    const newValue = !(amPresent && pmPresent);
    setAmPresent(newValue);
    setPmPresent(newValue);
  };

  const handleHistoryClick = () => setShowHistory(true); // Later: open modal

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    return parts
      .map((n) => n[0].toUpperCase())
      .join("")
      .slice(0, 2);
  };

  return (
    <div className="helper-card">
      <div className="card-header">
        <div className="avatar">{getInitials(helper.name)}</div>
        <FaEllipsisV className="menu-icon" />
      </div>

      <div className="card-body">
        <h4 className="helper-name">{helper.name}</h4>
        <p className="helper-phone">{helper.phone}</p>

        <div className="attendance-buttons">
          <button
            className={`attendance-btn ${amPresent ? "present" : ""}`}
            onClick={toggleAm}
          >
            AM
          </button>
          <button
            className={`attendance-btn ${pmPresent ? "present" : ""}`}
            onClick={togglePm}
          >
            PM
          </button>
          <button
            className={`attendance-btn ${
              amPresent && pmPresent ? "present" : ""
            }`}
            onClick={toggleFullDay}
          >
            Full Day
          </button>
        </div>
      </div>

      <div className="card-footer">
        <FaHistory onClick={handleHistoryClick} className="history-icon" />
      </div>
    </div>
  );
};

export default HelperCard;
