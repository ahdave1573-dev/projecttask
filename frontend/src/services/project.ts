import { makeApiCall } from '@/src/config/apiconfig';

export const projectService = {
  getAllProjects: async () => {
    return await makeApiCall('GET', '/projects');
  },
  
  getProjectById: async (id: string | number) => {
    return await makeApiCall('GET', `/projects/${id}`);
  },
  
  createProject: async (projectData: any) => {
    return await makeApiCall('POST', '/projects', projectData);
  },
  
  updateProject: async (id: string | number, projectData: any) => {
    return await makeApiCall('PUT', `/projects/${id}`, projectData);
  },
  
  deleteProject: async (id: string | number) => {
    return await makeApiCall('DELETE', `/projects/${id}`);
  }
};
