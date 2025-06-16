"use client";
import { ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

import mockData from "@/app/components/data.json";

type DataPoint = {
  hour: number;
  confirm: number;
  deny: number;
};

const LineGraph = ({ postId }: { postId: number }) => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const filteredData = mockData.filter((d) => d.post_id === postId);
    setData(filteredData);
    setLoading(false);
    setError(null);
  }, [postId]);

  if (loading) return <p>Loading graph...</p>;
  if (error) return <p>{error}</p>;

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <XAxis
          dataKey="hour"
          tickFormatter={(tick) => {
            const hour = tick % 12 || 12;
            const ampm = tick < 12 ? "AM" : "PM";
            return `${hour}${ampm}`;
          }}
          label={{ value: "Hour", position: "insideBottomRight", offset: -5 }}
        />
        <YAxis
          width={20}
        />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="confirm"
          stroke="#3B82F6"
          name="Confirmed"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="deny"
          stroke="#EF4444"
          name="Denied"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineGraph;
