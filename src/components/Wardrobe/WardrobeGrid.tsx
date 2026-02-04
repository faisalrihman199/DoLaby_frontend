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
  onDelete?: (id: number) => void;
  onEdit?: (id: number) => void;
}

const WardrobeGrid = ({ selectedItems, onItemSelect, activeTab, wardrobeItems, onToggleFavorite, onDelete, onEdit }: WardrobeGridProps) => {
  const navigate = useNavigate();
  const handleAddNewCloth = () => {
    navigate("/add-cloth");
  };

  // Filter items by active tab
  const filteredItems = wardrobeItems.filter(item => {
    if (activeTab === "top") return item.type === "top";
    if (activeTab === "bottom") return item.type === "bottom";
    if (activeTab === "shoes") return item.type === "shoes";
    if (activeTab === "outfit") return item.type === "outfit";
    return true; // 'all' tab shows everything
  });
  
  // Check if we need to show placeholder plus icons for empty categories
  const shouldShowPlaceholders = activeTab !== "all" && activeTab !== "outfit" && filteredItems.length === 0;
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
      {filteredItems.map((item) => {
        // In 'all' tab, only allow selection if item type matches selectable categories
        const isSelectableInAllTab = activeTab === "all" && item.type !== "outfit";
        const canSelect = activeTab !== "all" || isSelectableInAllTab;
        
        return (
          <ClothingCard
            key={item.id}
            id={item.id}
            image={item.image_url}
            category={item.category}
            favorite={item.favourite}
            featured={false}
            isSelected={selectedItems.includes(item.id)}
            onSelect={canSelect ? () => onItemSelect(item.id) : undefined}
            onToggleFavorite={onToggleFavorite}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        );
      })}
      
      {/* Show plus icon placeholder when category is empty */}
      {shouldShowPlaceholders && (
        <button
          className="aspect-square h-full w-43 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-accent transition-colors flex items-center justify-center"
          onClick={handleAddNewCloth}
        >
          <Plus className="w-12 h-12 text-gray-400" />
        </button>
      )}
      
      {/* Add New Item Card - always show one */}
      {filteredItems.length > 0 && (
        <button
          className="aspect-square h-full w-43 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-accent transition-colors flex items-center justify-center"
          onClick={handleAddNewCloth}
        >
          <Plus className="w-8 h-8 text-gray-400" />
        </button>
      )}
    </div>
  );
};

export default WardrobeGrid;
