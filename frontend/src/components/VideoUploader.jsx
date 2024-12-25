import { useRef, useState } from 'react';
import { Upload, X, Loader } from 'lucide-react';

const VideoUploader = ({ onFileSelect, onPost, isPosting }) => {
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (file) => {
    if (file) {
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        toast.error('File size too large. Maximum size is 100MB.');
        return;
      }
      if (!file.type.startsWith('video/')) {
        toast.error('Please select a video file.');
        return;
      }
      setVideoFile(file);
      onFileSelect(file);
    }
  };

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
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handlePost = () => {
    onPost(videoFile, description);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-green-400">Upload Video</h2>
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${dragActive 
            ? 'border-green-500 bg-green-500/10' 
            : 'border-gray-600 hover:border-green-500'
          }`}
        onClick={() => fileInputRef.current.click()}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {videoFile ? (
          <div className="relative">
            <video 
              src={URL.createObjectURL(videoFile)} 
              controls
              className="max-h-[200px] mx-auto rounded-lg"
            />
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setVideoFile(null);
                onFileSelect(null);
              }}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="w-12 h-12 mx-auto text-gray-400" />
            <p className="text-gray-400">
              Drag and drop a video or click to select
            </p>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFileChange(e.target.files[0])}
        accept="video/*"
        className="hidden"
      />

      <textarea
        placeholder="Enter video description..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
        disabled={isPosting}
      />

      <button
        onClick={handlePost}
        disabled={!videoFile || isPosting}
        className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2
          ${!videoFile || isPosting
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-green-500 hover:bg-green-600'
          }`}
      >
        {isPosting ? (
          <>
            <Loader className="animate-spin" size={20} />
            <span>Posting...</span>
          </>
        ) : (
          'Post to All Accounts'
        )}
      </button>
    </div>
  );
};

export default VideoUploader; 