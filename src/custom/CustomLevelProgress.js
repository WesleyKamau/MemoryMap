import React from 'react';
import ProgressBar from '../ProgressBar';

function CustomLevelProgress({ index, length, positionClasses }) {
  return (
    <div className={`max-w-[35%] z-10 xl:text-6xl md:text-4xl sm:text-3xl text-2xl bg-pink-300 text-pink-800 font-semibold py-4 px-4 rounded-lg mt-4 text-center ${positionClasses}`}>
      <ProgressBar step={2 + (index / length)}
      className="translate-y-1/2" />
      Image {index + 1} of {length}
    </div>
  );
}

export default CustomLevelProgress;
