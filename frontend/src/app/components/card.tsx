import { useState, useEffect } from "react";
import type { Post } from "../models/post";
import Image from "next/image";
import { getDeviceId } from "@/utils/device";


const api_url = process.env.NEXT_PUBLIC_API_URL;

const handleVote = async (
  postId: number,
  voteType: "Confirm" | "Deny",
  onError: (msg: string) => void
) => {
  const deviceId = getDeviceId();

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
};

const CardComponent = ({ data }: { data: Post }) => {
  const [selection, setSelection] = useState<"Deny" | "Confirm" | null>(null);
  const [denyCount, setDenyCount] = useState<number | null>(null);
  const [confirmCount, setConfirmCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true); // NEW

  const refreshVoteCounts = async () => {
    setLoading(true); // start loading
    try {
      const res = await fetch(`${api_url}/post/${data.id}/vote_counts`);
      const counts = await res.json();
      setConfirmCount(counts.confirm_cnt);
      setDenyCount(counts.deny_cnt);
    } catch (e) {
      console.error("Failed to fetch vote counts:", e);
    } finally {
      setLoading(false); // end loading
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
    <div className="border-2 p-5 shadow rounded hover:bg-gray-100 rounded-lg">
      <div className="flex flex-row justify-between w-full">
        <h2 className="text-lg font-bold">{data.title}</h2>
        <h2 className="text-lg font-bold text-brown-500">{data.city}</h2>
      </div>
      <p>{new Date(data.date).toLocaleDateString()}</p>
      <div className="flex flex-col lg:flex-row lg:gap-10 mt-4">
        <div
          className="flex justify-center items-center"
          style={{ width: 300, height: 200, flexShrink: 0, overflow: "hidden" }}
        >
          {data.image_url ? (
            <Image
              src={data.image_url.trim()}
              alt={data.title}
              className="rounded"
              loading="lazy"
              width={300}
              height={200}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <p className="text-gray-400 italic">No image available</p>
          )}
        </div>

        <div
          className="text-sm lg:mt-0 mt-4 flex flex-col justify-between"
          style={{
            width: 300,
            height: 200,
            overflowY: "auto",
            paddingLeft: 10,
            paddingRight: 10,
          }}
        >
          <div>{data.desc}</div>
          <div>
            <p className="mt-4 mb-2 font-semibold text-gray-700">
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
              <div className="flex gap-4 mt-2">
                <button
                  className={`px-4 py-2 text-white rounded transition ${
                    selection === "Deny"
                      ? "bg-red-700"
                      : "bg-red-500 hover:bg-red-700"
                  }`}
                  disabled={selection !== null || loading}
                  onClick={handleDeny}
                >
                  Deny {denyCount}
                </button>

                <button
                  className={`px-4 py-2 text-white rounded transition ${
                    selection === "Confirm"
                      ? "bg-green-700"
                      : "bg-green-500 hover:bg-green-700"
                  }`}
                  disabled={selection !== null || loading}
                  onClick={handleConfirm}
                >
                  Confirm {confirmCount}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardComponent;
