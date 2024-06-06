import React from 'react';

const CopyLinkStep = ({ data }) => {
  // Implement component logic here
  const generateLink = () => {
    return `wesleykamau.com/anniversary?custom=${data}`;
  };

  const handleCopyLink = () => {
    const link = generateLink();
    navigator.clipboard.writeText(link);
  };

  return (
    <div>
      <p>Instructions: Share the link with your friends.</p>
      <div>
        <input type="text" value={generateLink()} readOnly />
        <button onClick={handleCopyLink}>Copy Link</button>
      </div>
    </div>
  );
};

export default CopyLinkStep;
