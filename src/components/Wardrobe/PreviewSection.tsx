import { Heart, Sparkles } from "lucide-react";

interface PreviewSectionProps {
  uploadedImage: string | null;
}

const PreviewSection = ({ uploadedImage }: PreviewSectionProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md  p-8 flex flex-col items-center justify-center">
      <div className="mb-3 flex items-center gap-3 justify-center">

        <h3 className="text-[25px] md:text-[40px]  w-[80%] text-center font-semibold text-[#12396F] kantumruy leading-tight">

          Preview Result
        </h3>
      </div>
      <div className="w-full max-w-sm border-2 border-dashed border-blue-900/50 rounded-lg p-12 flex flex-col items-center justify-center bg-gray-50 min-h-[300px]">
        {uploadedImage ? (
          <img
            src={uploadedImage}
            alt="Uploaded outfit"
            className="max-w-full max-h-64 object-contain rounded-lg"
          />
        ) : (
          <>
            <Sparkles className="w-16 h-16 text-blue-900/50  mb-4" />
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-blue-900/50" />
              <span className="text-blue-900/50">edit</span>
            </div>
            <p className="mt-2 w-full text-3xl text-center px-4 kantumruy text-blue-900/50">
            Your outfit
            <br />
             will appear here</p>
          </>
        )}
      </div>

      <button className="mt-6 px-8 py-2 bg-white border-2 border-blue-400 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium flex items-center gap-2">
        <Heart className="w-5 h-5" />
        Save
      </button>
    </div>
  );
};

export default PreviewSection;
