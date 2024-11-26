import React, { useState } from 'react';
import '../scss/file.scss'

const FileUpload = ({ onFileChange }) => {
  const [fileName, setFileName] = useState('No file chosen');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileName(file ? file.name : 'No file chosen');
    onFileChange(file);  // Pass the file to the parent component
  };

  return (
    <div className="file-upload-container">
      <label className="file-upload">
        <input type="file" onChange={handleFileChange} />
        <span className="file-upload-button">Choose File</span>
        <span className="file-name">{fileName}</span>
      </label>
    </div>
  );
};

export default FileUpload;
