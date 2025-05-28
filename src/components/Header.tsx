import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/components/_header.scss";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("attendoUser");
  const fullName = storedUser ? JSON.parse(storedUser).fullName : "User";

  const handleLogout = () => {
    localStorage.removeItem("attendoUser");
    navigate("/");
    window.location.reload();
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="app-name">Attendo</h1>
      </div>

      <div className="header-right">
        <span className="user-name">Hi, {fullName}</span>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
