import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';

const NotFound = () => {
  const AlertTriangleIcon = getIcon('alert-triangle');
  const HomeIcon = getIcon('home');
  
  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="text-accent mb-6"
        initial={{ scale: 0.5 }}
        animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <AlertTriangleIcon size={80} />
      </motion.div>
      
      <motion.h1 
        className="text-4xl md:text-5xl font-bold mb-2 text-center"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        404 - Page Not Found
      </motion.h1>
      
      <motion.p 
        className="text-lg md:text-xl text-surface-600 dark:text-surface-400 mb-8 text-center max-w-lg"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        The page you're looking for doesn't exist or has been moved.
      </motion.p>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Link 
          to="/" 
          className="btn btn-primary flex items-center gap-2 neu-light"
        >
          <HomeIcon size={20} />
          <span>Back to Home</span>
        </Link>
      </motion.div>
      
      <motion.div 
        className="mt-12 w-full max-w-md p-6 card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        <h3 className="text-lg font-medium mb-4">Looking for something?</h3>
        <p className="text-surface-600 dark:text-surface-400 mb-4">
          You might find these links helpful:
        </p>
        <ul className="space-y-2">
          <li>
            <Link to="/" className="text-primary hover:underline flex items-center gap-2">
              <HomeIcon size={16} />
              <span>Home Page</span>
            </Link>
          </li>
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default NotFound;