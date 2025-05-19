import { initializeApperClient } from './authService';

const TABLE_NAME = 'tag';

// Get ApperClient instance
const getClient = () => {
  return initializeApperClient();
};

// Fetch all tags
export const fetchTags = async () => {
  try {
    const client = getClient();
    
    const params = {
      fields: ["Id", "Name", "color", "CreatedOn", "ModifiedOn"],
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
    
    return response.data.map(tag => ({
      id: tag.Id,
      name: tag.Name,
      color: tag.color || '#3b82f6',
      createdAt: tag.CreatedOn,
      updatedAt: tag.ModifiedOn
    }));
  } catch (error) {
    console.error("Error fetching tags:", error);
    throw error;
  }
};

// Create a new tag
export const createTag = async (tagData) => {
  try {
    const client = getClient();
    
    // Only include Updateable fields
    const params = {
      records: [{
        Name: tagData.name,
        color: tagData.color
      }]
    };
    
    const response = await client.createRecord(TABLE_NAME, params);
    
    if (response && response.success && response.results && response.results[0] && response.results[0].success) {
      return {
        id: response.results[0].data.Id,
        name: response.results[0].data.Name,
        color: response.results[0].data.color || tagData.color
      };
    }
    
    throw new Error("Failed to create tag");
  } catch (error) {
    console.error("Error creating tag:", error);
    throw error;
  }
};

// Get tag by ID
export const getTagById = async (tagId) => {
  try {
    const client = getClient();
    const response = await client.getRecordById(TABLE_NAME, tagId);
    return response.data;
  } catch (error) {
    console.error(`Error fetching tag with ID ${tagId}:`, error);
    return null;
  }
};