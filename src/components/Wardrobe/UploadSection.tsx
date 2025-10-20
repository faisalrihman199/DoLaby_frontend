import { Camera, CameraIcon } from "lucide-react";
import { useState } from "react";

interface UploadSectionProps {
  onImageUpload: (image: string) => void;
}

const UploadSection = ({ onImageUpload }: UploadSectionProps) => {
  const [isDragging, setIsDragging] = useState(false);

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
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageUpload(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageUpload(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg  p-8 flex flex-col items-center justify-center">
      <div className="mb-3 flex items-center gap-3 justify-center">

        <h3 className="text-[25px] md:text-[40px]  w-[80%] text-center font-semibold text-[#12396F] kantumruy leading-tight">

          Upload Photo</h3>
      </div>
      <div
        className={`w-full max-w-sm rounded-lg p-8 py-4 flex flex-col items-center justify-center transition-colors ${isDragging ? "border-primary bg-accent" : ""
          }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CameraIcon className="h-36 w-36 text-blue-900" />
        <p className="mt-2 w-full text-center text-3xl kantumruy text-blue-900/50">Click to upload

          or drag photo here</p>
      </div>

      <label className="mt-6 cursor-pointer">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
        <span className="inline-block px-8 py-2 bg-white border-1 border-color-primary text-color-primary rounded-lg hover:bg-accent transition-colors font-medium">
          Upload
        </span>
      </label>
    </div>
  );
};

export default UploadSection;
