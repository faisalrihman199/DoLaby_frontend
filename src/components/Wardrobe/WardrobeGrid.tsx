import { useNavigate } from "react-router-dom";
import ClothingCard from "./ClothingCard";
import { Plus } from "lucide-react";

interface WardrobeGridProps {
  selectedItems: number[];
  onItemSelect: (id: number) => void;
  activeTab: string;
}

const WardrobeGrid = ({ selectedItems, onItemSelect, activeTab }: WardrobeGridProps) => {
  const navigate = useNavigate();
  const handleAddNewCloth = () => {
    navigate("/add-cloth");
  }
  const clothingItems = [
    {
      id: 1,
      type: "top",
      image: "src/assets/DummyWardrobe/Top/1.png",
      brand: "Zara",
      category: "Men's Shirt",
      favorite: true,
      featured: false,
    },
    {
      id: 2,
      type: "top",
      image: "https://pngimg.com/uploads/tshirt/tshirt_PNG5439.png",
      brand: "Uniqlo",
      category: "Men's T-Shirt",
      favorite: false,
      featured: true,
    },
    {
      id: 3,
      type: "top",
      image: "https://pngimg.com/uploads/jacket/jacket_PNG8036.png",
      brand: "Levi's",
      category: "Men's Jacket",
      favorite: false,
      featured: false,
    },
    {
      id: 4,
      type: "bottom",
      image: "src/assets/DummyWardrobe/Bottom/1.png",
      brand: "Wrangler",
      category: "Men's Jeans",
      favorite: true,
      featured: true,
    },
    {
      id: 5,
      type: "bottom",
      image: "src/assets/DummyWardrobe/Bottom/2.png",
      brand: "Dockers",
      category: "Men's Trousers",
      favorite: false,
      featured: true,
    },
    {
      id: 6,
      type: "bottom",
      image: "src/assets/DummyWardrobe/Bottom/3.png",
      brand: "Nike",
      category: "Men's Shorts",
      favorite: true,
      featured: false,
    },
    {
      id: 7,
      type: "shoes",
      image: "https://down-yuantu.pngtree.com/shetu/element/40134/5093.png?e=1760912609&st=MzE2ZmU1ZTY3OTk5Y2U4OGFiMjY2ZTdmN2IzZDdmMGI&n=%E2%80%94Pngtree%E2%80%94black+sneakers_5649575.png",
      brand: "Adidas",
      category: "Men's Sneakers",
      favorite: false,
      featured: true,
    },
    {
      id: 8,
      type: "shoes",
      image: "https://down-yuantu.pngtree.com/element_our/20220607/bg/50452ac24b184.png?e=1760912761&st=YThkNDk3NjczNGM2MzhjNzU0Yjc3OGE0NDViOTdmZGE&n=%E2%80%94Pngtree%E2%80%94white+shoes_8080511.png",
      brand: "Clarks",
      category: "Men's Dress Shoes",
      favorite: true,
      featured: false,
    },
    {
      id: 9,
      type: "shoes",
      image: "https://png.pngtree.com/png-clipart/20240323/original/pngtree-baby-blue-shoe-accessory-png-image_14662285.png",
      brand: "Timberland",
      category: "Men's Boots",
      favorite: false,
      featured: true,
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
      {clothingItems.map((item) => (
        item.type === activeTab && (
        <ClothingCard
          key={item.id}
          {...item}
          isSelected={selectedItems.includes(item.id)}
          onSelect={() => onItemSelect(item.id)}
        />)
      ))}
      
      {/* Add New Item Cards */}
      {[...Array(1)].map((_, index) => (
        <button
          key={`add-${index}`}
          className="aspect-square h-full w-43 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-accent transition-colors flex items-center justify-center"
        >
          <Plus className="w-8 h-8 text-gray-400" onClick={handleAddNewCloth} />
        </button>
      ))}
    </div>
  );
};

export default WardrobeGrid;
