import { Heart, Sparkles, Download } from "lucide-react";

interface PreviewSectionProps {
  uploadedImage: string | null;
  tryOnLoading?: boolean;
  tryOnError?: string | null;
  tryOnResult?: any;
  onTryAgain?: () => void;
  onSave?: (favourite: boolean) => void;
  saving?: boolean;
  progress?: number;
  progressMessage?: string;
}

const PreviewSection = ({ 
  uploadedImage, 
  tryOnLoading = false, 
  tryOnError = null, 
  tryOnResult = null, 
  onTryAgain, 
  onSave, 
  saving = false,
  progress = 0,
  progressMessage = ''
}: PreviewSectionProps) => {
  // AI processing tips to show during wait
  const aiTips = [
    "Analyzing your photo...",
    "Matching outfit colors...",
    "Adjusting fit and proportions...",
    "Applying style details...",
    "Perfecting the look...",
    "Almost there...",
  ];
  
  // Get a tip based on progress
  const getTip = () => {
    if (progress < 15) return aiTips[0];
    if (progress < 25) return aiTips[1];
    if (progress < 40) return aiTips[2];
    if (progress < 55) return aiTips[3];
    if (progress < 70) return aiTips[4];
    return aiTips[5];
  };

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-blue-100">
      <div className="mb-3 flex items-center gap-3 justify-center">
        <h3 className="text-[25px] md:text-[40px]  w-[80%] text-center font-semibold text-[#12396F] kantumruy leading-tight">
          Preview Result
        </h3>
      </div>

      <div
        className="relative mt-6 w-full overflow-hidden rounded-2xl border-2 border-dashed border-blue-200 bg-white/60"
        style={{ aspectRatio: '9 / 16', height: '450px', maxWidth: '280px', margin: '0 auto' }}
      >
        {tryOnLoading ? (
          <div className="flex h-full flex-col items-center justify-center px-6">
            <div className="relative">
              <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-blue-900"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
            </div>
            <p className="mt-4 w-full text-xl text-center kantumruy text-blue-900 font-medium">
              {progressMessage || 'Creating your look...'}
            </p>
            {progress > 0 && (
              <div className="mt-5 w-full">
                <div className="w-full bg-blue-100 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-blue-900 h-3 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="mt-2 text-center text-lg font-bold text-blue-900">{progress}%</p>
              </div>
            )}
            {progress >= 10 && progress < 70 && (
              <p className="mt-3 text-sm text-center text-blue-600 kantumruy animate-pulse">
                {getTip()}
              </p>
            )}
          </div>
        ) : tryOnError ? (
          <div className="flex h-full flex-col items-center justify-center p-4">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <p className="text-lg text-center kantumruy text-red-600">{tryOnError}</p>
          </div>
        ) : uploadedImage ? (
          <>
            <div className="w-full h-full flex items-center justify-center bg-white p-2 relative">
              <img
                src={uploadedImage}
                alt="Try-on result"
                className="w-full h-full object-cover rounded-lg"
                style={{ filter: 'drop-shadow(0 6px 8px rgba(0,0,0,0.12))' }}
              />

              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch(uploadedImage || '');
                      const blob = await response.blob();
                      const blobUrl = window.URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = blobUrl;
                      link.download = 'try-on-result.jpg';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);
                      window.open(uploadedImage, '_blank');
                    } catch (error) {
                      console.error('Download failed:', error);
                      alert('Failed to download image. Please try again.');
                    }
                  }}
                  className="p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all"
                  title="Download"
                >
                  <svg className="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>
            </div>

            {tryOnResult && (
              <div className="mt-3 w-full bg-blue-50 p-3 rounded-lg text-sm">
                <p className="text-blue-900">Try-on #{tryOnResult.tryOnCount}</p>
                {tryOnResult.cached && <p className="text-green-600">✓ Cached result</p>}
                {!tryOnResult.isRegistered && <p className="text-yellow-600">Sign up for unlimited tries!</p>}
              </div>
            )}
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center">
            <Sparkles className="h-24 w-24 text-blue-900" />
            <p className="mt-2 w-full text-3xl text-center px-4 kantumruy text-blue-900/50">Your outfit
              <br />will appear here</p>
          </div>
        )}
      </div>

      {!tryOnLoading && uploadedImage && onSave && (
        <div className="mt-4 flex justify-center">
          <button 
            onClick={() => onSave(true)}
            disabled={saving}
            className="px-8 py-2.5 bg-[#035477] text-white rounded-lg hover:bg-[#02405e] transition-colors font-medium kantumruy flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Heart className="w-5 h-5" fill="currentColor" />
                Save
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default PreviewSection;
