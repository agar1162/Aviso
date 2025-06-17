import { useState, useEffect } from "react";
import type { Post } from "../models/post";
import Image from "next/image";
import { getDeviceId } from "@/utils/device";
import VoteBarChart from "@/app/components/graph";

const api_url = process.env.NEXT_PUBLIC_API_URL;

const handleVote = async (
  postId: number,
  voteType: "Confirm" | "Deny",
  onError: (msg: string) => void
) => {
  const deviceId = getDeviceId();

  try {
    const res = await fetch(`${api_url}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        post_id: postId,
        vote_type: voteType,
        device_id: deviceId,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      onError(data.detail || "Something went wrong");
    }
  } catch (error) {
    onError("Network error, please try again.");
  }
};

const CardComponent = ({ data }: { data: Post }) => {
  const [selection, setSelection] = useState<"Deny" | "Confirm" | null>(null);
  const [denyCount, setDenyCount] = useState<number | null>(null);
  const [confirmCount, setConfirmCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshVoteCounts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${api_url}/posts/${data.id}/vote_counts`);
      const counts = await res.json();
      setConfirmCount(counts.confirm_cnt);
      setDenyCount(counts.deny_cnt);
    } catch (e) {
      console.error("Failed to fetch vote counts:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshVoteCounts();
  }, []);

  const handleDeny = async () => {
    if (selection === null) {
      setSelection("Deny");
      await handleVote(data.id, "Deny", (err) => {
        alert(err);
        setSelection(null);
      });
      await refreshVoteCounts();
    }
  };

  const handleConfirm = async () => {
    if (selection === null) {
      setSelection("Confirm");
      await handleVote(data.id, "Confirm", (err) => {
        alert(err);
        setSelection(null);
      });
      await refreshVoteCounts();
    }
  };

  return (
    <div className="flex flex-col p-4 lg:p-10 border-2 lg:w-[40%] w-[90%] mx-auto bg-white rounded-md shadow-md">
      {/* Header: title, date, city */}
      <div className="mb-4 text-xl">
        <div className="flex justify-between items-center">
          <h2 className="font-bold">{data.title}</h2>
          <h2 className="font-bold text-yellow-700 text-right">{data.city}</h2>
        </div>
        <p className="text-gray-600 text-lg mt-1">
          {new Date(data.created_at).toLocaleDateString(undefined, {
            weekday: "short",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Image container */}
      <div className="flex justify-center items-center overflow-hidden h-70 lg:h-[450px] mb-4 rounded-md bg-gray-100">
        {data.image_url ? (
          <Image
            src={data.image_url.trim()}
            alt={data.title}
            className="rounded object-cover w-fit"
            loading="lazy"
            width={300}
            height={500}
          />
        ) : (
          <p className="text-gray-400 italic">No image available</p>
        )}
      </div>

      {/* Graph + buttons container */}
      <div className="flex flex-col justify-between flex-1 px-2 mt-5 h-60 lg:h-[300px]">
        {/* Graph */}
        <div className="flex-grow">
          <VoteBarChart postId={data.id} />
        </div>

        {/* Buttons + info */}
        <div>
          <p className="mt-4 mb-2 font-semibold text-gray-700 text-center text-sm lg:text-base">
            Have you seen them? Help the community by confirming or denying.
          </p>

          {loading ? (
            <div className="flex justify-center items-center mt-4 text-gray-500">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
              Loading votes...
            </div>
          ) : (
            <div className="flex flex-wrap gap-4 justify-center mt-2 max-w-xs mx-auto">
              <button
                className={`px-4 py-2 text-white rounded transition w-full sm:w-auto ${
                  selection === "Confirm"
                    ? "bg-green-700"
                    : "bg-green-500 hover:bg-green-700"
                }`}
                disabled={selection !== null || loading}
                onClick={handleConfirm}
              >
                Spotted ({confirmCount})
              </button>
              <button
                className={`px-4 py-2 text-white rounded transition w-full sm:w-auto ${
                  selection === "Deny"
                    ? "bg-red-700"
                    : "bg-red-500 hover:bg-red-700"
                }`}
                disabled={selection !== null || loading}
                onClick={handleDeny}
              >
                No Sightings ({denyCount})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardComponent;
