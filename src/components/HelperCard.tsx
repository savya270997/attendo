import React, { useState } from "react";
import "./HelperCard.scss";

interface HelperCardProps {
  name: string;
  onMark: (period: "AM" | "PM") => void;
  onHistory: () => void;
}

const HelperCard: React.FC<HelperCardProps> = ({ name, onMark, onHistory }) => {
  const [marked, setMarked] = useState<{ AM: boolean; PM: boolean }>({
    AM: false,
    PM: false,
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  const handleMark = (period: "AM" | "PM") => {
    if (!marked[period]) {
      setMarked((prev) => ({ ...prev, [period]: true }));
      onMark(period);
      (window as any).toast(`${period} leave marked for ${name}`, "success");
    } else {
      (window as any).toast(`${period} already marked`, "info");
    }
  };

  return (
    <div className="helper-card">
      <div className="card-header">
        <div className="avatar">{getInitials(name)}</div>
        <div className="helper-name">{name}</div>
        <button className="history-btn" onClick={onHistory}>
          History
        </button>
      </div>
      <div className="marking-buttons">
        <button
          className={marked.AM ? "marked" : ""}
          onClick={() => handleMark("AM")}
        >
          AM
        </button>
        <button
          className={marked.PM ? "marked" : ""}
          onClick={() => handleMark("PM")}
        >
          PM
        </button>
      </div>
    </div>
  );
};

export default HelperCard;
