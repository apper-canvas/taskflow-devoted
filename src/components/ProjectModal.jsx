import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import { createProject } from '../services/projectService';

const ProjectModal = ({ isOpen, onClose, onProjectCreated }) => {
  // Get icons
  const XIcon = getIcon('x');
  const FolderIcon = getIcon('folder');
  const CheckIcon = getIcon('check');
  const AlertCircleIcon = getIcon('alert-circle');

  // Initial form state
  const initialFormState = {
    name: '',
    description: '',
    color: '#3b82f6' // Default to primary color
  };

  // Form state
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Available colors for selection
  const availableColors = [
    '#3b82f6', // Primary blue
    '#10b981', // Green
    '#8b5cf6', // Purple
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#ec4899', // Pink
    '#6366f1', // Indigo
    '#14b8a6', // Teal
    '#f97316', // Orange
    '#8b5cf6'  // Violet
  ];

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Handle color selection
  const handleColorSelect = (color) => {
    setFormData({
      ...formData,
      color
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newProject = await createProject(formData);
      
      toast.success(`Project "${formData.name}" created successfully`);
      
      // Reset form
      setFormData(initialFormState);
      setErrors({});
      
      // Notify parent component and close modal
      onProjectCreated(newProject);
      onClose();
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If not open, don't render anything
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-surface-800 rounded-xl p-6 w-full max-w-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FolderIcon className="w-5 h-5" />
            Create New Project
          </h2>
          <button
            className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
            onClick={onClose}
            aria-label="Close"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="project-name" className="block text-sm font-medium">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              id="project-name"
              type="text"
              name="name"
              className={`input ${errors.name ? 'border-red-500 dark:border-red-500' : ''}`}
              placeholder="Enter project name"
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                <AlertCircleIcon className="w-4 h-4" />
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="project-description" className="block text-sm font-medium">
              Description
            </label>
            <textarea
              id="project-description"
              name="description"
              className="input min-h-[100px]"
              placeholder="Enter project description (optional)"
              value={formData.description}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Project Color</label>
            <div className="flex flex-wrap gap-2">
              {availableColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${formData.color === color ? 'border-surface-600 dark:border-surface-300' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorSelect(color)}
                  aria-label={`Select color ${color}`}
                >
                  {formData.color === color && <CheckIcon className="w-4 h-4 text-white" />}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-surface-200 dark:border-surface-700">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={isSubmitting}>Cancel</button>
            <button type="submit" className="btn btn-primary flex items-center gap-2" disabled={isSubmitting}>
              {isSubmitting && <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>}
              Create Project
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ProjectModal;