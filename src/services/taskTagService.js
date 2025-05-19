import { initializeApperClient } from './authService';

const TABLE_NAME = 'task_tag1';

// Get ApperClient instance
const getClient = () => {
  return initializeApperClient();
};

// Create a task tag relationship
export const createTaskTag = async (taskId, tagId) => {
  try {
    const client = getClient();
    
    // Only include Updateable fields
    const params = {
      records: [{
        Name: `Task-${taskId}-Tag-${tagId}`,
        taskId: taskId,
        tagId: tagId
      }]
    };
    
    const response = await client.createRecord(TABLE_NAME, params);
    
    if (response && response.success && response.results && response.results[0] && response.results[0].success) {
      return response.results[0].data;
    }
    
    throw new Error("Failed to create task-tag relationship");
  } catch (error) {
    console.error("Error creating task-tag relationship:", error);
    throw error;
  }
};

// Get task tags
export const getTaskTags = async (taskId) => {
  try {
    const client = getClient();
    
    const params = {
      fields: ["Id", "taskId", "tagId"],
      where: [
        {
          fieldName: "taskId",
          operator: "ExactMatch",
          values: [taskId]
        }
      ]
    };
    
    const response = await client.fetchRecords(TABLE_NAME, params);
    
    if (!response || !response.data) {
      return [];
    }
    
    return response.data.map(taskTag => ({
      id: taskTag.Id,
      taskId: taskTag.taskId,
      tagId: taskTag.tagId
    }));
  } catch (error) {
    console.error(`Error fetching tags for task ${taskId}:`, error);
    throw error;
  }
};

// Delete task tag relationship
export const deleteTaskTag = async (taskTagId) => {
  try {
    const client = getClient();
    
    const params = {
      RecordIds: [taskTagId]
    };
    
    const response = await client.deleteRecord(TABLE_NAME, params);
    
    if (response && response.success) {
      return true;
    }
    
    throw new Error("Failed to delete task-tag relationship");
  } catch (error) {
    console.error("Error deleting task-tag relationship:", error);
    throw error;
  }
};