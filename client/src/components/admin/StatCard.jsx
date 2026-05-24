import React from "react";

function StatCard({ title, value, subtext, color = "#1c3f3a" }) {
  return (
    <div className="stat-card" style={{
      backgroundColor: "#ffffff", padding: "24px", borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)", borderLeft: `5px solid ${color}`,
      display: "flex", flexDirection: "column", gap: "8px", flex: 1, minWidth: "220px",
      boxSizing: "border-box"
    }}>
      <p style={{ margin: 0, fontSize: "14px", color: "#777", fontWeight: "500" }}>
        {title}
      </p>
      <h2 style={{ margin: 0, fontSize: "24px", color: "#111", fontWeight: "700" }}>
        {value}
      </h2>
      {subtext && (
        <span style={{ fontSize: "12px", color: subtext.startsWith("↑") ? "#27ae60" : "#e74c3c", fontWeight: "600" }}>
          {subtext}
        </span>
      )}
    </div>
  );
}

export default StatCard;