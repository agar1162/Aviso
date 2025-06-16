// pages/test-line.tsx
import LineGraph from "@/app/components/graph";

const rawSightings = [
  { timestamp: "2025-06-16T00:15:00", vote_type: "Confirm" },
  { timestamp: "2025-06-16T00:42:00", vote_type: "Deny" },
  { timestamp: "2025-06-16T01:30:00", vote_type: "Confirm" },
  { timestamp: "2025-06-16T15:12:00", vote_type: "Deny" },
  { timestamp: "2025-06-16T15:45:00", vote_type: "Confirm" },
];

function processSightings(
  raw: { timestamp: string; vote_type: "Confirm" | "Deny" }[]
) {
  const result = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    confirm: 0,
    deny: 0,
  }));

  for (const { timestamp, vote_type } of raw) {
    const hour = new Date(timestamp).getHours();
    if (vote_type === "Confirm") result[hour].confirm++;
    else result[hour].deny++;
  }

  return result;
}

const TestLinePage = () => {
  const data = processSightings(rawSightings);

  return (
    <div className="p-10">
      <h1 className="text-xl font-bold mb-4">Sightings Over 24 Hours</h1>
      <LineGraph data={data} />
    </div>
  );
};

export default TestLinePage;
