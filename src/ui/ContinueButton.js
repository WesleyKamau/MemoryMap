import React from 'react';

const ContinueButton = ({ onClick, colors }) => {
  return (
    <button
      className="fixed bottom-4 left-0 right-0  text-white rounded-full py-4 px-6 mx-auto  text-white font-semibold py-5 px-5 rounded-full lg:text-7xl text-3xl max-w-[65%] "
      onClick={onClick}
      style={{ backgroundColor: `${colors[0].toString(16)}` }}
    >
      Continue
    </button>
  );
};

export default ContinueButton;
