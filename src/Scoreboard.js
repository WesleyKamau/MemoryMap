import React from 'react';

function Scoreboard({ score, level, totalLevels }) {
  return (
    <div className="z-10 xl:text-6xl md:text-4xl sm:text-3xl text-2xl bg-pink-300 text-pink-800 font-semibold py-2 px-4 rounded-lg absolute top-0 left-1/2 transform -translate-x-1/2 mt-4 text-center ">
      Score: {score} <br/> Level {level+1} of {totalLevels}
    </div>
  );
}

export default Scoreboard;
