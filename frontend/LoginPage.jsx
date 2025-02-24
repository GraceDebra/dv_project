import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      // Dummy login authentication
      const validUser = "admin";
      const validPass = "password";

      if (username === validUser && password === validPass) {
        localStorage.setItem("isAuthenticated", "true");
        navigate("/"); // Redirect to home after login
      } else {
        setError("Invalid username or password!");
      }
    } else {
      // Dummy signup - Just console log for now
      console.log("User signed up:", username, password);
      alert("Account created successfully! Please log in.");
      setIsLogin(true); // Switch to login after signup
    }
  };

  return (
    <div className="login-page">
      <header className="login-header">
        <button onClick={() => (window.location.href = "https://weather.com")} className="quick-exit-btn">
          Quick Exit
        </button>
      </header>

      <main className="login-main">
        <h2 className="login-title">{isLogin ? "Login to your Account" : "Create an Account"}</h2>
        {error && <p className="error-message">{error}</p>}
        <form className="login-form" onSubmit={handleSubmit}>
          <label>Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {!isLogin && (
            <>
              <label>Confirm Password</label>
              <input type="password" required />
            </>
          )}
          <button className="login-btn" type="submit">{isLogin ? "Login" : "Sign Up"}</button>
        </form>
        <p>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button className="toggle-btn" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </p>
      </main>
    </div>
  );
}

export default LoginPage;
