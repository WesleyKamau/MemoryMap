import React from 'react';

function Scoreboard({ score, level, totalLevels, positionClasses }) {
  return (
    <div className={`max-w-[35%] z-10 xl:text-6xl md:text-4xl sm:text-3xl text-2xl bg-pink-300 text-pink-800 font-semibold py-2 px-4 rounded-lg mt-4 text-center ${positionClasses}`}>
      Score: {score} <br/> 
      {level === totalLevels ? <>Level {level + 1} of {totalLevels}</> : <>Final Level</>}
    </div>
  );
}

export default Scoreboard;
