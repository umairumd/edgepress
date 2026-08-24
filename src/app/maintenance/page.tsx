"use client";

import { useState } from "react";
import Image from "next/image";

export default function MaintenancePage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/maintenance-bypass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("Incorrect password. Try again.");
        return;
      }
      window.location.href = "/";
    } catch {
      setError("Incorrect password. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="td-maintenance-page">
      <div className="td-maintenance-geometry" aria-hidden="true">
        <Image
          src="/assets/img/logo/inoma-logo-geometry.png"
          alt=""
          width={300}
          height={300}
        />
      </div>
      <div className="td-maintenance-inner">
        <div className="td-maintenance-logo">
          <Image
            src="/assets/img/logo/inoma-logo-for-dark.png"
            alt="Inoma"
            width={180}
            height={48}
            priority
          />
        </div>
        <h1 className="td-maintenance-title">We&apos;re Making Things Better</h1>
        <p className="td-maintenance-subtitle">
          We&apos;re currently updating our site to serve you better. We&apos;ll be back shortly.
        </p>
        <input
          className="td-maintenance-input"
          type="password"
          placeholder="Enter access password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !loading) void handleSubmit();
          }}
          autoComplete="current-password"
        />
        <button
          type="button"
          className="td-maintenance-btn"
          onClick={() => void handleSubmit()}
          disabled={loading}
        >
          {loading ? "Please wait…" : "Continue"}
        </button>
        {error ? <p className="td-maintenance-error">{error}</p> : null}
      </div>
    </div>
  );
}
