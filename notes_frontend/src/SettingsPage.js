import React, { useState } from "react";

/**
 * Minimal Settings Page with a theme toggle placeholder.
 * Sleek, modern, light design in keeping with app style.
 */
// PUBLIC_INTERFACE
function SettingsPage({ theme, onToggleTheme }) {
  // Placeholder demo: local notification toggle
  const [notifications, setNotifications] = useState(false);

  return (
    <div
      style={{
        maxWidth: 520,
        margin: "3rem auto 0 auto",
        padding: "2.2rem 1.7rem",
        background: "#fff",
        borderRadius: 13,
        boxShadow: "0 2px 24px rgba(0,0,0,0.07)",
        color: "var(--text-main)",
      }}
      data-testid="settings-container"
    >
      <h2 style={{ fontWeight: 800, fontSize: 27, marginBottom: 20, color: "var(--primary)" }}>
        Settings
      </h2>

      {/* Theme Toggle - delegates use to parent */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 12, fontWeight: 600 }}>
          <span>App Theme:</span>
          <button
            type="button"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            onClick={onToggleTheme}
            style={{
              background: "var(--secondary)",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "6px 18px",
              cursor: "pointer",
              fontSize: 16,
              fontWeight: 600,
              marginLeft: 6,
            }}
          >
            {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>
        </label>
        <div style={{ fontSize: 14, color: "var(--text-muted)", marginLeft: 3, marginTop: 2 }}>
          {theme === "light"
            ? "Currently using bright mode. Click to change."
            : "Currently using dark mode. Click to change."}
        </div>
      </div>

      {/* Placeholder Notification Toggle (demonstration) */}
      <div style={{ marginBottom: 21 }}>
        <label
          style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 600 }}
          htmlFor="toggle-notifications"
        >
          <span>Notifications:</span>
          <input
            type="checkbox"
            id="toggle-notifications"
            checked={notifications}
            onChange={e => setNotifications(e.target.checked)}
            style={{
              width: 21,
              height: 21,
              accentColor: "var(--primary)",
              marginLeft: 6,
              cursor: "pointer"
            }}
          />
        </label>
        <div style={{ fontSize: 14, color: "var(--text-muted)", marginLeft: 3, marginTop: 2 }}>
          (Demo toggle - does not persist)
        </div>
      </div>

      <div style={{ marginTop: 26, fontSize: 14, color: "var(--text-muted)" }}>
        <div>More settings coming soon!</div>
      </div>
    </div>
  );
}

export default SettingsPage;
