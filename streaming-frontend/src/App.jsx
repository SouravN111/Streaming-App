import React, { useState } from "react";
import VideoUpload from "./components/VideoUpload";
import VideoStream from "./components/VideoStream";

const App = () => {
  const [activeSection, setActiveSection] = useState("upload"); // State to toggle sections

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      {/* Toggle Menu */}
      <div className="flex space-x-4 mb-6">
        <button
          className={`py-2 px-4 rounded ${
            activeSection === "upload" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setActiveSection("upload")}
        >
          Upload Video
        </button>
        <button
          className={`py-2 px-4 rounded ${
            activeSection === "stream" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setActiveSection("stream")}
        >
          Stream Video
        </button>
      </div>

      {/* Section Rendering */}
      <div className="w-full max-w-4xl">
        {activeSection === "upload" ? <VideoUpload /> : <VideoStream />}
      </div>
    </div>
  );
};

export default App;
