import React from 'react';

const ContinueButton = ({ onClick }) => {
  return (
    <button
      className="fixed bottom-4 left-0 right-0 bg-blue-500 text-white rounded-full py-4 px-6 mx-auto bg-pink-400 hover:bg-pink-500 text-white font-semibold py-5 px-5 rounded-full text-7xl max-w-[65%]"
      onClick={onClick}
    >
      Continue
    </button>
  );
};

export default ContinueButton;
