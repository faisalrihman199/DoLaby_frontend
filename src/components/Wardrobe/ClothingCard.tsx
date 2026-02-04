import { Check, Star, Sparkles, Trash2, Heart, Edit } from "lucide-react";

interface ClothingCardProps {
  id: number;
  image: string;
  category: string;
  isSelected: boolean;
  onSelect?: () => void;
  favorite?: boolean;
  featured?: boolean;
  onToggleFavorite?: (id: number) => void;
  onDelete?: (id: number) => void;
  onEdit?: (id: number) => void;
}

const ClothingCard = ({
  id,
  image,
  category,
  isSelected,
  onSelect,
  favorite,
  featured,
  onToggleFavorite,
  onDelete,
  onEdit,
}: ClothingCardProps) => {
  return (
    <div
      className={`relative overflow-hidden transition-all ${onSelect ? 'cursor-pointer' : 'cursor-default'} ${isSelected
        ? "ring-1 rounded ring-[hsl(var(--wardrobe-selected))] shadow-sm"
        : onSelect ? "hover:shadow-md" : ""
        }`}
      onClick={onSelect}
    >
      {/* Checkbox - only show if selectable */}
      {onSelect && (
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
      )}

      {/* Image */}
      <div className="aspect-square bg-white/70 rounded-lg p-4 pb-8">

        <img
          src={image}
          alt={category}
          className="w-[200px] h-[150px] object-contain rounded"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "https://www.pngall.com/wp-content/uploads/2016/05/Clothes-PNG-Image.png";
          }}
        />
      </div>

      {/* Footer */}
      <div className="p-2 ">
        <div className="flex items-center justify-between mb-1">
          <div className="flex gap-1">
            <button 
              className="text-gray-400 hover:text-blue-600 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                if (onEdit) onEdit(id);
              }}
              title="Edit"
            >
              <Edit className="w-3 h-3" />
            </button>
            <button 
              className="text-gray-400 hover:text-red-600 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                if (onDelete) onDelete(id);
              }}
              title="Delete"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
          <div className="flex gap-1">
            {onToggleFavorite && (
              <button 
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the card selection
                  onToggleFavorite(id);
                }}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Heart 
                  className={`w-3 h-3 ${favorite ? 'fill-red-500 text-red-500' : ''}`} 
                />
              </button>
            )}
            {favorite && (
              <Star className="w-3 h-3 fill-[hsl(var(--wardrobe-accent))] text-[hsl(var(--wardrobe-accent))]" />
            )}
            {featured && (
              <Sparkles className="w-3 h-3 text-blue-500" />
            )}
          </div>
        </div>
        <p className="text-[15px] font-kanit text-color-primary">{category}</p>
      </div>
    </div>
  );
};

export default ClothingCard;
