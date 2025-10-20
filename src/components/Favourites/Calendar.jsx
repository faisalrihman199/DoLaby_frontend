import React, { useState } from 'react';

const Calendar = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Using looks from HeroSection data
  const initialLooks = [
    { id: 1, image: 'src/assets/Home/HeroSection/look_1/look.png', title: 'Look 18', folder: 'look_1' },
    { id: 2, image: 'src/assets/Home/HeroSection/look_2/look.png', title: 'Look 19', folder: 'look_2' },
    { id: 3, image: 'src/assets/Home/HeroSection/look_3/look.png', title: 'Look 20', folder: 'look_3' },
    { id: 4, image: 'src/assets/Home/HeroSection/look_4/look.png', title: 'Look 21', folder: 'look_4' },
  ];

  // Schedule outfits for each day
  const [outfitSchedule] = useState({
    0: [initialLooks[0]], // Monday - Look 1
    1: [], // Tuesday
    2: [initialLooks[3]], // Wednesday - Look 4
    3: [initialLooks[2]], // Thursday - Look 3
    4: [], // Friday
    5: [], // Saturday
    6: [initialLooks[1], initialLooks[3]], // Sunday - Look 2, Look 4
  });

  return (
    <div className="w-full  py-8 px-6 rounded-lg">
      {/* Header */}
      <div className="flex justify-center mb-8">
        <div className="border-2 border-color-primary rounded-lg px-4 py-1">
          <h2 className="text-[25px] font-semibold text-color-primary inter">Calendar</h2>
        </div>
      </div>

      {/* Days Header */}
      <div className="flex gap-0 mb-4 ">
        {days.map((day) => (
          <div key={day} className="flex-1 text-center">
            <h3 className="text-[25px] font-kanit text-black">{day}</h3>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="border-1 border-color-primary rounded-xl overflow-hidden bg-[#F0F1F494]">
        <div className="grid grid-cols-7 gap-0 divide-x-1 divide-y-1 divide-black">
          {days.map((day, dayIndex) => (
            <div
              key={dayIndex}
              className="min-h-96 bg-gradient-to-b from-blue-50 to-white p-4 flex flex-col items-center gap-6 overflow-y-auto"
            >
              {outfitSchedule[dayIndex]?.length > 0 ? (
                outfitSchedule[dayIndex].map((outfit) => (
                  <div
                    key={outfit.id}
                    className="flex flex-col items-center justify-center"
                  >
                    <img
                      src={outfit.image}
                      alt={outfit.title}
                      className="h-40 w-auto object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                ))
              ) : (
                <div className="h-full flex items-center justify-center text-gray-300">
                  {/* Empty state */}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      
    </div>
  );
};

export default Calendar;