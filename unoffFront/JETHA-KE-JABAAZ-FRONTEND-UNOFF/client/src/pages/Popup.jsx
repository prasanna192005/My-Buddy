import React, { useState, useEffect } from 'react';

const AutoClosePopup = ({ 
  message, 
  isVisible, 
  onClose, 
  showAgain, 
  duration = 30000 // Default 30 seconds
}) => {
  const [isPopupVisible, setIsPopupVisible] = useState(isVisible);
  const [popupTimeout, setPopupTimeout] = useState(null);

  useEffect(() => {
    if (isPopupVisible) {
      const timeout = setTimeout(() => {
        setIsPopupVisible(false);
        onClose();
      }, duration);
      setPopupTimeout(timeout);

      return () => {
        clearTimeout(timeout); // Cleanup on unmount or change
      };
    }
  }, [isPopupVisible, duration, onClose]);

  const handleClose = () => {
    setIsPopupVisible(false);
    if (popupTimeout) {
      clearTimeout(popupTimeout);
    }
    onClose();
  };

  return (
    <>
      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="w-96 p-6 bg-white border border-gray-300 shadow-lg rounded-lg relative">
            <h3 className="text-lg font-semibold">Study Material Dost</h3>
            <p className="mt-2 text-gray-600">{message}</p>
            <button 
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {!isPopupVisible && (
        <div className="flex justify-center mt-8">
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={showAgain}
          >
            Show Info Again
          </button>
        </div>
      )}
    </>
  );
};

export default AutoClosePopup;
