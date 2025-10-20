import React, { useState, useRef, useEffect } from 'react';
import Weather from './Weather';
import WearTryOn from './WaerTryOn';
import { IoMdHeartEmpty } from 'react-icons/io';

export default function HeroSection() {
  const initialLooks = [
    { id: 1, image: 'src/assets/Home/HeroSection/look_1/look.png', title: 'Look 18', folder: 'look_1' },
    { id: 2, image: 'src/assets/Home/HeroSection/look_2/look.png', title: 'Look 19', folder: 'look_2' },
    { id: 3, image: 'src/assets/Home/HeroSection/look_3/look.png', title: 'Look 20', folder: 'look_3' },
    { id: 4, image: 'src/assets/Home/HeroSection/look_4/look.png', title: 'Look 21', folder: 'look_4' },
  ];

  const [looks, setLooks] = useState(initialLooks);
  const [isAnimating, setIsAnimating] = useState(false);
  const [cardAnimDir, setCardAnimDir] = useState(null); // 'up' | 'down' | null
  const [vw, setVw] = useState(typeof window !== 'undefined' ? window.innerWidth : 1280);

  const containerRef = useRef(null);
  const dragRef = useRef();

  // ---------- Responsive sizing presets ----------
  function getSizing(width) {
    if (width < 640) {
      // mobile
      return {
        ACTIVE_W: 150,
        ACTIVE_H: 280,
        RIGHT_SCALE: 0.9,
        LEFT_SCALE: 0.82,
        FAR_SCALE: 0.70,
        NEIGHBOR_OVERLAP: 36,
        FAR_OVERLAP: 48,
        STEP_MS: 480,
        TRANSITION: 'transform 0.55s ease, opacity 0.55s ease, filter 0.55s ease, width 0.55s ease, height 0.55s ease, margin 0.55s ease',
      };
    } else if (width < 1024) {
      // tablet
      return {
        ACTIVE_W: 180,
        ACTIVE_H: 340,
        RIGHT_SCALE: 0.91,
        LEFT_SCALE: 0.83,
        FAR_SCALE: 0.72,
        NEIGHBOR_OVERLAP: 46,
        FAR_OVERLAP: 60,
        STEP_MS: 560,
        TRANSITION: 'transform 0.7s ease, opacity 0.7s ease, filter 0.7s ease, width 0.7s ease, height 0.7s ease, margin 0.7s ease',
      };
    }
    // desktop
    return {
      ACTIVE_W: 200,
      ACTIVE_H: 380,
      RIGHT_SCALE: 0.92,
      LEFT_SCALE: 0.82,
      FAR_SCALE: 0.72,
      NEIGHBOR_OVERLAP: 56,
      FAR_OVERLAP: 72,
      STEP_MS: 600,
      TRANSITION: 'transform 0.8s ease, opacity 0.8s ease, filter 0.8s ease, width 0.8s ease, height 0.8s ease, margin 0.8s ease',
    };
  }

  const {
    ACTIVE_W,
    ACTIVE_H,
    RIGHT_SCALE,
    LEFT_SCALE,
    FAR_SCALE,
    NEIGHBOR_OVERLAP,
    FAR_OVERLAP,
    STEP_MS,
    TRANSITION,
  } = getSizing(vw);

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ---------- Rotation helpers ----------
  const rotateLeftOnce = () =>
    new Promise((resolve) => {
      setIsAnimating(true);
      setCardAnimDir('down');
      setTimeout(() => {
        setLooks((prev) => [...prev.slice(1), prev[0]]); // first -> end
        setIsAnimating(false);
        setCardAnimDir(null);
        resolve();
      }, STEP_MS);
    });

  const rotateRightOnce = () =>
    new Promise((resolve) => {
      setIsAnimating(true);
      setCardAnimDir('up');
      setTimeout(() => {
        setLooks((prev) => [prev[prev.length - 1], ...prev.slice(0, prev.length - 1)]); // last -> front
        setIsAnimating(false);
        setCardAnimDir(null);
        resolve();
      }, STEP_MS);
    });

  // Direct jump (shortest path)
  async function goTo(index) {
    if (isAnimating || index < 0 || index >= looks.length) return;
    const n = looks.length;
    const stepsLeft = (index + 1) % n;      // first->end to make clicked last
    const stepsRight = (n - stepsLeft) % n; // last->front complement
    if (stepsLeft === 0 || stepsRight === 0) return; // already active

    if (stepsLeft <= stepsRight) {
      for (let i = 0; i < stepsLeft; i++) await rotateLeftOnce();
    } else {
      for (let i = 0; i < stepsRight; i++) await rotateRightOnce();
    }
  }

  const shiftLeft = () => rotateRightOnce(); // make left neighbor active
  const shiftRight = () => rotateLeftOnce(); // make right neighbor active

  // ---------- Keyboard ----------
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'ArrowLeft') shiftLeft();
      else if (e.key === 'ArrowRight') shiftRight();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [looks, isAnimating]);

  // ---------- Swipe / drag ----------
  useEffect(() => {
    const ref = containerRef.current;
    if (!ref) return;
    let startX = null;
    let down = false;
    const getX = (e) => (e.touches ? e.touches[0].clientX : e.clientX);

    function onDown(e) { down = true; startX = getX(e); }
    function onMove(e) {
      if (!down || startX == null) return;
      const dx = getX(e) - startX;
      if (Math.abs(dx) > 40) {
        if (dx < 0) shiftRight(); else shiftLeft();
        down = false; startX = null;
      }
    }
    function onUp() { down = false; startX = null; }

    ref.addEventListener('touchstart', onDown, { passive: true });
    ref.addEventListener('touchmove', onMove, { passive: true });
    ref.addEventListener('touchend', onUp);
    ref.addEventListener('mousedown', onDown);
    ref.addEventListener('mousemove', onMove);
    ref.addEventListener('mouseup', onUp);
    ref.addEventListener('mouseleave', onUp);

    return () => {
      ref.removeEventListener('touchstart', onDown);
      ref.removeEventListener('touchmove', onMove);
      ref.removeEventListener('touchend', onUp);
      ref.removeEventListener('mousedown', onDown);
      ref.removeEventListener('mousemove', onMove);
      ref.removeEventListener('mouseup', onUp);
      ref.removeEventListener('mouseleave', onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [looks, isAnimating, vw]);

  return (
    <div className="w-full relative">
      <Weather />

      {/* paddings also adapt via Tailwind */}
      <div className="flex flex-row items-end justify-center w-full px-3 sm:px-6 md:px-12 lg:px-16 pb-8 sm:pb-12 lg:pb-20 gap-x-4 sm:gap-x-6 lg:gap-x-8">
        {/* Left: Try-on (auto hides on very small if you want) */}
        <div className="hidden sm:flex flex-1 items-end justify-start">
          <WearTryOn />
        </div>

        {/* Center: Carousel */}
        <div className="flex-[2] sm:flex-[2] flex items-end justify-center overflow-visible">
          <div
            ref={containerRef}
            className="relative flex flex-row items-center justify-center gap-0 overflow-visible"
            style={{
              maxWidth: '100%',
              minHeight: ACTIVE_H * 0.8, // ensure a bit of space on mobile
              paddingBottom: vw < 640 ? 4 : 8,
            }}
          >
            {looks.map((look, idx) => {
              const n = looks.length;
              const activeIndex = n - 1;
              const isActive = idx === activeIndex;

              let style = {
                transition: isAnimating ? 'none' : TRANSITION,
                cursor: isActive ? 'grab' : 'pointer',
                zIndex: isActive ? 50 : (idx === 0 || idx === activeIndex - 1) ? 30 : 10,
                position: 'relative',
                willChange: 'transform, opacity, filter, width, height, margin',
              };

              if (isActive) {
                style = {
                  ...style,
                  width: `${ACTIVE_W}px`,
                  height: `${ACTIVE_H}px`,
                  transform: 'scale(1)',
                  opacity: 1,
                  filter: 'blur(0px)',
                  marginLeft: '0px',
                  marginRight: '0px',
                };
              } else if (idx === 0) {
                // right neighbor
                style = {
                  ...style,
                  width: `${ACTIVE_W * FAR_SCALE}px`,
                  height: `${ACTIVE_H * FAR_SCALE}px`,
                  transform: `scale(${RIGHT_SCALE})`,
                  opacity: 0.6,
                  filter: 'blur(2px)',
                  order: 1,
                  marginLeft: `-${NEIGHBOR_OVERLAP}px`,
                };
              } else if (idx === activeIndex - 1) {
                // left neighbor
                style = {
                  ...style,
                  width: `${ACTIVE_W * LEFT_SCALE}px`,
                  height: `${ACTIVE_H * LEFT_SCALE}px`,
                  transform: `scale(${LEFT_SCALE})`,
                  opacity: 0.78,
                  filter: 'blur(0px)',
                  order: -1,
                  marginRight: `-${NEIGHBOR_OVERLAP}px`,
                };
              } else {
                // others
                style = {
                  ...style,
                  width: `${ACTIVE_W * FAR_SCALE}px`,
                  height: `${ACTIVE_H * FAR_SCALE}px`,
                  transform: `scale(${FAR_SCALE})`,
                  opacity: 0.6,
                  filter: 'blur(2px)',
                  order: -2,
                  marginRight: `-${FAR_OVERLAP}px`,
                };
              }

              const handleClick = () => {
                if (isAnimating || isActive) return;
                goTo(idx);
              };

              return (
                <div
                  key={look.id}
                  ref={isActive ? dragRef : undefined}
                  onClick={handleClick}
                  style={{ ...style, outline: 'none' }}
                  className="flex items-center justify-center rounded-lg overflow-hidden flex-shrink-0 outline-none focus:outline-none filter"
                  tabIndex={-1}
                  aria-label={look.title}
                >
                  <img
                    src={look.image}
                    alt={look.title}
                    className="object-contain w-full h-full"
                    style={{ display: 'block', userSelect: 'none', pointerEvents: 'none' }}
                    draggable={false}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Details — kept hidden on mobile (md up) */}
        <div className="hidden md:flex flex-1 py-2 pb-8 flex-col gap-4 px-4 items-end justify-center border border-[#0365A2] rounded-lg ">
          {(() => {
            const activeImage = looks[looks.length - 1]?.image;
            let folder = null;
            for (const look of initialLooks) {
              if (look.image === activeImage) { folder = look.folder; break; }
            }
            if (!folder) return null;

            const parts = [
              { label: 'Top', src: `src/assets/Home/HeroSection/${folder}/top.png` },
              { label: 'Bottom', src: `src/assets/Home/HeroSection/${folder}/bottom.png` },
              { label: 'Shoes', src: `src/assets/Home/HeroSection/${folder}/shoes.png` },
            ];

            let animStyle = {};
            const baseTransition = TRANSITION;
            if (cardAnimDir === 'up') {
              animStyle = { transform: 'translateY(-40px)', opacity: 0, transition: baseTransition };
            } else if (cardAnimDir === 'down') {
              animStyle = { transform: 'translateY(40px)', opacity: 0, transition: baseTransition };
            } else {
              animStyle = { transform: 'translateY(0)', opacity: 1, transition: baseTransition };
            }

            return (
              <div className="w-full">
                <div className="text-[20px] md:text-[25px] tracking-tight text-sky-800 mb-2 font-kanit">
                  Formal Look
                </div>
                <div className="flex flex-col gap-4" style={animStyle}>
                  {parts.map((part) => (
                    <div key={part.label} className="relative rounded-xl bg-[#E8F2FF] p-3">
                      <button type="button" className="absolute right-3 top-3 inline-flex items-center justify-center" aria-label="favorite">
                        <IoMdHeartEmpty />
                      </button>
                      <div className="flex items-start justify-between gap-4">
                        <img
                          src={part.src}
                          alt={part.label}
                          className="object-contain w-full h-20 mb-1"
                          style={{ background: 'none', border: 'none', boxShadow: 'none', outline: 'none' }}
                          draggable={false}
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      </div>
                      <div className="mt-1 text-[20px] leading-none text-sky-800 font-kanit ">
                        {part.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Mobile parts row (already responsive) */}
      <div className="flex md:hidden col-span-12 w-full justify-center mt-4 sm:mt-6">
        {(() => {
          const activeImage = looks[looks.length - 1]?.image;
          let folder = null;
          for (const look of initialLooks) {
            if (look.image === activeImage) { folder = look.folder; break; }
          }
          if (!folder) return null;
          const parts = [
            { label: 'Top', src: `src/assets/Home/HeroSection/${folder}/top.png` },
            { label: 'Bottom', src: `src/assets/Home/HeroSection/${folder}/bottom.png` },
            { label: 'Shoes', src: `src/assets/Home/HeroSection/${folder}/shoes.png` },
          ];
          return (
            <div className="flex flex-row gap-3 sm:gap-4 w-full items-center justify-center">
              {parts.map(part => (
                <div key={part.label} className="w-24 sm:w-28 flex flex-col items-center rounded-lg p-2 shadow-sm">
                  <img
                    src={part.src}
                    alt={part.label}
                    className="object-contain w-full h-14 sm:h-16 mb-1"
                    style={{ background: 'none', border: 'none', boxShadow: 'none', outline: 'none' }}
                    draggable={false}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                  <div className="text-center text-[10px] sm:text-xs font-semibold text-gray-700">{part.label}</div>
                </div>
              ))}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
