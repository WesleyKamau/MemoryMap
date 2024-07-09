import React from 'react';
import CopyText from '../ui/CopyText';


const CopyLinkStep = ({ data }) => {
  // Implement component logic here
  const generateLink = () => {
    return `http://wesleykamau.com/memorymap/?custom=${data}`;
  };

  return (
    <div className='flex flex-col items-center justify-center'>
      <p className='text-white text-lg md:text-2xl lg:text-4xl mb-4'>Share the link with your friends!</p>
      <CopyText text={generateLink()} />
    </div>
  );
};

export default CopyLinkStep;
