import React from 'react';

const CustomizationStep = ({ setLoadingMessage, setCreator, vanta, setVanta }) => {
  return (
    <div className="step step-3">
      <h1 className="text-sm md:text-xl lg:text-2xl text-white font-bold mb-3">Customize Loading Screen</h1>
      <div className="mb-3">
        <label className="block text-gray-300 font-semibold mb-2">Your Name</label>
        <input
          type="text"
          onChange={(e) => setCreator(e.target.value)}
          className="w-full px-3 md:py-2 border rounded-lg"
        />
      </div>
      <div className="mb-3">
        <label className="block text-gray-300 font-semibold mb-2">Loading Screen Message</label>
        <input
          type="text"
          onChange={(e) => setLoadingMessage(e.target.value)}
          className="w-full px-3 md:py-2 border rounded-lg"
        />
      </div>
      <div className="mb-3">
        <label className="block text-gray-300 font-semibold mb-2">Background Highlight Color</label>
        <input
          type="color"
          value={vanta[0]}
          onChange={(e) => setVanta([e.target.value,vanta[1],vanta[2]])}
          className="w-full lg:h-10 h-8 px-3 py-2 border rounded-lg"
        />
      </div>
      <div className="mb-3">
        <label className="block text-gray-300 font-semibold mb-2">Background Midtone Color</label>
        <input
          type="color"
          value={vanta[1]}
          onChange={(e) => setVanta([vanta[0],e.target.value,vanta[2]])}
          className="w-full lg:h-10 h-8 px-3 py-2 border rounded-lg"
        />
      </div>
      <div className="mb-3">
        <label className="block text-gray-300 font-semibold mb-2">Background Lowlight Color</label>
        <input
          type="color"
          value={vanta[2]}
          onChange={(e) => setVanta([vanta[0],vanta[1],e.target.value])}
          className="w-full lg:h-10 h-8 px-3 py-2 border rounded-lg"
        />
      </div>
    </div>
  );
};

export default CustomizationStep;
