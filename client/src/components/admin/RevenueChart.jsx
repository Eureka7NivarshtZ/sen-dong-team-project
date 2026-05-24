import React from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

function RevenueChart() {
  // Dữ liệu doanh thu 6 tháng gần đây
  const data = [
    { month: "T1", revenue: 12 },
    { month: "T2", revenue: 19 },
    { month: "T3", revenue: 10 },
    { month: "T4", revenue: 8 },
    { month: "T5", revenue: 22 },
    { month: "T6", revenue: 30 },
  ];

  return (
    <div className="chart-box" style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: "1px solid #f0f0f0", textAlign: "left" }}>
      <h2 style={{ margin: "0 0 20px 0", fontSize: "16px", color: "#333333", fontWeight: "bold" }}>
        Doanh thu 6 tháng gần đây
      </h2>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="month" stroke="#888888" fontSize={13} tickLine={false} />
            <Tooltip 
              formatter={(value) => [`${value} Triệu`, "Doanh thu"]}
              contentStyle={{ borderRadius: "6px", border: "1px solid #eee" }}
            />
            <Bar
              dataKey="revenue"
              fill="#74c27f"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default RevenueChart;