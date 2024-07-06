import React from 'react';

const ImageView = ({ image, isVisible }) => {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', zIndex: '0', display: isVisible ? 'flex' : 'none', justifyContent: 'center', alignItems: 'center' }}>
      <div className='h-5/6 w-5/6 rounded-lg flex justify-center items-center'>
        <img src={image} alt="Image" className="object-scale-down h-full w-full" />
      </div>
    </div>
  );
};

export default ImageView;
