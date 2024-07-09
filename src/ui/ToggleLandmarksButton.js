import React from 'react';

function ToggleLandmarksButton({ onClick, showLandmarks }) {
  return (
    <div className="fixed bottom-8 left-0 right-0 flex justify-center z-10">
      <button
        onClick={onClick}
        className="bg-pink-400 hover:bg-pink-500 text-white font-semibold py-4 px-4 rounded-full text-xl transition duration-300 
                md:text-2xl  md:py-8 md:px-8 md:max-w-[75%] lg:text-5xl lg:max-w-[100%] text-center max-w-[35%]"
        style={{ position: 'fixed', bottom: '25px' }}
      >
        {showLandmarks ? 'View Landmarks' : 'Hide Landmarks'}
      </button>
    </div>
  );
}

export default ToggleLandmarksButton;
