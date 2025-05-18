import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import "./styles/main.scss";
import LoginPage from "./components/LoginPage";
import "./styles/LoginPage/LoginPage.scss";

const App: React.FC = () => {
  return <LoginPage />;
};

export default App;
