import React from 'react';
import { Link } from 'react-router-dom';
import { getIcon } from '../utils/iconUtils';

const NotFound = () => {
  const AlertIcon = getIcon('alert-circle');
  const ArrowLeftIcon = getIcon('arrow-up-down');

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900 p-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
          <AlertIcon className="w-12 h-12 text-red-500" />
        </div>
        
        <h1 className="text-4xl font-bold mb-4 text-surface-800 dark:text-surface-100">404</h1>
        <h2 className="text-2xl font-semibold mb-4 text-surface-700 dark:text-surface-200">Page Not Found</h2>
        <p className="mb-8 text-surface-600 dark:text-surface-400">The page you are looking for doesn't exist or has been moved.</p>
        
        <Link to="/" className="btn btn-primary inline-flex items-center">
          <ArrowLeftIcon className="w-5 h-5 mr-2" /> Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;