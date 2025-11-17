import React from 'react';
import { Heart } from 'lucide-react';
import { WardrobeItem } from '../../types/wardrobe';

interface OutfitCardProps {
  item: WardrobeItem;
  onToggleFavorite?: (id: number) => void;
}

const OutfitCard = ({ item, onToggleFavorite }: OutfitCardProps) => {
  // Calculate days since last use (placeholder logic - you might want to track this in API)
  const getLastUsedDays = () => {
    if (item.updated_at) {
      const lastUsed = new Date(item.updated_at);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - lastUsed.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return null;
  };

  const lastUsedDays = getLastUsedDays();
  return (
    <div className="flex flex-col items-center">
      {/* Main Card */}
      <div
        className="relative rounded-lg p-4 pb-16 flex flex-col items-center shadow-lg border border-blue-200"
        style={{
          width: '160px',
          height: '200px',
          background: 'linear-gradient(180deg, #E3ECF6 0%, #DDE8F1 27.4%, #E9F0F5 68.27%, #EEF2F8 100%)'
        }}
      >
        
        {/* Favorite Toggle - Top Left */}
        {onToggleFavorite && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(item.id);
            }}
            className="absolute top-1 left-1 z-10 p-1 rounded-full bg-white/80 hover:bg-white transition-colors"
          >
            <Heart className="w-3 h-3 fill-red-500 text-red-500" />
          </button>
        )}

        {/* Last Used Badge - Top Right */}
        {lastUsedDays !== null && (
          <div className="absolute top-1 right-0 z-10">
            <div className="bg-[#2DA13A] font-kanit text-black text-[9px] font-bold px-2 py-0.5  relative whitespace-nowrap">
              <span>Last Used
                {' '}{lastUsedDays}d ago</span>
            </div>
          </div>
        )}

        {/* Product Image */}
        <div className="w-full h-[180px] flex justify-center items-center">
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-[180px] object-contain p-2"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
        </div>

        {/* USE Button - Bottom Left */}
        <button className="absolute font-kanit bottom-2 left-2 bg-[#2DA13A] hover:bg-[#2DA13A]/20 text-white px-2  rounded-full font-bold text-[10px] transition-all duration-300">
          USE
        </button>
      </div>

      {/* Label - Below Card */}
      <div className="mt-1 text-start">
        <h3 className="text-[15px] font-kanit px-2 text-color-primary">{item.name}</h3>
        <p className="text-[12px] font-kanit px-2 text-gray-600">{item.brand.name}</p>
      </div>
    </div>
  );
};

export default OutfitCard;