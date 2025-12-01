import { Camera, CameraIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAPP } from "../../contexts/AppContext";

interface UploadSectionProps {
  onImageUpload: (file: File) => void;
  uploading?: boolean;
}

const UploadSection = ({ onImageUpload, uploading = false }: UploadSectionProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Pass file to parent
      onImageUpload(file);
    }
  };

  const inputRef = useRef<HTMLInputElement | null>(null);
  const {user}=useAPP();
  
  // If user has a measurement image, show it as the initial preview
  useEffect(() => {
    if (!preview && user?.measurement_image) {
      setPreview(user.measurement_image);
    }
  }, [user, preview]);
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Pass file to parent
      onImageUpload(file);

      // Reset input so selecting same file again triggers change
      try {
        if (inputRef.current) inputRef.current.value = '';
      } catch (err) { /* ignore */ }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg  p-8 flex flex-col items-center justify-center">
      <div className="mb-3 flex items-center gap-3 justify-center">

        <h3 className="text-[25px] md:text-[40px]  w-[80%] text-center font-semibold text-[#12396F] kantumruy leading-tight">

          Upload Photo</h3>
      </div>
      <div
        className={`relative mt-6 w-full overflow-hidden rounded-2xl bg-white/60 cursor-pointer transition-colors ${isDragging ? "border-primary bg-accent" : ""
          } ${uploading ? 'opacity-50' : ''}`}
        style={{ aspectRatio: '9 / 16', height: '450px', maxWidth: '280px', margin: '0 auto' }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {uploading ? (
          <div className="flex h-full flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-blue-900"></div>
            <p className="mt-4 w-full text-2xl text-center px-4 kantumruy text-blue-900">Uploading...</p>
          </div>
        ) : preview ? (
          <div className="w-full h-full flex items-center justify-center bg-white p-2">
            <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-lg" />
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center">
            <CameraIcon className="h-24 w-24 text-blue-900" />
            <p className="mt-2 w-full text-center text-3xl kantumruy text-blue-900/50">Click to upload
              <br />
              or drag photo here</p>
          </div>
        )}
      </div>

      <label className="mt-6 cursor-pointer">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
          disabled={uploading}
        />
        <span className={`inline-block px-8 py-2 bg-white border-1 border-color-primary text-color-primary rounded-lg hover:bg-accent transition-colors font-medium ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          {uploading ? 'Uploading...' : preview ? 'Change Photo' : 'Upload'}
        </span>
      </label>
    </div>
  );
};

export default UploadSection;
