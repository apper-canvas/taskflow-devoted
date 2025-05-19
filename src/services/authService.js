// Auth service with ApperSDK integration

// Get the current authenticated user
export const getCurrentUser = () => {
  const { ApperUI } = window.ApperSDK;
  return ApperUI.getCurrentUser();
};

// Logout function
export const logout = async () => {
  const { ApperUI } = window.ApperSDK;
  return await ApperUI.logout();
};

// Initialize ApperClient
export const initializeApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};