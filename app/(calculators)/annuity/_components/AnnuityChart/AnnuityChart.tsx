"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
  Legend,
} from "recharts";
import useStore from "@/utils/AnnuityStore/annuity-store";
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

const AnnuityChart = () => {
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
          Zinszahlungen und Tilgung über die Kreditlaufzeit
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={payments}
            margin={{ top: 10, right: 30, left: 30, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={formatCurrencyForAxis} width={80} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="principalPayment"
              stackId="1"
              name="Tilgung"
              stroke="#72C94F"
              fill="#72C94F"
            />
            <Area
              type="monotone"
              dataKey="interestPayment"
              stackId="1"
              name="Zinszahlungen"
              stroke="#47D6DB"
              fill="#47D6DB"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default AnnuityChart;
