import React, { useEffect, useState } from "react";

const API_BASE = "http://localhost:3001";

export default function App() {
  const [email, setEmail] = useState("demo@example.com");
  const [message, setMessage] = useState("Not submitted yet");
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/api/session`, {
      credentials: "include",
    }).catch(() => setMessage("Session initialization failed"));

    fetch(`${API_BASE}/api/csrf-token`, {
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("CSRF token fetch failed");
        }
        return response.json();
      })
      .then((data) => {
        setCsrfToken(data.csrfToken || "");
      })
      .catch(() => setMessage((prev) => `${prev} (CSRF token unavailable)`));
  }, []);

  async function submitEmail(event) {
    event.preventDefault();

    if (!csrfToken) {
      setMessage("CSRF token missing, cannot submit");
      return;
    }

    const response = await fetch(`${API_BASE}/api/account/email`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      setMessage("Submit failed");
      return;
    }

    const data = await response.json();
    setMessage(`Email changed to ${data.email}`);
  }

  return (
    <main style={{ maxWidth: 520, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Simple Web Target</h1>
      <p>This page sends a cookie-based email update request.</p>
      <form onSubmit={submitEmail}>
        <label>
          New email
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            style={{ display: "block", width: "100%", margin: "8px 0" }}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      <p>{message}</p>
    </main>
  );
}
