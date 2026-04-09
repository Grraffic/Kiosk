import { useEffect, useRef } from 'react';

// Extend the window object to recognize cloudinary
declare global {
  interface Window {
    cloudinary: any;
  }
}

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
  buttonLabel?: string;
  className?: string;
}

export default function ImageUpload({ onUploadSuccess, buttonLabel = "Upload Image", className = "" }: ImageUploadProps) {
  const cloudinaryRef = useRef<any>(null);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    // Prevent widget from spawning multiple instances and ensure object exists
    if (!window.cloudinary) return;

    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget({
      cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
      uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
      multiple: false,
      sources: ['local', 'url', 'camera'],
      clientAllowedFormats: ['jpeg', 'png', 'jpg', 'webp'],
      maxImageFileSize: 5000000, // 5MB limit
      theme: 'purple' // Dark aesthetic
    }, function(error: any, result: any) { 
      if (!error && result && result.event === "success") {
        console.log("Cloudinary Upload Success: ", result.info);
        onUploadSuccess(result.info.secure_url);
      }
    });

  }, [onUploadSuccess]);

  const handleOpenWidget = (e: React.MouseEvent) => {
    e.preventDefault();
    if (widgetRef.current) {
        widgetRef.current.open();
    } else {
        alert("Cloudinary widget failed to load or keys are missing in .env");
    }
  };

  return (
    <button 
      onClick={handleOpenWidget}
      className={`bg-amber-500/20 text-amber-500 font-bold px-4 py-2 rounded shadow hover:bg-amber-500/40 transition-colors ${className}`}
    >
      {buttonLabel}
    </button>
  );
}
