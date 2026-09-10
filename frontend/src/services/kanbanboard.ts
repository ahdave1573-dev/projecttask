import { makeApiCall } from '@/src/config/apiconfig';

export const kanbanBoardService = {
    getBoardByProjectId: async (projectId: string | number) => {
        return await makeApiCall('GET', `/boards/${projectId}`);
    },

    createList: async (projectId: string | number, listData: any) => {
        return await makeApiCall('POST', `/lists`, { projectId, list: listData });
    },

    //edit
    updateList: async (projectId: string | number, listId: string | number, listData: any) => {
        return await makeApiCall('PUT', `/lists/${listId}`, listData);
    },

    //delete
    deleteList: async (projectId: string | number, listId: string | number) => {
        return await makeApiCall('DELETE', `/lists/${listId}`);
    },

    updateBoardState: async (projectId: string | number, boardData: any) => {
        return await makeApiCall('PUT', `/boards/${projectId}`, boardData);
    }
};
