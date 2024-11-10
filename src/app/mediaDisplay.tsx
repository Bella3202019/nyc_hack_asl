// VideoUploadPlayer.tsx

import { useState, useRef, ChangeEvent } from 'react';
import { Camera, Upload, Play, Pause, RotateCcw } from 'lucide-react';

interface VideoUploadPlayerProps {
  maxSizeInMB?: number;
  acceptedFormats?: string[];
}

const DEFAULT_MAX_SIZE = 100; // 100MB
const DEFAULT_ACCEPTED_FORMATS = ['video/mp4', 'video/webm', 'video/ogg'];

const VideoUploadPlayer: React.FC<VideoUploadPlayerProps> = ({
  maxSizeInMB = DEFAULT_MAX_SIZE,
  acceptedFormats = DEFAULT_ACCEPTED_FORMATS,
}) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    // Check if file is a video
    if (!acceptedFormats.includes(file.type)) {
      setError('Please upload a valid video file');
      return;
    }
    
    // Check file size
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      setError(`File size should be less than ${maxSizeInMB}MB`);
      return;
    }
    
    setError(null);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
  };
  
  const handlePlayPause = (): void => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleReset = (): void => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleVideoEnded = (): void => {
    setIsPlaying(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-4">
      {/* Upload Section */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <input
          type="file"
          accept={acceptedFormats.join(',')}
          onChange={handleFileUpload}
          className="hidden"
          id="video-upload"
        />
        <label
          htmlFor="video-upload"
          className="flex flex-col items-center cursor-pointer"
        >
          <Camera className="w-12 h-12 text-gray-400 mb-2" />
          <span className="text-sm text-gray-500">
            Click to upload video or drag and drop
          </span>
          <span className="text-xs text-gray-400 mt-1">
            Supported formats: {acceptedFormats.map(format => format.split('/')[1]).join(', ')}
          </span>
          <span className="text-xs text-gray-400">
            (max {maxSizeInMB}MB)
          </span>
        </label>
      </div>

      {/* Video Player */}
      {videoUrl && (
        <div className="relative rounded-lg overflow-hidden bg-black">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full"
            onEnded={handleVideoEnded}
          />
          
          {/* Video Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={handlePlayPause}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                type="button"
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-white" />
                ) : (
                  <Play className="w-6 h-6 text-white" />
                )}
              </button>
              <button
                onClick={handleReset}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                type="button"
                aria-label="Reset video"
              >
                <RotateCcw className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUploadPlayer;