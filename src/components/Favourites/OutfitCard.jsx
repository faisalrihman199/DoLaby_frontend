import React from 'react'



const OutfitCard = ({ outfit = dummyOutfits[0] }) => {
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
        
        {/* Last Used Badge - Top Right */}
        {outfit.lastUsed !== null && (
          <div className="absolute top-1 right-0 z-10">
            <div className="bg-[#2DA13A] font-kanit text-black text-[9px] font-bold px-2 py-0.5  relative whitespace-nowrap">
              <span>Last Used
                {' '}{outfit.lastUsed}d ago</span>
            </div>
          </div>
        )}

        {/* Product Image */}
        <div className="w-full h-[180px] flex justify-center items-center">
          <img
            src={outfit.image}
            alt={outfit.label}
            className="w-full h-[180px] object-contain p-2"
            onError={(e) => (e.target.style.display = 'none')}
          />
        </div>

        {/* USE Button - Bottom Left */}
        <button className="absolute font-kanit bottom-2 left-2 bg-[#2DA13A] hover:bg-[#2DA13A]/20 text-white px-2  rounded-full font-bold text-[10px] transition-all duration-300">
          USE
        </button>
      </div>

      {/* Label - Below Card */}
      <div className="mt-1 text-start">
        <h3 className="text-[15px]  font-kanit px-2 text-color-primary">{outfit.label}</h3>
      </div>
    </div>
  );
};

export default OutfitCard;