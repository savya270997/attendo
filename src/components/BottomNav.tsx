import React from "react";
import "./BottomNav.scss";
import { Home, PlusCircle, History, User } from "lucide-react";

interface BottomNavProps {
  active: "dashboard" | "add" | "history" | "profile";
  onNavigate: (view: "dashboard" | "add" | "history" | "profile") => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ active, onNavigate }) => {
  return (
    <div className="bottom-nav">
      <div
        className={`nav-item ${active === "dashboard" ? "active" : ""}`}
        onClick={() => onNavigate("dashboard")}
      >
        <Home className="icon" />
        Dashboard
      </div>
      <div
        className={`nav-item ${active === "add" ? "active" : ""}`}
        onClick={() => onNavigate("add")}
      >
        <PlusCircle className="icon" />
        Add
      </div>
      <div
        className={`nav-item ${active === "history" ? "active" : ""}`}
        onClick={() => onNavigate("history")}
      >
        <History className="icon" />
        History
      </div>
      <div
        className={`nav-item ${active === "profile" ? "active" : ""}`}
        onClick={() => onNavigate("profile")}
      >
        <User className="icon" />
        Profile
      </div>
    </div>
  );
};

export default BottomNav;
