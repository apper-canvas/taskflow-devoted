import { initializeApperClient } from './authService';

const TABLE_NAME = 'project9';

// Get ApperClient instance
const getClient = () => {
  return initializeApperClient();
};

// Fetch all projects
export const fetchProjects = async () => {
  try {
    const client = getClient();
    
    const params = {
      fields: ["Id", "Name", "description", "color", "CreatedOn", "ModifiedOn"],
      orderBy: [
        {
          field: "Name",
          direction: "ASC"
        }
      ]
    };
    
    const response = await client.fetchRecords(TABLE_NAME, params);
    
    if (!response || !response.data) {
      return [];
    }
    
    return response.data.map(project => ({
      id: project.Id,
      name: project.Name,
      description: project.description || '',
      color: project.color || '#3b82f6',
      createdAt: project.CreatedOn,
      updatedAt: project.ModifiedOn
    }));
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

// Create a new project
export const createProject = async (projectData) => {
  try {
    const client = getClient();
    
    // Only include Updateable fields
    const params = {
      records: [{
        Name: projectData.name,
        description: projectData.description,
        color: projectData.color
      }]
    };
    
    const response = await client.createRecord(TABLE_NAME, params);
    
    if (response && response.success && response.results && response.results[0] && response.results[0].success) {
      return response.results[0].data;
    }
    
    throw new Error("Failed to create project");
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

// Get project by ID
export const getProjectById = async (projectId) => {
  try {
    const client = getClient();
    const response = await client.getRecordById(TABLE_NAME, projectId);
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching project with ID ${projectId}:`, error);
    return null;
  }
};