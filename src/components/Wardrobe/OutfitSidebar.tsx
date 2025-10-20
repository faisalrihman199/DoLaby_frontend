import { Shuffle, Heart } from "lucide-react";
import { GoArrowSwitch } from "react-icons/go";
import { IoSparkles, IoSparklesOutline } from "react-icons/io5";

const OutfitSidebar = () => {
  // same data
  const outfitItems = [
    {
      id: 1,
      image: "https://pngimg.com/uploads/tshirt/tshirt_PNG5439.png",
      label: "Top",
    },
    {
      id: 2,
      image: "src/assets/DummyWardrobe/Bottom/1.png",
      label: "Bottom", // kept as-is
    },
    {
      id: 3,
      image: "https://down-yuantu.pngtree.com/shetu/element/40134/5093.png?e=1760912609&st=MzE2ZmU1ZTY3OTk5Y2U4OGFiMjY2ZTdmN2IzZDdmMGI&n=%E2%80%94Pngtree%E2%80%94black+sneakers_5649575.png",
      label: "Shoes",
    },
  ];

  // optional: plug your animation style here (kept API compatible)
  const animStyle = {};

  return (
    <div className="w-[100%] flex ">
      <div className="w-[30%] hidden md:flex items-end px-1" >
        <img src="src/assets/DummyWardrobe/AI_Bot/bot.png" alt="AI Bot"
          className="max-w-full"
        />
      </div>
      <div className="bg-accent w-full md:w-[70%] rounded-lg border-1 border-color-primary p-4 h-fit">
        {/* Title like your reference */}
        <div className="text-[20px] md:text-[25px] tracking-tight text-sky-800 mb-2 font-kanit">
          Formal Look
        </div>

        {/* Cards styled like the target, mapping unchanged */}
        <div className="flex  md:flex-col gap-4" style={animStyle}>
          {outfitItems.map((item) => (
            <div key={item.id} className="relative rounded-xl bg-[#E8F2FF] p-3">
              <button
                type="button"
                aria-label="favorite"
                className="absolute right-3 top-3 inline-flex items-center justify-center text-sky-900/60 hover:text-sky-900"
              >
                <GoArrowSwitch className="hidden md:block w-7 h-5 text-black " />
              </button>

              <div className="flex items-start justify-between gap-4">
                <img
                  src={item.image}
                  alt={item.label}
                  className="object-contain self-start  h-20 mb-1 select-none"
                  style={{ background: "none", border: "none", boxShadow: "none", outline: "none" }}
                  draggable={false}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>

              <div className="mt-1 flex  items-center justify-between md:text-[20px] sm:text-[15px] leading-none text-sky-800 font-kanit">
                {item.label}
                <GoArrowSwitch className="md:hidden sm:block w-5 h-4 text-black " />
              </div>
            </div>
          ))}
        </div>

        {/* Kept your existing CTA + mascot below; feel free to remove if not needed */}
        <button className="w-full mt-4 bg-[#FB9C20] hover:bg-[#FB9C20]/90 text-[20px] text-white  py-3 px-4 rounded-lg transition-colors flex font-kanit items-center justify-center gap-2">

          AI Suggest
          <IoSparkles className=" text-[#448AFF]" />
        </button>


      </div>
    </div>
  );
};

export default OutfitSidebar;
