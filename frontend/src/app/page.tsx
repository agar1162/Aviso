"use client";

import { useEffect, useState } from "react";
import type { Post } from "./models/post";
import Nav from "./components/nav";
import Image from "next/image";
import CardComponent from "./components/card";

const api_url = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [county, setCounty] = useState<string | null>(null);
  const [showCountyOverlay, setShowCountyOverlay] = useState(false);
  const [stateInput, setStateInput] = useState("");
  const [countyOptions, setCountyOptions] = useState<string[]>([]);
  const [loadingCounties, setLoadingCounties] = useState(false);
  const [date, setDate] = useState<string | null>(null);

  // Local states to manage selections inside overlay without affecting filters until apply
  const [tempCounty, setTempCounty] = useState<string | null>(null);
  const [tempDate, setTempDate] = useState<string | null>(null);

  // Fetch counties for a given state input on Enter key
  const handleStateInputKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && stateInput.trim()) {
      setLoadingCounties(true);
      try {
        const res = await fetch(`${api_url}/county?state=${encodeURIComponent(stateInput.trim())}`);
        const data = await res.json();
        setCountyOptions(data.counties || []);
      } catch (err) {
        console.error("Error fetching counties:", err);
        setCountyOptions([]);
      } finally {
        setLoadingCounties(false);
      }
    }
  };

  // Initialize county from localStorage or default to "Los Angeles"
  useEffect(() => {
    const savedCounty = localStorage.getItem("selectedCounty");
    if (savedCounty) {
      setCounty(savedCounty);
      setTempCounty(savedCounty);
    } else {
      setCounty("Los Angeles");
      setTempCounty("Los Angeles");
    }
  }, []);

  // Fetch posts when county or date changes
  useEffect(() => {
    if (!county) return;

    const fetchPosts = async () => {
      setLoading(true);
      try {
        let url = `${api_url}/posts?county=${encodeURIComponent(county)}`;
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
          setPosts([]);
          return;
        }

        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [county, date]);

  // When user clicks "Apply" on overlay, update filters and close overlay
  const handleApplyFilters = () => {
    if (tempCounty) {
      setCounty(tempCounty);
      localStorage.setItem("selectedCounty", tempCounty);
    }
    setDate(tempDate);
    setShowCountyOverlay(false);
  };

  // When user clicks "Cancel" on overlay, discard changes and close overlay
  const handleCancelFilters = () => {
    // Reset temp states to current filters
    setTempCounty(county);
    setTempDate(date);
    setShowCountyOverlay(false);
  };

  const handleCountySelect = (newCounty: string) => {
    setTempCounty(newCounty);
  };

  return (
    <>
      <Nav />

      <button className="flex items-center justify-between bg-white border-2 px-5 py-4 rounded-xl w-[90%] lg:w-[40%] mx-auto mt-6 hover:bg-gray-100 transition">
        <div className="text-left">
          <h1 className="text-lg font-semibold">Stay Updated.</h1>
          <h1 className="text-md text-gray-600">Register for SMG updates</h1>
        </div>

        <Image
          src="/phone.svg"
          width={35}
          height={32}
          alt="Phone Icon"
          className="cursor-pointer"
        />
      </button>

      <div className="relative w-[90%] lg:w-[40%] mx-auto mt-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">
            📍 {county ? `${county} County` : "Select your county"}
          </h1>
          <button
            onClick={() => setShowCountyOverlay((prev) => !prev)}
            className="flex items-center space-x-2 text-blue-600 hover:underline"
          >
            <Image
              src="/filter.svg"
              width={26}
              height={26}
              alt="Filter Icon"
            />
            <span className="text-2xl">Filter</span>
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
                <div className="mb-4 max-h-48 overflow-y-auto">
                  <label className="block text-sm font-medium mb-2">
                    Select your county
                  </label>
                  <div className="flex flex-col space-y-2">
                    {countyOptions.map((c) => (
                      <button
                        key={c}
                        onClick={() => handleCountySelect(c)}
                        className={`text-left px-4 py-2 rounded hover:bg-gray-100 transition ${
                          tempCounty === c ? "bg-blue-100 font-semibold" : ""
                        }`}
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
                value={tempDate ?? ""}
                onChange={(e) => setTempDate(e.target.value || null)}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCancelFilters}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-5 w-full mx-auto mt-6">
      {loading ? (
          <p className="text-center">Loading...</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-500">No posts found.</p>
        ) : (
          posts.map((post) => <CardComponent key={post.id} data={post} />)
        )}
      </div>
    </>
  );
}
