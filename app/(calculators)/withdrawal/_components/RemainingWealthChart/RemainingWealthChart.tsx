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
import useStore from "@/utils/WithdrawalStore/withdrawal-store";
import { Card } from "primereact/card";
import { currencyFormatter } from "@/utils/formatCurrency";

// Custom Tooltip Content
const CustomTooltip = ({ active, payload, label }: TooltipProps<any, any>) => {

  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border rounded shadow-lg">
        <p className="label">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="intro" style={{ color: entry.color }}>
            {entry.name}: {currencyFormatter.format(entry.value)}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

const formatCurrencyForAxis = (tickItem: number): string =>
  currencyFormatter.format(tickItem);

const WithdrawalChart = () => {
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
          Entnahmezeitraum
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={payments}
            margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis
              tickFormatter={formatCurrencyForAxis}
              width={100} // Increase the width as needed to avoid cutting off labels
              domain={[0, "auto"]}
            />{" "}
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              type="monotone"
              dataKey="remainingWealth"
              stroke="#CC6CE7"
              fill="#CC6CE7"
              name={"Verbleibendes Kapitalvermögen"}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default WithdrawalChart;
