"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const api_url = process.env.NEXT_PUBLIC_API_URL;
const tzOffsetMinutes = new Date().getTimezoneOffset(); 


type VoteDataPoint = {
  hour: number;
  confirm: number;
  deny: number;
};

type Props = {
  postId: number;
};

export default function VoteBarChart({ postId }: Props) {
  const [data, setData] = useState<VoteDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const generateFullDayData = (raw: VoteDataPoint[]): VoteDataPoint[] => {
    const map = new Map(raw.map((d) => [d.hour, d]));
    return Array.from({ length: 24 }, (_, hour) => {
      return map.get(hour) || { hour, confirm: 0, deny: 0 };
    });
  };

  // Converts 24-hour number to 12-hour AM/PM string
  const formatHourLabel = (hour: number): string => {
    const period = hour < 12 ? "AM" : "PM";
    const formatted = hour % 12 === 0 ? 12 : hour % 12;
    return `${formatted}${period}`;
  };

  useEffect(() => {
    async function fetchVotes() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${api_url}/posts/${postId}/points?tz_offset=${tzOffsetMinutes}`);
        if (!res.ok)
          throw new Error(`Failed to fetch votes: ${res.statusText}`);
        const json = await res.json();
        setData(generateFullDayData(json));
      } catch (err: any) {
        setError(err.message || "Unknown error");
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    if (postId) {
      fetchVotes();
    }
  }, [postId]);

  if (loading) return <p>Loading votes...</p>;
  if (error) return <p>Error loading votes: {error}</p>;
  if (data.length === 0) return <p>No votes found for this post.</p>;

  return (
    <div>
      <h1>Sightings Per Hour (Real-Time)</h1>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 10, bottom: 20, left: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="hour"
            ticks={[...Array(24).keys()]} // 0–23
            tickFormatter={formatHourLabel}
          />
          <YAxis
            label={{ value: "Votes", angle: -90, position: "insideLeft" }}
            allowDecimals={false}
          />
          <Tooltip
            labelFormatter={(label) =>
              `Hour: ${formatHourLabel(Number(label))}`
            }
          />
          <Legend />
          <Bar dataKey="confirm" name="Confirm" fill="#4caf50" />
          <Bar dataKey="deny" name="Deny" fill="#f44336" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
