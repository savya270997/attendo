import React from "react";
import Header from "./Header";
import HelperCard from "./HelperCard";
import "../styles/components/_dashboard.scss";

// Dummy data for now
const helpers = [
  {
    id: "1",
    name: "Rani",
    phone: "9876543210",
    status: { am: false, pm: false },
  },
  {
    id: "2",
    name: "Sita",
    phone: "9876512345",
    status: { am: true, pm: false },
  },
];

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <Header />
      <div className="dashboard-container">
        <h2 className="dashboard-title">Your Helpers</h2>
        <div className="helper-grid">
          {helpers.map((helper) => (
            <HelperCard key={helper.id} helper={helper} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
