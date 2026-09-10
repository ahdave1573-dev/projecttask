import { makeApiCall } from '@/src/config/apiconfig';

export const memberService = {
  getMembers: async (projectId: string | number) => {
    return await makeApiCall('GET', `/members/${projectId}`);
  },

  addMember: async (projectId: string | number, email: string) => {
    return await makeApiCall('POST', `/members/${projectId}`, { email });
  },

  removeMember: async (projectId: string | number, email: string) => {
    return await makeApiCall('DELETE', `/members/${projectId}/${encodeURIComponent(email)}`);
  }
};
