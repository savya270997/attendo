import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import "../styles/LoginPage/LoginPage.scss";

interface LoginRegisterProps {
  onAuthSuccess: (uid: string) => void;
}

const LoginRegister: React.FC<LoginRegisterProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [identifier, setIdentifier] = useState(""); // email or username input for login
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [home, setHome] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  // Helpers

  // Check if username is unique
  async function isUsernameUnique(username: string) {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  }

  // Check if phone is unique
  async function isPhoneUnique(phone: string) {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("phone", "==", phone));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  }

  // Check if home exists, if not add it
  async function addHomeIfNotExists(homeName: string) {
    if (!homeName) return;
    const homesRef = collection(db, "homes");
    const q = query(homesRef, where("name", "==", homeName));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      await addDoc(homesRef, { name: homeName.trim() });
    }
  }

  // Login function (with username or email)
  async function login(identifier: string, password: string) {
    setLoading(true);
    try {
      let emailToUse = identifier;

      if (!identifier.includes("@")) {
        // assume username, lookup email
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", identifier));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          alert("No user found with this username");
          setLoading(false);
          return;
        }
        emailToUse = querySnapshot.docs[0].data().email;
      }

      await signInWithEmailAndPassword(auth, emailToUse, password);
      onAuthSuccess(auth.currentUser!.uid);
    } catch (error: any) {
      alert(error.message || "Login failed");
    }
    setLoading(false);
  }

  // Register function
  async function register(
    email: string,
    password: string,
    username: string,
    fullName: string,
    phone: string,
    home: string
  ) {
    setLoading(true);
    try {
      // Validate username uniqueness
      if (!(await isUsernameUnique(username))) {
        alert("Username already taken. Please choose another.");
        setLoading(false);
        return;
      }
      // Validate phone uniqueness
      if (!(await isPhoneUnique(phone))) {
        alert("Phone number already registered.");
        setLoading(false);
        return;
      }

      // Check email uniqueness by checking sign-in methods for email
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length > 0) {
        alert("Email already registered.");
        setLoading(false);
        return;
      }

      // Create user with Firebase auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      // Add home if new
      await addHomeIfNotExists(home);

      // Save user profile to Firestore
      await setDoc(doc(db, "users", uid), {
        uid,
        email,
        username,
        fullName,
        phone,
        homes: [home.trim()],
        createdAt: new Date().toISOString(),
      });

      onAuthSuccess(uid);
    } catch (error: any) {
      alert(error.message || "Registration failed");
    }
    setLoading(false);
  }

  // Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      if (!identifier || !password) {
        alert("Please enter username/email and password.");
        return;
      }
      await login(identifier.trim(), password);
    } else {
      if (!email || !password || !username || !fullName || !phone || !home) {
        alert("Please fill all required fields.");
        return;
      }
      await register(
        email.trim(),
        password,
        username.trim(),
        fullName.trim(),
        phone.trim(),
        home.trim()
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form container">
      <h2 className="text-primary text-center mb-5">
        {isLogin ? "Login" : "Register"}
      </h2>

      {/* Login input - username or email */}
      {isLogin && (
        <div className="form-group mb-4">
          <label htmlFor="identifier" className="label">
            Username or Email
          </label>
          <input
            type="text"
            id="identifier"
            className="input-text"
            placeholder="Username or email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
        </div>
      )}

      {/* Register inputs */}
      {!isLogin && (
        <>
          <div className="form-group mb-4">
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="input-text"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-4">
            <label htmlFor="username" className="label">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="input-text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-4">
            <label htmlFor="fullName" className="label">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              className="input-text"
              placeholder="Your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-4">
            <label htmlFor="phone" className="label">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              className="input-text"
              placeholder="+123 456 7890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-5">
            <label htmlFor="home" className="label">
              Home (Search/Add)
            </label>
            <input
              type="text"
              id="home"
              className="input-text"
              placeholder="Search or add your home"
              value={home}
              onChange={(e) => setHome(e.target.value)}
              required
            />
          </div>
        </>
      )}

      {/* Password input */}
      <div className="form-group mb-4" style={{ position: "relative" }}>
        <label htmlFor="password" className="label">
          Password
        </label>
        <input
          type="password"
          id="password"
          className="input-text"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {/* Remember me */}
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

      {/* Submit button */}
      <button type="submit" className="button" disabled={loading}>
        {loading
          ? isLogin
            ? "Logging in..."
            : "Registering..."
          : isLogin
          ? "Login"
          : "Register"}
      </button>

      {/* Toggle login/register */}
      <p className="text-center mt-4">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          type="button"
          className="button secondary"
          onClick={() => setIsLogin(!isLogin)}
          disabled={loading}
        >
          {isLogin ? "Register" : "Login"}
        </button>
      </p>
    </form>
  );
};

export default LoginRegister;
