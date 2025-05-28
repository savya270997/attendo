import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import "./styles/main.scss";
import LoginRegister from "./components/LoginPage";
import Dashboard from "./components/Dashboard"; // Assuming you create this

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const handleAuthSuccess = (username: string, userData: any) => {
    console.log("Login success:", username, userData);
    setUserData(userData);
    setIsAuthenticated(true);
    // Store userData for access in other components like Header
    localStorage.setItem("attendoUser", JSON.stringify(userData));
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginRegister onAuthSuccess={handleAuthSuccess} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? <Dashboard /> : <Navigate to="/" replace />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
