"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import styles from "./Auth.module.css"

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const router = useRouter()

  function handleChange(event) {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    // Handle login form submission...
  }

  return (
    <div className={styles.authContainer}>
      <h2>Login</h2>
      <p className={styles.authDescription}>Enter your credentials to access your account.</p>
      <form onSubmit={handleSubmit} className={styles.authForm}>
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className={styles.authButton}>
          Login
        </button>
      </form>
      <p className={styles.authSwitch}>
        Don't have an account?{" "}
        <button onClick={() => router.push("/sign-up")} className={styles.authLink}>
          Sign Up
        </button>
      </p>
    </div>
  )
}