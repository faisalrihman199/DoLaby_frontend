import { Shuffle, Heart } from "lucide-react";
import { GoArrowSwitch } from "react-icons/go";
import { IoSparkles, IoSparklesOutline } from "react-icons/io5";
import { WardrobeItem } from "../../types/wardrobe";
import { useAPP } from "../../contexts/AppContext";
import botImage from "../../assets/DummyWardrobe/AI_Bot/bot.png";
import defaultBottomImage from "../../assets/DummyWardrobe/Bottom/1.png";

interface OutfitSidebarProps {
  selectedTop?: WardrobeItem;
  selectedBottom?: WardrobeItem;
  selectedShoes?: WardrobeItem;
  onTryOn?: () => void;
  onAISuggest?: () => void;
  canTryOn?: boolean;
  tryOnLoading?: boolean;
  uploading?: boolean;
}

const OutfitSidebar = ({ selectedTop, selectedBottom, selectedShoes, onTryOn, onAISuggest, canTryOn, tryOnLoading, uploading }: OutfitSidebarProps) => {
  const { user } = useAPP();
  // Build outfit items from selected items
  const outfitItems = [
    {
      id: 1,
      image: selectedTop?.image_url || null,
      label: "Top",
      name: selectedTop?.name || "Select a top",
      isEmpty: !selectedTop,
    },
    {
      id: 2,
      image: selectedBottom?.image_url || null,
      label: "Bottom",
      name: selectedBottom?.name || "Select bottoms",
      isEmpty: !selectedBottom,
    },
    {
      id: 3,
      image: selectedShoes?.image_url || null,
      label: "Shoes",
      name: selectedShoes?.name || "Select shoes",
      isEmpty: !selectedShoes,
    },
  ];

  // optional: plug your animation style here (kept API compatible)
  const animStyle = {};

  return (
    <div className="w-[100%] flex ">
      <div className="w-[30%] hidden md:flex items-end px-1" >
        <img src={botImage} alt="AI Bot"
          className="max-w-full"
        />
      </div>
      <div className="bg-accent w-full md:w-[70%] rounded-lg border-1 border-color-primary p-4 h-fit">
        {/* Loading Bar - shown when uploading */}
        {uploading && (
          <div className="mb-4 w-full bg-blue-100 rounded-full h-2.5 overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-300 ease-in-out"
              style={{ 
                width: '100%',
                animation: 'progress 1.5s ease-in-out infinite'
              }}
            ></div>
          </div>
        )}
        
        {/* Title like your reference */}
        <div className="text-[20px] md:text-[25px] tracking-tight text-sky-800 mb-2 font-kanit">
          Formal Look
        </div>

        {/* Cards styled like the target, mapping unchanged */}
        <div className="flex  md:flex-col gap-4" style={animStyle}>
          {outfitItems.map((item, index) => (
            <div key={item.id} className="relative rounded-xl bg-[#E8F2FF] p-3">
              {/* <button
                type="button"
                aria-label="favorite"
                className="absolute right-3 top-3 inline-flex items-center justify-center text-sky-900/60 hover:text-sky-900"
              >
                <GoArrowSwitch className="hidden md:block w-7 h-5 text-black " />
              </button> */}

              <div className="flex items-start justify-between gap-4">
                {item.isEmpty ? (
                  <div className="flex items-center justify-center h-20 w-20">
                    <svg className="h-12 w-12 text-sky-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                ) : (
                  <img
                    src={item.image || ''}
                    alt={item.label}
                    className="object-contain self-start  h-20 mb-1 select-none"
                    style={{ background: "none", border: "none", boxShadow: "none", outline: "none" }}
                    draggable={false}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}
                {/* Try-on icon on third card (shoes) when person image is uploaded */}
                {index === 2 && canTryOn && (
                  <button
                    onClick={onTryOn}
                    disabled={tryOnLoading}
                    className="ml-auto flex-shrink-0 p-2 rounded-full bg-blue-900 hover:bg-blue-800 text-white disabled:opacity-50 transition-all"
                    title="Try On Outfit"
                  >
                    {tryOnLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <IoSparkles className="w-5 h-5" />
                    )}
                  </button>
                )}
              </div>

              <div className="mt-1 flex  items-center justify-between md:text-[20px] sm:text-[15px] leading-none text-sky-800 font-kanit">
                <div>
                  <div>{item.label}</div>
                </div>
                <GoArrowSwitch className="md:hidden sm:block w-5 h-4 text-black " />
              </div>
            </div>
          ))}
        </div>

        {/* Kept your existing CTA + mascot below; feel free to remove if not needed */}
        <button
          className={`w-full mt-4 bg-[#FB9C20] hover:bg-[#FB9C20]/90 text-[20px] text-white  py-3 px-4 rounded-lg transition-colors flex font-kanit items-center justify-center gap-2 ${!canTryOn ? 'opacity-60 cursor-not-allowed' : ''}`}
          onClick={() => { if (canTryOn && onAISuggest) onAISuggest(); }}
          disabled={!canTryOn}
        >
          AI Suggest
          <IoSparkles className=" text-[#448AFF]" />
        </button>


      </div>
    </div>
  );
};

export default OutfitSidebar;
