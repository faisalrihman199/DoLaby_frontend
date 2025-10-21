import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Keyboard } from 'swiper/modules';
import Weather from './Weather';
import WearTryOn from './WaerTryOn';
import { IoMdHeartEmpty } from 'react-icons/io';

import 'swiper/css';
import 'swiper/css/effect-coverflow';

export default function HeroSection() {
  const initialLooks = [
    { id: 1, image: 'src/assets/Home/HeroSection/look_1/look.png', title: 'Look 18', folder: 'look_1' },
    { id: 2, image: 'src/assets/Home/HeroSection/look_2/look.png', title: 'Look 19', folder: 'look_2' },
    { id: 3, image: 'src/assets/Home/HeroSection/look_3/look.png', title: 'Look 20', folder: 'look_3' },
    { id: 4, image: 'src/assets/Home/HeroSection/look_4/look.png', title: 'Look 21', folder: 'look_4' },
  ];

  const [activeIndex, setActiveIndex] = useState(initialLooks.length - 1);
  const [cardAnimDir, setCardAnimDir] = useState(null);
  const [vw, setVw] = useState(typeof window !== 'undefined' ? window.innerWidth : 1280);
  const swiperRef = useRef(null);

  // ------- sizing presets (unchanged) -------
  function getSizing(width) {
    if (width < 640) {
      return { ACTIVE_W: 100, ACTIVE_H: 280, NEIGHBOR_OVERLAP: 10, TRANSITION_TIME: 550, TRANSITION: 'all 0.55s linear' };
    } else if (width < 1024) {
      return { ACTIVE_W: 180, ACTIVE_H: 340, NEIGHBOR_OVERLAP: 15, TRANSITION_TIME: 700, TRANSITION: 'all 0.7s linear' };
    }
    return { ACTIVE_W: 150, ACTIVE_H: 380, NEIGHBOR_OVERLAP: 20, TRANSITION_TIME: 800, TRANSITION: 'all 0.8s linear' };
  }

  const { ACTIVE_W, ACTIVE_H, NEIGHBOR_OVERLAP, TRANSITION_TIME, TRANSITION } = getSizing(vw);

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);


  const handleSlideChange = (swiper) => {
    const prevIndex = activeIndex;
    const newIndex = swiper.activeIndex;
    const n = initialLooks.length;
    const stepsLeft = (newIndex - prevIndex + n) % n;
    const stepsRight = (prevIndex - newIndex + n) % n;
    setCardAnimDir(stepsLeft <= stepsRight ? 'down' : 'up');
    setActiveIndex(newIndex);
    setTimeout(() => setCardAnimDir(null), TRANSITION_TIME);
  };

  const activeFolder = initialLooks[activeIndex]?.folder;

  // ---------- layout ----------
  return (
    <div
      className="w-full relative"

    >
      {/* Weather — parked near top-center-left like the mock */}
      <div className="absolute left-1/2 -translate-x-20 top-6 z-10 hidden md:block">
        <Weather />
      </div>

      <div className="mx-auto w-[100%] max-w-[100vw] px-2 py-6">

        <div className="w-[100%] flex flex-row items-end justify-center w-full px-3 sm:px-4 md:px-4 lg:px-4 pb-8 sm:pb-12 lg:pb-16 gap-x-4 sm:gap-x-6 lg:gap-x-8">

          <div className="hidden sm:flex flex-1 items-end justify-start">
            <WearTryOn />
          </div>

          <div className="md:w-[60%] sm:w-[100%] flex items-end justify-center overflow-visible">
            <div
              className="relative flex flex-row items-center justify-center gap-0 overflow-visible"
              style={{ minHeight: ACTIVE_H + 20 }}
            >
              <Swiper
                ref={swiperRef}
                effect="coverflow"
                grabCursor
                centeredSlides
                slidesPerView="auto"
                initialSlide={initialLooks.length - 3}
                coverflowEffect={{
                  rotate: 0,
                  stretch: -NEIGHBOR_OVERLAP,
                  depth: 145,
                  modifier: 3,
                  slideShadows: false,
                }}
                keyboard={{ enabled: true }}
                speed={TRANSITION_TIME}
                modules={[EffectCoverflow, Keyboard]}
                onSlideChange={handleSlideChange}
                style={{ overflow: isMobile?'hidden':'visible', width: '100%' }}
              >
                {initialLooks.map((look, idx) => {
                  const n = initialLooks.length;
                  const relPos = (idx - activeIndex + n) % n;
                  return (
                    <SwiperSlide key={look.id} style={{ width: 'auto' }}>
                      <div
                        className="flex items-center justify-center rounded-lg overflow-hidden flex-shrink-0 outline-none focus:outline-none filter"
                        tabIndex={-1}
                        aria-label={look.title}
                        style={{
                          width: `${ACTIVE_W}px`,
                          height: `${ACTIVE_H}px`,
                          position: 'relative',
                          cursor: relPos === 0 ? 'grab' : 'pointer',
                          opacity: relPos === 0 ? 1 : relPos === 1 ? 0.55 : relPos === n - 1 ? 0.75 : 0.55,
                          filter: relPos === 0 ? 'blur(0px)' : relPos === 1 ? 'blur(2px)' : relPos === n - 1 ? 'blur(0px)' : 'blur(2px)',
                          transition: 'opacity 0.25s linear, filter 0.25s linear',
                        }}
                      >
                        <img
                          src={look.image}
                          alt={look.title}
                          className="object-contain w-full h-full"
                          style={{ userSelect: 'none', pointerEvents: 'none', display: 'block' }}
                          draggable={false}
                        />
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          </div>

          {/* RIGHT: Formal Look panel (col-span-12 on tablet, 3 on desktop) */}
          {activeFolder && (() => {
            const parts = [
              { label: 'Top', src: `src/assets/Home/HeroSection/${activeFolder}/top.png`, brand: 'H&M', price: '120€' },
              { label: 'Bottom', src: `src/assets/Home/HeroSection/${activeFolder}/bottom.png` },
              { label: 'Shoes', src: `src/assets/Home/HeroSection/${activeFolder}/shoes.png` },
            ];

            let animStyle = {};
            if (cardAnimDir === 'up') animStyle = { transform: 'translateY(-40px)', opacity: 0, transition: TRANSITION };
            else if (cardAnimDir === 'down') animStyle = { transform: 'translateY(40px)', opacity: 0, transition: TRANSITION };
            else animStyle = { transform: 'translateY(0)', opacity: 1, transition: TRANSITION };

            return (
              <div className='hidden md:w-40% md:flex flex-col border rounded-lg border-[#0365A2] p-2 pb-4' >
                <div className="text-[20px] md:text-[25px] tracking-tight text-sky-800  font-kanit">
                  Formal Look
                </div>
              <div
                className=" flex-1 py-2 pb-6 flex-col gap-4   items-stretch justify-start"
                style={animStyle}
              >
                {parts.map((part) => (
                  <div
                    key={part.label}
                    className="relative my-3 w-50 flex flex-col items-start rounded-2xl bg-[#F2F8FD] shadow-sm p-4 md:p-5 border border-sky-900/5"
                  >
                    {/* Heart */}
                    <button
                      type="button"
                      className="absolute right-4 top-4 inline-flex items-center justify-center text-sky-900/70 hover:scale-110 transition-transform"
                      aria-label="favorite"
                    >
                      <IoMdHeartEmpty className="w-6 h-6" />
                    </button>

                    {/* Content row: image left, price/brand right (if provided) */}
                    <div className="flex items-center gap-4 md:gap-5">
                      <img
                        src={part.src}
                        alt={part.label}
                        className="w-full h-24 md:w-full  
                      justify-self-start  md:h-16 object-contain select-none pointer-events-none"
                        draggable={false}
                        onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
                      />
                   
                    </div>

                    {/* Label at bottom-left */}
                    <div className="mt-2 md:mt-3 text-[20px] md:text-[22px] leading-none text-sky-800 font-semibold">
                      {part.label}
                    </div>
                  </div>
                ))}
              </div>
              </div>
            );
          })()}

        </div>

        {/* Mobile parts row */}
        <div className="md:hidden mt-6 flex justify-center">
          {activeFolder && (() => {
            const parts = [
              { label: 'Top', src: `src/assets/Home/HeroSection/${activeFolder}/top.png` },
              { label: 'Bottom', src: `src/assets/Home/HeroSection/${activeFolder}/bottom.png` },
              { label: 'Shoes', src: `src/assets/Home/HeroSection/${activeFolder}/shoes.png` },
            ];
            return (
              <div className="flex gap-3">
                {parts.map((p) => (
                  <div key={p.label} className="rounded-lg bg-[#E8F2FF] p-2 w-24">
                    <div className="w-full h-20 mb-1 flex items-center justify-center overflow-hidden">
                      <img
                        src={p.src}
                        alt={p.label}
                        className="object-contain w-full h-full"
                        draggable={false}
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    </div>
                    <div className="text-center text-[11px] font-semibold text-sky-800">
                      {p.label}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
