import { useState } from "react";
import OutfitSidebar from "../components/Wardrobe/OutfitSidebar";
import UploadSection from "../components/Wardrobe/UploadSection";
import PreviewSection from "../components/Wardrobe/PreviewSection";
import WardrobeFilters from "../components/Wardrobe/WardrobeFilters";
import WardrobeGrid from "../components/Wardrobe/WardrobeGrid";

const Wardrobe = () => {
  const [selectedItems, setSelectedItems] = useState<number[]>([3, 9]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"top" | "bottom" | "shoes">("top");

  const handleItemSelect = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleImageUpload = (image: string) => {
    setUploadedImage(image);
  };
  const activeTabStyles = "bg-[#035477] text-white hover:bg-[#02405e]";
  const inactiveTabStyles = "bg-gray-200 text-[#828282] hover:bg-gray-300 border border-[#035477]";

  return (
    <div className="min-h-screen bg-background ">
      <div className="max-w-[1400px] mx-auto">
        {/* Top Section: Outfit Builder */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_1fr] gap-6 mb-8">
          <OutfitSidebar />
          <UploadSection onImageUpload={handleImageUpload} />
          <PreviewSection uploadedImage={uploadedImage} />
        </div>

        {/* Wardrobe Section */}
        <div className=" rounded-lg">
          <h2 className="text-[25px] kantumruy font-bold text-color-primary mb-4">Wardrobe</h2>
          
          <WardrobeFilters />
          
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button 
              onClick={() => setActiveTab("top")}
              className={`px-6 py-2 rounded-t-lg font-medium transition-colors ${
                activeTab === "top" 
                  ? activeTabStyles 
                  : inactiveTabStyles
              }`}
            >
              Tops
            </button>
            <button 
              onClick={() => setActiveTab("bottom")}
              className={`px-6 py-2 rounded-t-lg font-medium transition-colors ${
                activeTab === "bottom" 
                  ? activeTabStyles 
                  : inactiveTabStyles
              }`}
            >
              Button
            </button>
            <button 
              onClick={() => setActiveTab("shoes")}
              className={`px-6 py-2 rounded-t-lg font-medium transition-colors ${
                activeTab === "shoes" 
                  ? activeTabStyles 
                  : inactiveTabStyles
              }`}
            >
              Shoes
            </button>
          </div>

          <WardrobeGrid 
            selectedItems={selectedItems} 
            onItemSelect={handleItemSelect}
            activeTab={activeTab}
          />
        </div>
      </div>
    </div>
  );
};

export default Wardrobe;
