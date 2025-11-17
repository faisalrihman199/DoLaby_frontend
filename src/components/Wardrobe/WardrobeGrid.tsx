import { useNavigate } from "react-router-dom";
import ClothingCard from "./ClothingCard";
import { Plus } from "lucide-react";
import { WardrobeItem } from "../../types/wardrobe";

interface WardrobeGridProps {
  selectedItems: number[];
  onItemSelect: (id: number) => void;
  activeTab: string;
  wardrobeItems: WardrobeItem[];
  onToggleFavorite?: (id: number) => void;
}

const WardrobeGrid = ({ selectedItems, onItemSelect, activeTab, wardrobeItems, onToggleFavorite }: WardrobeGridProps) => {
  const navigate = useNavigate();
  const handleAddNewCloth = () => {
    navigate("/add-cloth");
  };

  // Filter items by active tab
  const filteredItems = wardrobeItems.filter(item => {
    if (activeTab === "top") return item.type === "top";
    if (activeTab === "bottom") return item.type === "bottom";
    if (activeTab === "shoes") return item.type === "shoes";
    return true;
  });
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
      {filteredItems.map((item) => (
        <ClothingCard
          key={item.id}
          id={item.id}
          image={item.image_url}
          brand={item.brand.name}
          category={item.category}
          favorite={item.favourite}
          featured={false} // You can add a featured field to API if needed
          isSelected={selectedItems.includes(item.id)}
          onSelect={() => onItemSelect(item.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
      
      {/* Add New Item Cards */}
      {[...Array(1)].map((_, index) => (
        <button
          key={`add-${index}`}
          className="aspect-square h-full w-43 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-accent transition-colors flex items-center justify-center"
          onClick={handleAddNewCloth}
        >
          <Plus className="w-8 h-8 text-gray-400" />
        </button>
      ))}
    </div>
  );
};

export default WardrobeGrid;
