import "./App.css";
import "./styles/main.scss";
import LoginRegister from "./components/LoginPage";
import "./styles/LoginPage/LoginPage.scss";

function App() {
  const handleAuth = (
    email: string,
    password: string,
    isLogin: boolean,
    remember: boolean
  ) => {
    // For now, just log input
    console.log({ email, password, isLogin, remember });
  };

  return (
    <div className="App">
      <LoginRegister onAuth={handleAuth} />
    </div>
  );
}

export default App;
