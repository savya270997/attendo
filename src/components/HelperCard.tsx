import React, { useState } from "react";
import { FaHistory } from "react-icons/fa";
import "../styles/components/_helperCard.scss";

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
  const handleHistoryClick = () => setShowHistory(true); // You can open a modal here

  return (
    <div className="helper-card">
      <div className="helper-main">
        <div className="helper-info">
          <h4>{helper.name}</h4>
          <p>{helper.phone}</p>
        </div>
        <div className="attendance-buttons">
          <button
            className={`am-btn ${amPresent ? "present" : ""}`}
            onClick={toggleAm}
          >
            AM
          </button>
          <button
            className={`pm-btn ${pmPresent ? "present" : ""}`}
            onClick={togglePm}
          >
            PM
          </button>
        </div>
      </div>

      <div className="history-section">
        <FaHistory onClick={handleHistoryClick} className="history-icon" />
      </div>
    </div>
  );
};

export default HelperCard;
