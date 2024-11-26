import React, { useState } from 'react';
import axios from 'axios';
import { Button, FileInput, Label, Alert, Card, Progress, TextInput, Textarea } from 'flowbite-react';

const VideoUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null); // Stores the selected video file
  const [progress, setProgress] = useState(0); // Tracks upload progress
  const [uploading, setUploading] = useState(false); // Indicates upload status
  const [message, setMessage] = useState(""); // Displays status messages
  const [alertType, setAlertType] = useState("info"); // Alert type: info, success, warning, or error
  const [videoTitle, setVideoTitle] = useState(""); // Stores video title
  const [videoDescription, setVideoDescription] = useState(""); // Stores video description

  // Handle file change (for video file)
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setMessage(""); // Clear previous messages
  };

  // Handle form submission (video upload)
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission

    if (!selectedFile) {
      setAlertType("warning");
      setMessage("Please select a video file.");
      return;
    }

    if (!videoTitle || !videoDescription) {
      setAlertType("warning");
      setMessage("Please provide a video title and description.");
      return;
    }

    setUploading(true); // Set uploading to true
    setProgress(0); // Reset progress bar
    setMessage(""); // Clear previous message

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("title", videoTitle);
    formData.append("description", videoDescription);

    try {
      const response = await axios.post("http://localhost:8080/api/v1/videos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const percent = Math.round((loaded * 100) / total);
          setProgress(percent); // Update progress
        },
      });

      setAlertType("success");
      setMessage("Video uploaded successfully");

      setSelectedFile(null); // Clear selected file
      setVideoTitle(""); // Clear title
      setVideoDescription(""); // Clear description
    } catch (error) {
      setAlertType("error");
      setMessage("Upload failed: " + (error.message || error)); // Ensure error message is a string
    } finally {
      setUploading(false); // Set uploading to false after the process is complete
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <Card className="w-full max-w-md rounded-lg shadow-md border border-gray-200 bg-gray-50">
        <h1 className="text-2xl font-bold text-center text-white mb-3">
          Welcome to Video Streaming App
        </h1>
        <p className="text-center text-gray-200 mb-6">
          Please upload your video here
        </p>

        {/* Form to upload video */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Video Title Input */}
          <div>
            <Label htmlFor="videoTitle" value="Video Title" className="mb-2 block text-gray-700" />
            <TextInput
              id="videoTitle"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              placeholder="Enter video title"
              required
              className="rounded-lg"
            />
          </div>

          {/* Video Description Input - Using Textarea for multi-line input */}
          <div>
            <Label htmlFor="videoDescription" value="Video Description" className="mb-2 block text-gray-700" />
            <Textarea
              id="videoDescription"
              value={videoDescription}
              onChange={(e) => setVideoDescription(e.target.value)}
              placeholder="Enter video description"
              required
              rows={4} // Set number of rows for the textarea
              className="rounded-lg"
            />
          </div>

          {/* Video File Input */}
          <div>
            <Label htmlFor="file" value="Select your video file" className="mb-2 block text-gray-700" />
            <FileInput
              id="file"
              accept="video/*"
              onChange={handleFileChange}
              helperText="Only video files are supported."
              className="rounded-lg"
            />
          </div>

          {/* Upload Button */}
          <Button
            type="submit" // Changed to submit type
            disabled={uploading} // Disable the button when uploading
            className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          >
            {uploading ? "Uploading..." : "Upload Video"}
          </Button>

          {/* Upload Progress */}
          {uploading && <Progress percentage={progress} className="mt-4" />}
        </form>

        {/* Show success or failure message after upload */}
        {message && (
          <div className="mt-6">
            <Alert color={alertType} rounded>
              <span>{message}</span>
            </Alert>
          </div>
        )}
      </Card>
    </div>
  );
};

export default VideoUpload;
