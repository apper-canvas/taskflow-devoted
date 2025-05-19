import { initializeApperClient } from './authService';

const TABLE_NAME = 'task31';

// Get ApperClient instance
const getClient = () => {
  return initializeApperClient();
};

// Fetch all tasks
export const fetchTasks = async () => {
  try {
    const client = getClient();
    
    const params = {
      fields: ["Id", "Name", "title", "description", "priority", "status", "dueDate", "completedAt", "projectId", "Tags", "CreatedOn", "ModifiedOn"],
      orderBy: [
        {
          field: "CreatedOn",
          direction: "DESC"
        }
      ]
    };
    
    const response = await client.fetchRecords(TABLE_NAME, params);
    
    if (!response || !response.data) {
      return [];
    }
    
    return response.data.map(task => ({
      id: task.Id,
      title: task.title || task.Name,
      description: task.description || '',
      priority: task.priority || 'medium',
      status: task.status || 'to-do',
      dueDate: task.dueDate || '',
      completedAt: task.completedAt || null,
      projectId: task.projectId || '',
      tags: task.Tags ? task.Tags.split(',') : [],
      createdAt: task.CreatedOn,
      updatedAt: task.ModifiedOn
    }));
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

// Create a new task
export const createTask = async (taskData) => {
  try {
    const client = getClient();
    
    // Only include Updateable fields
    const params = {
      records: [{
        Name: taskData.title,
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        status: taskData.status,
        dueDate: taskData.dueDate,
        completedAt: taskData.status === 'done' ? new Date().toISOString() : null,
        projectId: taskData.projectId,
        Tags: taskData.tags.join(',')
      }]
    };
    
    const response = await client.createRecord(TABLE_NAME, params);
    
    if (response && response.success && response.results && response.results[0] && response.results[0].success) {
      return response.results[0].data;
    }
    
    throw new Error("Failed to create task");
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

// Update an existing task
export const updateTask = async (taskId, taskData) => {
  try {
    const client = getClient();
    
    // Only include Updateable fields
    const params = {
      records: [{
        Id: taskId,
        Name: taskData.title,
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        status: taskData.status,
        dueDate: taskData.dueDate,
        completedAt: taskData.status === 'done' ? new Date().toISOString() : null,
        projectId: taskData.projectId,
        Tags: taskData.tags.join(',')
      }]
    };
    
    const response = await client.updateRecord(TABLE_NAME, params);
    
    if (response && response.success) {
      return response.results[0].data;
    }
    
    throw new Error("Failed to update task");
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (taskId) => {
  try {
    const client = getClient();
    
    const params = {
      RecordIds: [taskId]
    };
    
    const response = await client.deleteRecord(TABLE_NAME, params);
    
    if (response && response.success) {
      return true;
    }
    
    throw new Error("Failed to delete task");
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

// Update task status
export const updateTaskStatus = async (taskId, newStatus) => {
  try {
    const client = getClient();
    
    const params = {
      records: [{
        Id: taskId,
        status: newStatus,
        completedAt: newStatus === 'done' ? new Date().toISOString() : null
      }]
    };
    
    const response = await client.updateRecord(TABLE_NAME, params);
    
    if (response && response.success) {
      return response.results[0].data;
    }
    
    throw new Error("Failed to update task status");
  } catch (error) {
    console.error("Error updating task status:", error);
    throw error;
  }
};