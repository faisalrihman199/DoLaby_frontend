import React, { useState, useMemo } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import ImageModal from './ImageModal';

const OutfitCalendar = ({ outfits }) => {
  const [currentMonthOffset, setCurrentMonthOffset] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);

  // Get current month based on offset
  const currentDate = useMemo(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + currentMonthOffset);
    return date;
  }, [currentMonthOffset]);

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Group outfits by month
  const outfitsByMonth = useMemo(() => {
    const grouped = {};
    
    outfits.forEach(outfit => {
      if (outfit.type !== 'outfit') return; // Only show outfits
      
      const createdDate = new Date(outfit.created_at);
      const monthKey = `${createdDate.getFullYear()}-${String(createdDate.getMonth()).padStart(2, '0')}`;
      
      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      grouped[monthKey].push(outfit);
    });
    
    return grouped;
  }, [outfits]);

  // Get outfits for current month
  const currentMonthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth()).padStart(2, '0')}`;
  const currentMonthOutfits = outfitsByMonth[currentMonthKey] || [];

  // Get weeks in month with outfits
  const getCalendarWeeks = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Get day of week (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = firstDay.getDay();
    const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Monday start
    
    const weeks = [];
    let currentWeek = [];
    
    // Fill initial empty days
    for (let i = 0; i < startOffset; i++) {
      currentWeek.push(null);
    }
    
    // Fill days of month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const dayOutfits = currentMonthOutfits.filter(outfit => {
        const outfitDate = new Date(outfit.created_at);
        return outfitDate.getDate() === day;
      });
      
      currentWeek.push({ day, date, outfits: dayOutfits });
      
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    
    // Fill remaining empty days
    while (currentWeek.length > 0 && currentWeek.length < 7) {
      currentWeek.push(null);
    }
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
    
    return weeks;
  };

  const weeks = getCalendarWeeks();
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const goToPreviousMonth = () => setCurrentMonthOffset(prev => prev - 1);
  const goToNextMonth = () => setCurrentMonthOffset(prev => prev + 1);
  const goToToday = () => setCurrentMonthOffset(0);

  return (
    <div className="w-full py-8 px-6 rounded-lg">
      {/* Header with Month Navigation */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          aria-label="Previous month"
        >
          <MdChevronLeft className="text-3xl text-color-primary" />
        </button>
        
        <div className="flex items-center gap-4">
          <div className="border-2 border-color-primary rounded-lg px-6 py-2">
            <h2 className="text-[25px] font-semibold text-color-primary inter">
              {monthName}
            </h2>
          </div>
          {currentMonthOffset !== 0 && (
            <button
              onClick={goToToday}
              className="px-4 py-2 bg-color-primary text-white rounded-lg hover:opacity-90 transition-opacity text-sm"
            >
              Today
            </button>
          )}
        </div>
        
        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          aria-label="Next month"
        >
          <MdChevronRight className="text-3xl text-color-primary" />
        </button>
      </div>

      {/* Days Header */}
      <div className="flex gap-0 mb-4">
        {days.map((day) => (
          <div key={day} className="flex-1 text-center">
            <h3 className="text-[25px] font-kanit text-black">{day}</h3>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="border-1 border-color-primary rounded-xl overflow-hidden bg-[#F0F1F494]">
        <div className="flex flex-col divide-y-1 divide-black">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex divide-x-1 divide-black">
              {week.map((dayData, dayIndex) => (
                <div
                  key={dayIndex}
                  className="flex-1 min-h-64 bg-gradient-to-b from-blue-50 to-white p-4 flex flex-col items-center gap-3 overflow-y-auto"
                >
                  {dayData ? (
                    <>
                      <div className="text-sm font-semibold text-gray-600 mb-2">
                        {dayData.day}
                      </div>
                      {dayData.outfits.length > 0 ? (
                        <div className="flex flex-col items-center gap-3 w-full">
                          {dayData.outfits.map((outfit) => (
                            <div
                              key={outfit.id}
                              className="flex flex-col items-center justify-center w-full cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => setSelectedImage({ url: outfit.image_url, name: outfit.name })}
                            >
                              <img
                                src={outfit.image_url}
                                alt={outfit.name || 'Outfit'}
                                className="h-52 w-auto object-cover rounded"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center text-gray-300">
                          {/* Empty state */}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="h-full" />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      {currentMonthOutfits.length > 0 && (
        <div className="mt-4 text-center text-gray-600">
          <p className="text-sm">
            {currentMonthOutfits.length} outfit{currentMonthOutfits.length !== 1 ? 's' : ''} saved this month
          </p>
        </div>
      )}
      
      {/* Image Modal */}
      <ImageModal
        isOpen={selectedImage !== null}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage?.url || ''}
        imageName={selectedImage?.name || 'Outfit'}
      />
    </div>
  );
};

export default OutfitCalendar;
