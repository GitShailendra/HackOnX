import React, { useState, useEffect, useRef } from 'react';

const RatingSlider = ({ criterion, value, onChange }) => {
  const [sliderValue, setSliderValue] = useState(value);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);

  useEffect(() => {
    // Update local state if prop value changes
    setSliderValue(value);
  }, [value]);

  const handleChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    setSliderValue(newValue);
    onChange(newValue);
  };

  // Get color based on rating value
  const getRatingColor = (value) => {
    if (value === 0) return 'bg-transparent text-blue-300';
    if (value < 4) return 'bg-red-500 bg-opacity-20 text-red-500 border-red-500';
    if (value < 7) return 'bg-amber-500 bg-opacity-20 text-amber-500 border-amber-500';
    return 'bg-emerald-500 bg-opacity-20 text-emerald-500 border-emerald-500';
  };

  // Get label based on rating value
  const getRatingLabel = (value) => {
    if (value === 0) return 'Not Rated';
    if (value < 4) return 'Needs Improvement';
    if (value < 7) return 'Good';
    if (value < 9) return 'Excellent';
    return 'Outstanding';
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <h5 className="text-white font-medium">{criterion.name}</h5>
          <p className="text-blue-300 text-sm">{criterion.description}</p>
        </div>
        <div className={`min-w-[6rem] text-center py-1 px-3 rounded-full text-sm font-medium transition-colors duration-300 border border-opacity-30 ${
          sliderValue > 0 
            ? getRatingColor(sliderValue)
            : 'bg-blue-900 bg-opacity-30 text-blue-300 border-blue-700'
        }`}>
          {sliderValue > 0 ? `${sliderValue}/10` : 'Not Rated'}
        </div>
      </div>
      
      <div className="relative">
        <div className="h-2 bg-white bg-opacity-20 rounded-lg overflow-hidden">
          <div 
            className={`h-full ${
              sliderValue === 0 ? 'bg-transparent' :
              sliderValue < 4 ? 'bg-red-500' :
              sliderValue < 7 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${(sliderValue / 10) * 100}%` }}
          ></div>
        </div>
        
        <input
          ref={sliderRef}
          type="range"
          min="0"
          max="10"
          value={sliderValue}
          onChange={handleChange}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          className="absolute top-0 w-full h-2 opacity-0 cursor-pointer"
        />
        
        {/* Custom track ticks */}
        <div className="flex justify-between mt-1">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((tick) => (
            <div 
              key={tick} 
              className={`w-0.5 h-1.5 ${
                tick <= sliderValue && sliderValue > 0 
                  ? 'bg-blue-400' 
                  : 'bg-blue-700'
              }`}
            />
          ))}
        </div>
        
        {/* Value labels */}
        <div className="flex justify-between mt-1 text-xs text-blue-400">
          <span>0</span>
          <span className="absolute left-1/4 -translate-x-1/2">2.5</span>
          <span className="absolute left-1/2 -translate-x-1/2">5</span>
          <span className="absolute left-3/4 -translate-x-1/2">7.5</span>
          <span>10</span>
        </div>
        
        {/* Rating label tooltip */}
        {isDragging && sliderValue > 0 && (
          <div className="absolute top-0 transform -translate-y-10 text-sm font-medium bg-blue-900 px-3 py-1 rounded-md shadow-lg text-white animate-fade-in"
            style={{ left: `calc(${(sliderValue / 10) * 100}% - ${sliderValue * 1.2}px)` }}>
            {getRatingLabel(sliderValue)}
            <div className="absolute bottom-0 left-1/2 transform translate-y-1/2 -translate-x-1/2 rotate-45 w-2 h-2 bg-blue-900"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RatingSlider;