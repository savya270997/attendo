import React, { useState } from "react";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import "../styles/LoginPage/LoginPage.scss";
import logo from "../assets/logo.png";

interface LoginRegisterProps {
  onAuthSuccess: (userId: string, userData: any) => void;
}

const LoginRegister: React.FC<LoginRegisterProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [identifier, setIdentifier] = useState(""); // username or email for login
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [home, setHome] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const usersCollection = collection(db, "users");
  const homesCollection = collection(db, "homes");

  // Helper: check if username is unique
  async function isUsernameUnique(username: string) {
    const q = query(usersCollection, where("username", "==", username));
    const snapshot = await getDocs(q);
    return snapshot.empty;
  }

  // Helper: check if phone is unique
  async function isPhoneUnique(phone: string) {
    const q = query(usersCollection, where("phone", "==", phone));
    const snapshot = await getDocs(q);
    return snapshot.empty;
  }

  // Helper: add home if doesn't exist
  async function addHomeIfNotExists(homeName: string) {
    if (!homeName.trim()) return;
    const q = query(homesCollection, where("name", "==", homeName.trim()));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      await addDoc(homesCollection, { name: homeName.trim() });
    }
  }

  // Register user (directly to Firestore)
  async function register() {
    setError("");
    setLoading(true);

    try {
      if (!email || !password || !username || !fullName || !phone || !home) {
        setError("Please fill all required fields.");
        setLoading(false);
        return;
      }

      // Check username uniqueness
      if (!(await isUsernameUnique(username.trim()))) {
        setError("Username already taken.");
        setLoading(false);
        return;
      }

      // Check phone uniqueness
      if (!(await isPhoneUnique(phone.trim()))) {
        setError("Phone number already registered.");
        setLoading(false);
        return;
      }

      // Check email uniqueness
      const qEmail = query(usersCollection, where("email", "==", email.trim()));
      const emailSnap = await getDocs(qEmail);
      if (!emailSnap.empty) {
        setError("Email already registered.");
        setLoading(false);
        return;
      }

      // Add home if new
      const docRef = await addDoc(usersCollection, {
        email: email.trim().toLowerCase(),
        username: username.trim().toLowerCase(),
        fullName: fullName.trim(),
        phone: phone.trim(),
        homes: [home.trim()],
        password: password.trim(), // For now - but HASH in prod
        createdAt: new Date().toISOString(),
      });

      // Success — call parent callback with new user ID and data
      onAuthSuccess(docRef.id, {
        email,
        username,
        fullName,
        phone,
        homes: [home],
      });
    } catch (e) {
      console.error(e);
      setError("Registration failed. Try again.");
    }

    setLoading(false);
  }

  // Login user by checking Firestore for matching username/email + password
  async function login() {
    setError("");
    setLoading(true);

    try {
      if (!identifier || !password) {
        setError("Please enter username/email and password.");
        setLoading(false);
        return;
      }
      const loginIdentifier = identifier.trim().toLowerCase();
      const inputPassword = password.trim();

      let q = query(usersCollection, where("email", "==", loginIdentifier));
      let snap = await getDocs(q);

      if (snap.empty) {
        // Try username if no email match
        q = query(usersCollection, where("username", "==", loginIdentifier));
        snap = await getDocs(q);
        if (snap.empty) {
          setError("User not found.");
          setLoading(false);
          return;
        }
      }

      let userDocId = "";
      let userData: any = null;

      snap.forEach((doc) => {
        userDocId = doc.id;
        userData = doc.data();
      });

      if (!userData || userData.password !== inputPassword) {
        setError("Incorrect password.");
        setLoading(false);
        return;
      }

      // Success - call parent
      onAuthSuccess(userDocId, userData);
      console.log("Login successful:", userData);
    } catch (e) {
      console.error(e);
      setError("Login failed. Try again.");
    }

    setLoading(false);
  }

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      await login();
    } else {
      await register();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form container">
      <img
        src={logo}
        className="logo"
        style={{ height: "10em", padding: "0em" }}
      ></img>{" "}
      <h3>Welcome to Attendo!</h3>
      <h2 className="text-primary text-center mb-5">
        {isLogin ? "Login" : "Register"}
      </h2>
      {error && <p className="error-msg">{error}</p>}
      {isLogin ? (
        <div className="form-group mb-4">
          <label htmlFor="identifier" className="label">
            Username or Email
          </label>
          <div className="field">
            <input
              type="text"
              id="identifier"
              className="input-field"
              placeholder="Username or email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>
        </div>
      ) : (
        <>
          <div className="form-group mb-4">
            <label htmlFor="email" className="label">
              Email
            </label>
            <div className="field">
              {" "}
              <input
                type="email"
                id="email"
                className="input-field"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group mb-4">
            <label htmlFor="username" className="label">
              Username
            </label>
            <div className="field">
              <input
                type="text"
                id="username"
                className="input-field"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group mb-4">
            <label htmlFor="fullName" className="label">
              Full Name
            </label>
            <div className="field">
              <input
                type="text"
                id="fullName"
                className="input-field"
                placeholder="Your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group mb-4">
            <label htmlFor="phone" className="label">
              Phone Number
            </label>
            <div className="field">
              <input
                type="tel"
                id="phone"
                className="input-field"
                placeholder="+123 456 7890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group mb-5">
            <label htmlFor="home" className="label">
              Home (Search/Add)
            </label>
            <div className="field">
              <input
                type="text"
                id="home"
                className="input-field"
                placeholder="Search or add your home"
                value={home}
                onChange={(e) => setHome(e.target.value)}
                required
              />
            </div>
          </div>
        </>
      )}
      <div className="form-group mb-4" style={{ position: "relative" }}>
        <label htmlFor="password" className="label">
          Password
        </label>
        <div className="field">
          <input
            type="password"
            id="password"
            className="input-field"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="form-group checkbox-container mb-5">
        <input
          type="checkbox"
          id="rememberMe"
          checked={rememberMe}
          onChange={() => setRememberMe(!rememberMe)}
          className="checkbox"
        />
        <label htmlFor="rememberMe" className="label-checkbox">
          Remember Me
        </label>
      </div>
      <button type="submit" className="button" disabled={loading}>
        {loading
          ? isLogin
            ? "Logging in..."
            : "Registering..."
          : isLogin
          ? "Login"
          : "Register"}
      </button>
      <p className="text-center mt-4">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <a
          href="#"
          onClick={() => {
            setError("");
            setIsLogin(!isLogin);
          }}
        >
          {isLogin ? "Register" : "Login"}
        </a>
      </p>
    </form>
  );
};

export default LoginRegister;
