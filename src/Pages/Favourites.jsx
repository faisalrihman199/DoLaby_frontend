import React from 'react'
import WardrobeFilters from '../components/Wardrobe/WardrobeFilters'
import OutfitCard from '../components/Favourites/OutfitCard'
import Calendar from '../components/Favourites/Calendar';

const Favourites = () => {
    const dummyOutfits = [
  {
    image: '/src/assets/Home/HeroSection/look_1/look.png',
    label: 'Formal dress',
    lastUsed: 3,
  },
  {
    image: '/src/assets/Home/HeroSection/look_2/look.png',
    label: 'Casual wear',
    lastUsed: 7,
  },
  {
    image: '/src/assets/Home/HeroSection/look_3/look.png',
    label: 'Party outfit',
    lastUsed: 1,
  },
  {
    image: '/src/assets/Home/HeroSection/look_4/look.png',
    label: 'Sporty look',
    lastUsed: null,
  },
  {
    image: '/src/assets/Home/HeroSection/look_4/look.png',
    label: 'Sporty look',
    lastUsed: null,
  },
  {
    image: '/src/assets/Home/HeroSection/look_4/look.png',
    label: 'Sporty look',
    lastUsed: null,
  },
  {
    image: '/src/assets/Home/HeroSection/look_4/look.png',
    label: 'Sporty look',
    lastUsed: null,
  },
];
    return (
        <div>
            <h1 className="text-3xl font-semibold text-color-primary text-center inter">
                Favorite Outfits
            </h1>
            <div className='my-4'>

                <WardrobeFilters />
            </div>
            <div className="flex w-[100%]">
                <div className="hidden md:block md:w-[10%] px-2">
                    <img src="src/assets/DummyWardrobe/AI_Bot/bot.png" alt="AI Bot"
                        className="max-w-full"
                    />
                </div>
                <div className="w-[100%] md:w-[90%] flex flex-wrap justify-start gap-1 md:gap-6">
                    {dummyOutfits.map((outfit, index) => (
                        <OutfitCard key={index} outfit={outfit} />
                    ))}
                    <Calendar />
                </div>

            </div>

        </div>
    )
}

export default Favourites