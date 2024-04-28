"use client";

import React from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import useStore from "@/utils/store";
import { Card } from "primereact/card";

// Custom Tooltip Content
const CustomTooltip = ({ active, payload, label }: TooltipProps<any, any>) => {
  const numberFormatter = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border rounded shadow-lg">
        <p className="label">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="intro" style={{ color: entry.color }}>
            {entry.name}: {numberFormatter.format(entry.value)}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

// Custom Y-axis label formatter
const formatYAxis = (tickItem: number) => {
  const numberFormatter = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return numberFormatter.format(tickItem);
};

const RemainingLoanChart = () => {
  const payments = useStore((state) => state.payments);

  return (
    <div>
      <Card>
        <h2
          style={{
            textAlign: "center",
            marginBottom: "10px",
            marginTop: "15px",
          }}
        >
          Rückzahlungszeitraum
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={payments}
            margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis
              tickFormatter={formatYAxis}
              width={100} // Increase the width as needed to avoid cutting off labels
              domain={[0, "auto"]}
            />{" "}
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              type="monotone"
              dataKey="remainingLoan"
              stroke="#CC6CE7"
              fill="#CC6CE7"
              name={"Verbleibender Kreditbetrag"}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default RemainingLoanChart;
