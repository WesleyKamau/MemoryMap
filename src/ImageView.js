import React from 'react';

const ImageView = ({ image, isVisible }) => {
  return (
    <div className={`flex justify-center items-center h-full ${isVisible ? 'block' : 'hidden'}`}>
      <div className='object-scale-down h-5/6 w-5/6 rounded-lg flex justify-center items-center md:fixed md:bottom-15 xl:bottom-0'>
        <img src={image} alt="Location" className="object-scale-down md:h-5/6 md:w-5/6" />
      </div>
    </div>
  );
};

export default ImageView;
