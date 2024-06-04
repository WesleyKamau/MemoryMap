import React from 'react';

const FileUploadStep = ({ handleFileChange }) => {
  const handleChange = (event) => {
    const files = Array.from(event.target.files);
    console.log('files:', files);
    handleFileChange(files);
  };

  return (
    <div className="step step-1">
      <h1 className="text-3xl font-bold text-white mb-6">Upload Images</h1>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleChange}
        className="file-input mb-4"
      />
    </div>
  );
};

export default FileUploadStep;
