import { Check, Star, Sparkles, Trash2 } from "lucide-react";

interface ClothingCardProps {
  id: number;
  image: string;
  brand: string;
  category: string;
  isSelected: boolean;
  onSelect: () => void;
  favorite?: boolean;
  featured?: boolean;
}

const ClothingCard = ({
  image,
  brand,
  category,
  isSelected,
  onSelect,
  favorite,
  featured,
}: ClothingCardProps) => {
  return (
    <div
      className={`relative overflow-hidden transition-all cursor-pointer ${isSelected
        ? "ring-1 rounded ring-[hsl(var(--wardrobe-selected))] shadow-sm"
        : "hover:shadow-md"
        }`}
      onClick={onSelect}
    >
      {/* Checkbox */}
      <div className="absolute top-2 right-2 z-10">
        <div
          className={`w-4 h-4 border-1 black flex items-center justify-center ${isSelected
            ? "border-black"
            : "border-black"
            }`}
        >
          {isSelected && <Check className="w-3 h-3 text-black" strokeWidth={3} />}
        </div>
      </div>

      {/* Image */}
      <div className="aspect-square bg-white/70 rounded-lg p-4 pb-8">

        <img
          src={image}
          alt={category}
          className="w-[200px] h-[150px] object-cover rounded"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "https://www.pngall.com/wp-content/uploads/2016/05/Clothes-PNG-Image.png";
          }}
        />
      </div>

      {/* Footer */}
      <div className="p-2 ">
        <div className="flex items-center justify-between mb-1">
          <button className="text-gray-400 hover:text-gray-600">
            <Trash2 className="w-3 h-3" />
          </button>
          <div className="flex gap-1">
            {favorite && (
              <Star className="w-3 h-3 fill-[hsl(var(--wardrobe-accent))] text-[hsl(var(--wardrobe-accent))]" />
            )}
            {featured && (
              <Sparkles className="w-3 h-3 text-blue-500" />
            )}
          </div>
        </div>
        <p className="text-[15px] font-kanit text-color-primary">{category}</p>
        <p className="text-[15px] font-kanit font-bold text-color-primary">{brand}</p>
      </div>
    </div>
  );
};

export default ClothingCard;
