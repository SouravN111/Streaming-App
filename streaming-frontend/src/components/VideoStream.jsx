import React, { useState } from "react";

const VideoStream = () => {
  const [videoId, setVideoId] = useState(""); // User-provided video ID
  const [videoUrl, setVideoUrl] = useState(""); // Video URL for playback
  const [error, setError] = useState(""); // Error messages

  const handlePlay = async () => {
    if (!videoId.trim()) {
      setError("Please enter a valid video ID.");
      setVideoUrl("");
      return;
    }

    const url = `http://localhost:8080/api/v1/videos/stream/${videoId}`; // Spring Boot endpoint

    try {
      const response = await fetch(url);

      if (response.ok) {
        setVideoUrl(url); // Set video URL if successful
        setError(""); // Clear any previous error
      } else if (response.status === 404) {
        setError("Video not found. Please check the video ID.");
        setVideoUrl(""); // Clear video URL
      } else {
        setError("An unexpected error occurred.");
        setVideoUrl(""); // Clear video URL
      }
    } catch (err) {
      setError(`Failed to fetch video: ${err.message}`);
      setVideoUrl(""); // Clear video URL
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-4xl mx-auto rounded-lg shadow-lg bg-gray-800 p-6 flex flex-col-reverse space-y-6">
        {/* Video Player Box */}
        {videoUrl && (
          <div className="mb-6 mt-6"> {/* Added margin-top for spacing */}
            <video
              controls
              autoPlay
              className="w-full h-96 rounded-lg"
              src={videoUrl}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {/* Form Section */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-center text-white mb-3">
            Stream Video
          </h1>
          <p className="text-center text-gray-200 mb-6">
            Please enter a video ID to stream.
          </p>

          {/* Video ID Input */}
          <div>
            <label className="block text-gray-300 mb-2" htmlFor="videoId">
              Enter Video ID:
            </label>
            <input
              id="videoId"
              type="text"
              value={videoId}
              onChange={(e) => setVideoId(e.target.value)}
              className="w-full p-2 rounded-lg bg-gray-700 text-white"
              placeholder="Enter video ID"
            />
          </div>

          {/* Play Button */}
          <button
            onClick={handlePlay}
            className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          >
            Play Video
          </button>

          {/* Error Message */}
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default VideoStream;
