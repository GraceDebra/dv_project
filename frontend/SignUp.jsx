"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import styles from "./Auth.module.css"

export default function SignUp() {
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" })
  const router = useRouter()

  function handleChange(event) {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    // Handle sign-up form submission...
  }

  return (
    <div className={styles.authContainer}>
      <h2>Sign Up</h2>
      <p className={styles.authDescription}>Create a new account to get started.</p>
      <form onSubmit={handleSubmit} className={styles.authForm}>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
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
          Sign Up
        </button>
      </form>
      <p className={styles.authSwitch}>
        Already have an account?{" "}
        <button onClick={() => router.push("/login")} className={styles.authLink}>
          Login
        </button>
      </p>
    </div>
  )
}