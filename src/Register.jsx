import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import the useNavigate hook
import styles from './Register.module.css';

const Register = () => {
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();  // Initialize useNavigate

  const handleSubmit = (e) => {
    e.preventDefault();

    // If it's a Sign In (not Sign Up), navigate to the dashboard
    if (!isSignup) {
      // For now, assuming successful login, navigate to the dashboard
      navigate('/dashboard');
    }

    // Otherwise, handle the sign-up process here if needed
  };

  const handleEscapeClick = () => {
    // Navigate to a safe page when escape is clicked (e.g., Home or another safe page)
    navigate('/');
  };

  return (
    <div className={styles.overlay}>
      {/* Escape Button in the background */}
      <button className={styles.escapeButton} onClick={handleEscapeClick}>Quick Exit</button>

      <div className={styles.formContainer}>
        <h2>{isSignup ? "Sign Up" : "Sign In"}</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label>Username:</label>
          <input type="text" placeholder="Enter your Username" required />

          <label>Password:</label>
          <input type="password" placeholder="Enter your password" required />

          {isSignup && (
            <>
              <label>Confirm Password:</label>
              <input type="password" placeholder="Confirm your password" required />
            </>
          )}

          <button type="submit" className={styles.submitButton}>
            {isSignup ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <p>
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <span className={styles.toggleLink} onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? "Sign in" : "Sign up"}
          </span>
        </p>

        <button className={styles.backButton} onClick={() => navigate('/')}>Back to Home</button>
      </div>
    </div>
  );
};

export default Register;
