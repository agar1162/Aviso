"use client";

import { useEffect, useState } from "react";
import type { Post } from "./models/post";
import Nav from "./components/nav";
import Image from "next/image";
import CardComponent from "./components/card";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [county, setCounty] = useState<string | null>(null);
  const [showCountyOverlay, setShowCountyOverlay] = useState(false);
  const [stateInput, setStateInput] = useState("");
  const [countyOptions, setCountyOptions] = useState<string[]>([]);
  const [loadingCounties, setLoadingCounties] = useState(false);
  const [date, setDate] = useState<string | null>(null);
  const [filtersApplied, setFiltersApplied] = useState(false);

  const handleStateInputKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && stateInput.trim()) {
      setLoadingCounties(true);
      try {
        const res = await fetch(
          `http://localhost:8000/county?state=${stateInput}`
        );
        const data = await res.json();
        setCountyOptions(data.counties || []);
      } catch (err) {
        console.error("Error fetching counties:", err);
      } finally {
        setLoadingCounties(false);
      }
    }
  };

  useEffect(() => {
    const savedCounty = localStorage.getItem("selectedCounty");
    if (savedCounty) {
      setCounty(savedCounty);
    } else {
      setCounty("Los Angeles"); // Set default county here
    }
  }, []);

  useEffect(() => {
    if (showCountyOverlay) {
      setPosts([]);
    } else {
      setFiltersApplied((prev) => !prev);
    }
  }, [showCountyOverlay]);

  useEffect(() => {
    if (!county) return;

    const fetchPosts = async () => {
      setLoading(true);
      try {
        let url = `http://localhost:8000/posts?county=${county}`;
        if (date) {
          url += `&date=${encodeURIComponent(date)}`;
        }

        const res = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Failed response:", res.status, errorText);
          return;
        }

        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [county, date, filtersApplied]);

  const handleCountySelect = (newCounty: string) => {
    setCounty(newCounty);
    localStorage.setItem("selectedCounty", newCounty);
    setShowCountyOverlay(false);
  };

  return (
    <>
      <Nav />

      <button className="flex items-center justify-between bg-white border-2 px-5 py-4 rounded-xl w-[90%] lg:w-[40%] mx-auto mt-6 hover:bg-gray-100 transition">
        <div className="text-left">
          <h1 className="text-base font-semibold">Stay Updated.</h1>
          <h1 className="text-sm text-gray-600">Register for SMG updates</h1>
        </div>

        <Image
          src="/phone.svg"
          width={35}
          height={32}
          alt="Phone Icon"
          className="cursor-pointer"
        />
      </button>

      {/* Info Row */}
      {/* Wrap Info Row and Popup in a relative container */}
      <div className="relative w-[90%] lg:w-[40%] mx-auto mt-6">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-semibold">
            📍 {county ? `${county} County` : "Select your county"}
          </h1>
          <button
            onClick={() => setShowCountyOverlay((prev) => !prev)}
            className="flex items-center space-x-2 text-blue-600 hover:underline"
          >
            <img src="/filter.svg" width={26} height={26} />
            <span>Filter</span>
          </button>
        </div>

        {/* Filter Popup */}
        {showCountyOverlay && (
          <div className="absolute top-full left-0 mt-2 bg-white p-6 rounded-xl shadow-lg w-full z-50">
            <h2 className="text-lg font-semibold mb-4">
              Where are you located?
            </h2>

            <div className="mb-4">
              <label
                htmlFor="state-input"
                className="block text-sm font-medium mb-2"
              >
                Type your state, then press Enter.
              </label>
              <input
                id="state-input"
                type="text"
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. California"
                value={stateInput}
                onChange={(e) => setStateInput(e.target.value)}
                onKeyDown={handleStateInputKeyDown}
              />
            </div>

            {loadingCounties ? (
              <div className="flex justify-center my-4">
                {/* Spinner SVG */}
                <svg
                  className="animate-spin h-6 w-6 text-blue-600"
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
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
              </div>
            ) : (
              countyOptions.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Select your county
                  </label>
                  <div className="flex flex-col space-y-2 max-h-48 overflow-y-auto">
                    {countyOptions.map((c) => (
                      <button
                        key={c}
                        onClick={() => handleCountySelect(c)}
                        className="text-left px-4 py-2 rounded hover:bg-gray-100 transition"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Filter by Date (optional)
              </label>
              <input
                type="date"
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={date ?? ""}
                onChange={(e) => setDate(e.target.value || null)}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCountyOverlay(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCountyOverlay(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cards */}
      <div className="grid gap-5 w-[90%] lg:w-[40%] mx-auto mt-6">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          posts.map((post) => <CardComponent key={post.id} data={post} />)
        )}
      </div>
    </>
  );
}
