import { useState } from 'react';
import { Upload } from 'lucide-react';

const VideoUploader = ({ onFileSelect, onPost, isPosting }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center ${
        dragActive ? 'border-green-500 bg-green-500/10' : 'border-gray-600'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
      <p className="text-gray-300 mb-2">
        Drag and drop your video here, or click to select
      </p>
      <input
        type="file"
        onChange={(e) => onFileSelect(e.target.files[0])}
        accept="video/*"
        className="hidden"
        id="video-upload"
      />
      <label
        htmlFor="video-upload"
        className="inline-block px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer"
      >
        Select Video
      </label>
    </div>
  );
};

export default VideoUploader; 