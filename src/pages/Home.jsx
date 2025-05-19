import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { AuthContext } from '../App';
import MainFeature from '../components/MainFeature';
import { getIcon } from '../utils/iconUtils';
import { fetchTasks } from '../services/taskService';

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0
  });
  
  // Load data when component mounts
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        const tasks = await fetchTasks();
        
        // Calculate stats from fetched tasks
        const completed = tasks.filter(task => task.status === 'done').length;
        const total = tasks.length;
        const pending = tasks.filter(task => task.status === 'to-do').length;
        const overdue = tasks.filter(task => {
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          return dueDate < new Date() && task.status !== 'done';
        }).length;
        
        setStats({ total, completed, pending, overdue });
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading tasks:', error);
        toast.error('Failed to load task statistics');
        setIsLoading(false);
      }
    };
    
    if (isAuthenticated) {
      loadTasks();
    } else {
      setIsLoading(false);
    }
  }, []);

  const updateStats = (newTasks) => {
    const completed = newTasks.filter(task => task.status === 'done').length;
    const total = newTasks.length;
    const pending = newTasks.filter(task => task.status === 'to-do').length;
    const overdue = newTasks.filter(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate < new Date() && task.status !== 'done';
    }).length;
    
    setStats({ total, completed, pending, overdue });
    
    // Show toast for stats update
    if (total > 0) {
      toast.success(`Task stats updated: ${completed} completed of ${total} total tasks`);
    }
  };

  // Icon components
  const CheckCircleIcon = getIcon('check-circle');
  const ClockIcon = getIcon('clock');
  const AlertCircleIcon = getIcon('alert-circle');
  const ListIcon = getIcon('list');
  const LogOutIcon = getIcon('log-out');

  return (
    <div className="min-h-screen">
      <header className="py-6 md:py-8 px-4 md:px-8 border-b border-surface-200 dark:border-surface-800">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-primary flex items-center gap-2">
                <span className="bg-primary/10 rounded-lg p-2">
                  <CheckCircleIcon className="w-6 h-6 text-primary" />
                </span>
                TaskFlow
              </h1>
              <p className="text-surface-600 dark:text-surface-400 mt-1">
                Efficiently manage and organize your tasks
              </p>
            </div>
            
            {!isLoading && (
              <div className="flex flex-wrap items-center gap-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                  <button
                    onClick={logout}
                    className="btn btn-outline flex items-center gap-2 text-sm"
                    aria-label="Logout"
                  >
                    <LogOutIcon className="w-4 h-4" />
                    Logout
                  </button>
                </div>
                {[
                  { icon: ListIcon, label: 'Total', value: stats.total, color: 'bg-primary/10 text-primary' },
                  { icon: CheckCircleIcon, label: 'Completed', value: stats.completed, color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' },
                  { icon: ClockIcon, label: 'Pending', value: stats.pending, color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' },
                  { icon: AlertCircleIcon, label: 'Overdue', value: stats.overdue, color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="card p-3 md:p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <div className={`rounded-lg p-2 w-10 h-10 flex items-center justify-center mb-2 ${stat.color}`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <p className="text-xs md:text-sm text-surface-500 dark:text-surface-400">{stat.label}</p>
                    <p className="text-xl md:text-2xl font-bold">{stat.value}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4 md:px-8 md:py-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            <p className="mt-4 text-surface-600 dark:text-surface-400">Loading your tasks...</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MainFeature onTasksChange={updateStats} />
          </motion.div>
        )}
      </main>
      
      <footer className="mt-auto py-6 text-center text-sm text-surface-500 dark:text-surface-400 border-t border-surface-200 dark:border-surface-800">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} TaskFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;