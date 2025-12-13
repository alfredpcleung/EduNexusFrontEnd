import { useState } from 'react';

/**
 * Custom hook to handle 403 Forbidden errors with toast notification
 * @returns {object} - { error, showError, handleError, clearError, open }
 */
export const use403Handler = () => {
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  const handleError = (errorMessage = 'You are not authorized to perform this action') => {
    console.error('Authorization Error (403):', errorMessage);
    setError(errorMessage);
    setOpen(true);
  };

  const clearError = () => {
    setOpen(false);
    setError('');
  };

  return {
    error,
    open,
    handleError,
    clearError,
  };
};

export default use403Handler;
