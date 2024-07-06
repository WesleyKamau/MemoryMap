import React from 'react';

const CustomizationStep = ({ setLoadingMessage, setCreator, vantaHighlight, setVantaHighlight, vantaMidtone, setVantaMidtone, vantaLowlight, setVantaLowlight, handleCreateGame }) => {
  return (
    <div className="step step-3">
      <h1 className="text-3xl font-bold mb-6">Customize Loading Screen</h1>
      <div className="mb-6">
        <label className="block text-gray-300 font-semibold mb-2">Your Name</label>
        <input
          type="text"
          onChange={(e) => setCreator(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-300 font-semibold mb-2">Loading Screen Message</label>
        <input
          type="text"
          onChange={(e) => setLoadingMessage(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-300 font-semibold mb-2">Vanta Highlight Color</label>
        <input
          type="color"
          value={vantaHighlight}
          onChange={(e) => setVantaHighlight(e.target.value)}
          className="w-full h-10 px-3 py-2 border rounded-lg"
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-300 font-semibold mb-2">Vanta Midtone Color</label>
        <input
          type="color"
          value={vantaMidtone}
          onChange={(e) => setVantaMidtone(e.target.value)}
          className="w-full h-10 px-3 py-2 border rounded-lg"
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-300 font-semibold mb-2">Vanta Lowlight Color</label>
        <input
          type="color"
          value={vantaLowlight}
          onChange={(e) => setVantaLowlight(e.target.value)}
          className="w-full h-10 px-3 py-2 border rounded-lg"
        />
      </div>
      <button
        onClick={handleCreateGame}
        className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300"
      >
        Create Game
      </button>
    </div>
  );
};

export default CustomizationStep;
