import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { getIcon } from '../utils/iconUtils';

const MainFeature = ({ onTasksChange }) => {
  // State for tasks list and current task
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'to-do',
    dueDate: '',
    projectId: '',
    tags: []
  });

  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [availableTags, setAvailableTags] = useState([
    { id: '1', name: 'Work', color: '#3b82f6' },
    { id: '2', name: 'Personal', color: '#8b5cf6' },
    { id: '3', name: 'Important', color: '#ef4444' },
    { id: '4', name: 'Learning', color: '#10b981' }
  ]);
  const [availableProjects, setAvailableProjects] = useState([
    { id: '1', name: 'General', description: 'Default project', color: '#3b82f6' },
    { id: '2', name: 'Website Redesign', description: 'Redesign company website', color: '#8b5cf6' },
    { id: '3', name: 'Mobile App', description: 'New mobile application', color: '#10b981' }
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTagInput, setNewTagInput] = useState('');
  const [board, setBoard] = useState({
    'to-do': [],
    'in-progress': [],
    'done': []
  });

  // Icon components
  const PlusIcon = getIcon('plus');
  const SearchIcon = getIcon('search');
  const CheckIcon = getIcon('check');
  const EditIcon = getIcon('edit');
  const TrashIcon = getIcon('trash-2');
  const CalendarIcon = getIcon('calendar');
  const TagIcon = getIcon('tag');
  const FolderIcon = getIcon('folder');
  const FlagIcon = getIcon('flag');
  const AlertCircleIcon = getIcon('alert-circle');
  const XIcon = getIcon('x');
  const ListTodoIcon = getIcon('list-todo');
  const ClockIcon = getIcon('clock');
  const CheckSquareIcon = getIcon('check-square');
  const PlusCircleIcon = getIcon('plus-circle');
  const ArrowUpDown = getIcon('arrow-up-down');

  // Initialize board when tasks change
  useEffect(() => {
    // Save to local storage
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    // Organize tasks into board columns
    const newBoard = {
      'to-do': tasks.filter(task => task.status === 'to-do'),
      'in-progress': tasks.filter(task => task.status === 'in-progress'),
      'done': tasks.filter(task => task.status === 'done')
    };
    
    setBoard(newBoard);
    
    // Notify parent component of tasks change
    if (onTasksChange) {
      onTasksChange(tasks);
    }
  }, [tasks]);

  // Reset form
  const resetForm = () => {
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      status: 'to-do',
      dueDate: '',
      projectId: '',
      tags: []
    });
    setEditingTaskId(null);
  };

  // Create or update task
  const handleSubmitTask = (e) => {
    e.preventDefault();
    
    if (!newTask.title.trim()) {
      toast.error("Task title is required");
      return;
    }
    
    if (editingTaskId) {
      // Update existing task
      const updatedTasks = tasks.map(task => 
        task.id === editingTaskId ? { ...task, ...newTask } : task
      );
      setTasks(updatedTasks);
      toast.success("Task updated successfully");
    } else {
      // Create new task
      const task = {
        ...newTask,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setTasks([...tasks, task]);
      toast.success("Task created successfully");
    }
    
    resetForm();
    setShowForm(false);
  };

  // Edit task
  const handleEditTask = (id) => {
    const taskToEdit = tasks.find(task => task.id === id);
    if (taskToEdit) {
      setNewTask({ ...taskToEdit });
      setEditingTaskId(id);
      setShowForm(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Delete task
  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast.success("Task deleted successfully");
    if (selectedTask?.id === id) {
      setSelectedTask(null);
      setIsModalOpen(false);
    }
  };

  // Change task status
  const handleStatusChange = (taskId, newStatus) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return { 
          ...task, 
          status: newStatus,
          updatedAt: new Date().toISOString(),
          completedAt: newStatus === 'done' ? new Date().toISOString() : null
        };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    toast.info(`Task moved to ${newStatus.replace('-', ' ')}`);
  };

  // Handle drag start
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Handle drop
  const handleDrop = (e, dropStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    
    if (taskId) {
      handleStatusChange(taskId, dropStatus);
    }
  };

  // Open task details modal
  const openTaskDetails = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  // Close task details modal
  const closeTaskDetails = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  // Handle adding a tag to task
  const handleAddTagToTask = (tagId) => {
    if (!newTask.tags.includes(tagId)) {
      setNewTask({
        ...newTask,
        tags: [...newTask.tags, tagId]
      });
    } else {
      setNewTask({
        ...newTask,
        tags: newTask.tags.filter(id => id !== tagId)
      });
    }
  };

  // Add a new tag
  const handleAddNewTag = () => {
    if (newTagInput.trim()) {
      const randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
      const newTag = {
        id: crypto.randomUUID(),
        name: newTagInput.trim(),
        color: randomColor
      };
      
      setAvailableTags([...availableTags, newTag]);
      setNewTagInput('');
      
      // Add to current task if editing/creating
      if (showForm) {
        setNewTask({
          ...newTask,
          tags: [...newTask.tags, newTag.id]
        });
      }
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    // Filter by status
    if (filterStatus !== 'all' && task.status !== filterStatus) {
      return false;
    }
    
    // Filter by priority
    if (filterPriority !== 'all' && task.priority !== filterPriority) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  // Get tag by ID
  const getTagById = (id) => availableTags.find(tag => tag.id === id);

  // Get project by ID
  const getProjectById = (id) => availableProjects.find(project => project.id === id);

  // Priority color class mapping
  const priorityColorClass = {
    low: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    medium: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    high: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
  };

  // Format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      return format(new Date(dateString), 'PP');
    } catch (error) {
      return dateString;
    }
  };

  // Kanban board columns config
  const kanbanColumns = [
    { id: 'to-do', title: 'To Do', icon: ListTodoIcon, color: 'border-blue-500' },
    { id: 'in-progress', title: 'In Progress', icon: ClockIcon, color: 'border-yellow-500' },
    { id: 'done', title: 'Done', icon: CheckSquareIcon, color: 'border-green-500' }
  ];

  return (
    <div className="space-y-8">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        <div>
          <h2 className="text-2xl font-bold">Task Management Board</h2>
          <p className="text-surface-600 dark:text-surface-400">
            Organize and track your tasks efficiently
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-surface-400" />
            </div>
            <input
              type="text"
              className="input pl-10"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary flex items-center gap-2"
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
          >
            {showForm ? (
              <>
                <XIcon className="w-5 h-5" />
                <span>Cancel</span>
              </>
            ) : (
              <>
                <PlusIcon className="w-5 h-5" />
                <span>Add Task</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
      
      {/* Task Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="card p-6">
              <h3 className="text-xl font-bold mb-4">
                {editingTaskId ? 'Edit Task' : 'Create New Task'}
              </h3>
              
              <form onSubmit={handleSubmitTask} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="Enter task title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Due Date</label>
                    <input
                      type="date"
                      className="input"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Description</label>
                  <textarea
                    className="input min-h-[80px]"
                    placeholder="Enter task description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Priority</label>
                    <select
                      className="input"
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Status</label>
                    <select
                      className="input"
                      value={newTask.status}
                      onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                    >
                      <option value="to-do">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Project</label>
                    <select
                      className="input"
                      value={newTask.projectId}
                      onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })}
                    >
                      <option value="">None</option>
                      {availableProjects.map(project => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {availableTags.map(tag => (
                      <button
                        key={tag.id}
                        type="button"
                        className={`task-tag flex items-center gap-1`}
                        style={{
                          backgroundColor: `${tag.color}20`,
                          color: tag.color,
                          border: newTask.tags.includes(tag.id)
                            ? `2px solid ${tag.color}`
                            : `1px solid ${tag.color}50`
                        }}
                        onClick={() => handleAddTagToTask(tag.id)}
                      >
                        <TagIcon className="w-3 h-3" />
                        <span>{tag.name}</span>
                        {newTask.tags.includes(tag.id) && (
                          <CheckIcon className="w-3 h-3" />
                        )}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex">
                    <input
                      type="text"
                      className="input rounded-r-none"
                      placeholder="Add new tag"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-secondary rounded-l-none px-3"
                      onClick={handleAddNewTag}
                    >
                      <PlusIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => {
                      resetForm();
                      setShowForm(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    {editingTaskId ? 'Update Task' : 'Create Task'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="space-y-1 flex-1">
          <label className="block text-sm font-medium">Filter by Status</label>
          <select
            className="input"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="to-do">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        
        <div className="space-y-1 flex-1">
          <label className="block text-sm font-medium">Filter by Priority</label>
          <select
            className="input"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
      
      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {kanbanColumns.map(column => (
          <div 
            key={column.id}
            className={`card p-4 border-t-4 ${column.color}`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="flex items-center gap-2 mb-4">
              <column.icon className="w-5 h-5" />
              <h3 className="font-semibold">{column.title}</h3>
              <span className="ml-auto text-sm px-2 py-1 bg-surface-100 dark:bg-surface-800 rounded-full">
                {board[column.id].length}
              </span>
            </div>
            
            <div className="min-h-[200px] space-y-3">
              {board[column.id].length === 0 ? (
                <div className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-surface-200 dark:border-surface-700 rounded-lg">
                  <p className="text-surface-500 dark:text-surface-400 text-sm">No tasks here</p>
                  <button 
                    className="mt-2 text-primary text-sm flex items-center gap-1"
                    onClick={() => {
                      resetForm();
                      setNewTask({ ...newTask, status: column.id });
                      setShowForm(true);
                    }}
                  >
                    <PlusCircleIcon className="w-4 h-4" />
                    <span>Add a task</span>
                  </button>
                </div>
              ) : (
                board[column.id]
                  .filter(task => {
                    if (searchQuery) {
                      const query = searchQuery.toLowerCase();
                      return (
                        task.title.toLowerCase().includes(query) ||
                        task.description.toLowerCase().includes(query)
                      );
                    }
                    if (filterPriority !== 'all' && task.priority !== filterPriority) {
                      return false;
                    }
                    return true;
                  })
                  .map(task => (
                    <motion.div
                      key={task.id}
                      className="task-card"
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onClick={() => openTaskDetails(task)}
                      whileHover={{ y: -2 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium truncate mr-2">{task.title}</h4>
                        <div className={`task-tag ${priorityColorClass[task.priority]}`}>
                          <FlagIcon className="w-3 h-3 mr-1" />
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </div>
                      </div>
                      
                      {task.description && (
                        <p className="text-sm text-surface-600 dark:text-surface-400 line-clamp-2 mb-2">
                          {task.description}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-1 mb-2">
                        {task.tags.map(tagId => {
                          const tag = getTagById(tagId);
                          if (!tag) return null;
                          return (
                            <span
                              key={tagId}
                              className="task-tag text-xs"
                              style={{
                                backgroundColor: `${tag.color}20`,
                                color: tag.color,
                                border: `1px solid ${tag.color}50`
                              }}
                            >
                              {tag.name}
                            </span>
                          );
                        })}
                      </div>
                      
                      <div className="flex justify-between items-center text-xs text-surface-500 dark:text-surface-400">
                        {task.projectId && getProjectById(task.projectId) && (
                          <div className="flex items-center gap-1">
                            <FolderIcon className="w-3 h-3" />
                            <span>{getProjectById(task.projectId)?.name}</span>
                          </div>
                        )}
                        
                        {task.dueDate && (
                          <div className="flex items-center gap-1 ml-auto">
                            <CalendarIcon className="w-3 h-3" />
                            <span>{formatDate(task.dueDate)}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Task Detail Modal */}
      {isModalOpen && selectedTask && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeTaskDetails}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-surface-800 rounded-xl p-6 w-full max-w-2xl shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold truncate mr-4">{selectedTask.title}</h3>
                <div className="flex items-center gap-2 mt-1 text-sm text-surface-500 dark:text-surface-400">
                  {selectedTask.projectId && getProjectById(selectedTask.projectId) && (
                    <div className="flex items-center gap-1">
                      <FolderIcon className="w-4 h-4" />
                      <span>{getProjectById(selectedTask.projectId)?.name}</span>
                    </div>
                  )}
                  
                  <div className={`task-tag ${priorityColorClass[selectedTask.priority]}`}>
                    <FlagIcon className="w-3 h-3 mr-1" />
                    {selectedTask.priority.charAt(0).toUpperCase() + selectedTask.priority.slice(1)}
                  </div>
                </div>
              </div>
              
              <button
                className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
                onClick={closeTaskDetails}
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="border-b dark:border-surface-700 mb-4 pb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-surface-500 dark:text-surface-400 mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    {selectedTask.status === 'to-do' && <ListTodoIcon className="w-4 h-4 text-blue-500" />}
                    {selectedTask.status === 'in-progress' && <ClockIcon className="w-4 h-4 text-yellow-500" />}
                    {selectedTask.status === 'done' && <CheckSquareIcon className="w-4 h-4 text-green-500" />}
                    <span className="capitalize">{selectedTask.status.replace('-', ' ')}</span>
                  </div>
                </div>
                
                {selectedTask.dueDate && (
                  <div>
                    <p className="text-sm text-surface-500 dark:text-surface-400 mb-1">Due Date</p>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{formatDate(selectedTask.dueDate)}</span>
                      
                      {selectedTask.status !== 'done' && new Date(selectedTask.dueDate) < new Date() && (
                        <span className="text-xs text-red-500 flex items-center gap-1">
                          <AlertCircleIcon className="w-3 h-3" /> Overdue
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-surface-500 dark:text-surface-400 mb-1">Description</p>
                <p className="bg-surface-50 dark:bg-surface-900 p-3 rounded-lg">
                  {selectedTask.description || "No description provided."}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-surface-500 dark:text-surface-400 mb-1">Tags</p>
                {selectedTask.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedTask.tags.map(tagId => {
                      const tag = getTagById(tagId);
                      if (!tag) return null;
                      return (
                        <span
                          key={tagId}
                          className="task-tag"
                          style={{
                            backgroundColor: `${tag.color}20`,
                            color: tag.color,
                            border: `1px solid ${tag.color}50`
                          }}
                        >
                          <TagIcon className="w-3 h-3 mr-1" />
                          {tag.name}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-surface-500 dark:text-surface-400 italic">No tags</p>
                )}
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-surface-500 dark:text-surface-400 mb-1">Change Status</p>
              <div className="flex flex-wrap gap-2">
                {kanbanColumns.map(column => (
                  <button
                    key={column.id}
                    className={`btn ${
                      selectedTask.status === column.id
                        ? 'btn-primary'
                        : 'btn-outline'
                    } text-sm py-1.5`}
                    onClick={() => {
                      handleStatusChange(selectedTask.id, column.id);
                      setSelectedTask({ ...selectedTask, status: column.id });
                    }}
                    disabled={selectedTask.status === column.id}
                  >
                    <column.icon className="w-4 h-4 mr-1" />
                    {column.title}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between border-t dark:border-surface-700 pt-4">
              <div className="text-xs text-surface-500 dark:text-surface-400">
                <p>Created: {formatDate(selectedTask.createdAt)}</p>
                {selectedTask.status === 'done' && selectedTask.completedAt && (
                  <p>Completed: {formatDate(selectedTask.completedAt)}</p>
                )}
              </div>
              
              <div className="flex gap-2">
                <button
                  className="btn btn-outline text-sm flex items-center gap-1"
                  onClick={() => {
                    closeTaskDetails();
                    handleEditTask(selectedTask.id);
                  }}
                >
                  <EditIcon className="w-4 h-4" />
                  Edit
                </button>
                <button
                  className="btn text-sm bg-red-500 hover:bg-red-600 text-white flex items-center gap-1"
                  onClick={() => {
                    closeTaskDetails();
                    handleDeleteTask(selectedTask.id);
                  }}
                >
                  <TrashIcon className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      
      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-20 h-20 mb-4 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center">
            <ListTodoIcon className="w-10 h-10 text-surface-400" />
          </div>
          <h3 className="text-xl font-bold mb-2">No tasks found</h3>
          <p className="text-surface-600 dark:text-surface-400 max-w-md mb-6">
            {searchQuery 
              ? `No tasks matching "${searchQuery}" with the current filters.` 
              : "You don't have any tasks that match the current filters."}
          </p>
          <button
            className="btn btn-primary flex items-center gap-2"
            onClick={() => {
              if (searchQuery || filterStatus !== 'all' || filterPriority !== 'all') {
                setSearchQuery('');
                setFilterStatus('all');
                setFilterPriority('all');
              } else {
                resetForm();
                setShowForm(true);
              }
            }}
          >
            {searchQuery || filterStatus !== 'all' || filterPriority !== 'all' ? (
              <>
                <ArrowUpDown className="w-5 h-5" />
                <span>Clear Filters</span>
              </>
            ) : (
              <>
                <PlusIcon className="w-5 h-5" />
                <span>Create Your First Task</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default MainFeature;