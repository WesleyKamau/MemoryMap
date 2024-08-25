import React from 'react';

function LeftButton({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-pink-400 hover:bg-pink-500 text-white font-semibold py-4 px-4 rounded-full text-xl transition duration-300 
      md:text-2xl  md:py-8 md:px-8 md:max-w-[50%] lg:text-5xl lg:max-w-[100%] text-center max-w-[25%]"
      style={{ position: 'fixed', bottom: '25px', left: '25px' }}
    >
      {text}
    </button>
  );
}

export default LeftButton;
