import React from 'react';

const FileUploadStep = ({ handleFileChange, onNext }) => {
  const handleChange = (event) => {
    const files = Array.from(event.target.files);
    console.log('files:', files);
    handleFileChange(files);
  };


  return (
    <div className="flow-root">
      <div className="step step-1 ">
        <h1 className="text-3xl font-bold text-white mb-6">Upload Images</h1>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="file-input mb-4"
        />
      </div>
      {/* <button
      onClick={onNext}  className="float-right px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition duration-300 mt-4">
                      Next
                  </button> */}
    </div>
  );
};

export default FileUploadStep;
