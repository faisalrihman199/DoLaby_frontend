import React from 'react';
import { X, Download } from 'lucide-react';

const ImageModal = ({ isOpen, onClose, imageUrl, imageName }) => {
  if (!isOpen) return null;

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${imageName || 'outfit'}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download image. Please try again.');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-[#035477] to-[#02405e]">
          <h3 className="text-xl font-semibold text-white kantumruy">
            {imageName || 'Outfit Preview'}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              title="Download"
            >
              <Download className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              title="Close"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Image Container */}
        <div className="p-6 flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
          <img
            src={imageUrl}
            alt={imageName || 'Outfit'}
            className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>';
              e.target.alt = 'Image failed to load';
            }}
          />
        </div>

        {/* Footer with Download Button */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-center">
          <button
            onClick={handleDownload}
            className="px-8 py-2.5 bg-[#035477] text-white rounded-lg hover:bg-[#02405e] transition-colors font-medium kantumruy flex items-center gap-2 shadow-md"
          >
            <Download className="w-5 h-5" />
            Save Image
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
