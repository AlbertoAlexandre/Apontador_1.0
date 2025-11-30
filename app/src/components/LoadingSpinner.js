import React from 'react';

function LoadingSpinner({ message = "Carregando..." }) {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="mt-3 text-muted">{message}</p>
    </div>
  );
}

export default LoadingSpinner;