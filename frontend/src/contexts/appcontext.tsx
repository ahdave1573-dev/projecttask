"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Socket } from 'socket.io-client';
import { useAuth } from './authcontext';
import { projectService } from '../services/project';
import { taskService } from '../services/task';
import { kanbanBoardService } from '../services/kanbanboard';
import { memberService } from '../services/member';
import { USE_BACKEND_API } from '../config/apiconfig';
import { useLoader } from './loadercontext';

export interface Project {
  id: string | number;
  name: string;
  description?: string;
  isActive: boolean;
  userEmail?: string;
  members?: string[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  priority?: 'Low' | 'Medium' | 'High';
  tags?: string[];
  date?: string;
  assignees?: string[];
}

export interface BoardList {
  id: string;
  title: string;
  tasks: Task[];
}

export interface BoardData {
  [projectId: string]: BoardList[];
}

interface AppContextType {
  projects: Project[];
  addProject: (name: string, description?: string) => void;
  setActiveProject: (id: string | number) => void;
  addMemberToProject: (projectId: string, email: string) => Promise<{ success: boolean; message?: string }>;
  removeMemberFromProject: (projectId: string, email: string) => Promise<{ success: boolean; message?: string }>;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  boardData: BoardData;
  activeProject?: Project;
  addList: (projectId: string, title: string) => void;
  updateList: (projectId: string, listId: string, title: string) => void;
  addTask: (projectId: string, listId: string, task: Task) => void;
  updateTask: (projectId: string, listId: string, taskId: string, updatedTask: Task) => void;
  deleteTask: (projectId: string, listId: string, taskId: string) => void;
  updateListTasks: (projectId: string, listId: string, tasks: Task[]) => void;
  updateListsOrder: (projectId: string, lists: BoardList[]) => void;
  deleteList: (projectId: string, listId: string) => void;
  deleteProject: (id: string | number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { showLoader } = useLoader();

  const [allProjects, setAllProjects] = useState<Project[]>(() => {
    if (typeof window !== 'undefined' && !USE_BACKEND_API) {
      try {
        const storedProjects = localStorage.getItem('projectsData');
        if (storedProjects) return JSON.parse(storedProjects);
      } catch (e) {
        console.error("Error parsing projectsData", e);
      }
    }
    return [];
  });

  const [boardData, setBoardData] = useState<BoardData>(() => {
    if (typeof window !== 'undefined' && !USE_BACKEND_API) {
      try {
        const storedBoard = localStorage.getItem('boardData');
        if (storedBoard) return JSON.parse(storedBoard);
      } catch (e) {
        console.error("Error parsing boardData", e);
      }
    }
    return {};
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // --- CROSS-TAB SYNC (Local Mode Live Updates) ---
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      // Instantly update state if another tab modifies localStorage
      if (e.key === 'boardData' && e.newValue) {
        try {
          setBoardData(JSON.parse(e.newValue));
        } catch (err) {
          console.error('Error syncing boardData', err);
        }
      }
      if (e.key === 'projectsData' && e.newValue) {
        try {
          setAllProjects(JSON.parse(e.newValue));
        } catch (err) {
          console.error('Error syncing projectsData', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // --- FUTURE BACKEND SOCKET.IO SETUP ---
  useEffect(() => {
    if (isMounted && USE_BACKEND_API) {
      // Connect to your future backend URL
      // const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000');
      // setSocket(newSocket);
      // return () => { newSocket.close(); };
    }
  }, [isMounted]);

  useEffect(() => {
    if (isMounted && !USE_BACKEND_API) {
      localStorage.setItem('projectsData', JSON.stringify(allProjects));
    }
  }, [allProjects, isMounted]);

  useEffect(() => {
    if (isMounted && !USE_BACKEND_API) {
      // Debounce saving to localStorage to improve performance
      const timeoutId = setTimeout(() => {
        try {
          localStorage.setItem('boardData', JSON.stringify(boardData));
        } catch (e) {
          console.error("Error saving boardData to localStorage. Quota might be exceeded.", e);
        }
      }, 1000); // 1 second delay

      return () => clearTimeout(timeoutId); // Cleanup if data changes before 1 second
    }
  }, [boardData, isMounted]);

  // Helper to remove duplicated API code
  const executeApi = async (apiCall: Promise<any>, errorMsg: string) => {
    if (!USE_BACKEND_API) return;
    try {
      const res = await apiCall;
      if (!res.data) console.error(errorMsg);
    } catch (error) {
      console.error(errorMsg, error);
    }
  };

  // Fetch projects from API
  useEffect(() => {
    if (isMounted && USE_BACKEND_API && user?.email) {
      projectService.getAllProjects().then(res => {
        if (res.data && Array.isArray(res.data)) {
          setAllProjects(prevProjects => {
            const activeProjectId = prevProjects.find(p => p.isActive)?.id;
            return res.data.map((p: Project) => ({
              ...p,
              isActive: p.id === activeProjectId
            }));
          });
        }
        else if (res.message) console.error(`Error loading projects: ${res.message}`);
      });
    }
  }, [isMounted, user?.email]);

  // Fetch board data for all projects so sidebar task count badges and dashboard stats are accurate immediately
  useEffect(() => {
    if (isMounted && USE_BACKEND_API && allProjects.length > 0) {
      allProjects.forEach(p => {
        kanbanBoardService.getBoardByProjectId(p.id).then(res => {
          if (res.data) {
            setBoardData(prev => ({
              ...prev,
              [p.id]: res.data
            }));
          }
        });
      });
    }
  }, [isMounted, allProjects.length]);

  const currentUserEmail = user?.email || '';
  const projects = allProjects.filter(p =>
    p.userEmail === currentUserEmail || (p.members || []).includes(currentUserEmail)
  );
  const activeProject = projects.find(p => p.isActive);

  // Fetch board data when active project changes (and poll for real-time updates)
  useEffect(() => {
    if (isMounted && USE_BACKEND_API && activeProject) {
      const fetchBoard = () => {
        kanbanBoardService.getBoardByProjectId(activeProject.id).then(res => {
          if (res.data) {
            setBoardData(prev => {
              // Simple check to prevent unnecessary re-renders if data hasn't changed (basic stringify comparison)
              if (JSON.stringify(prev[activeProject.id]) !== JSON.stringify(res.data)) {
                return { ...prev, [activeProject.id]: res.data };
              }
              return prev;
            });
          } else if (res.message) {
            console.error(`Error loading board: ${res.message}`);
          }
        });
      };

      // Initial fetch
      fetchBoard();

      // Setup polling every 3 seconds for real-time feel
      const intervalId = setInterval(fetchBoard, 3000);

      // Socket.io room logic (Future Backend)
      if (socket) {
        socket.emit('join-project', activeProject.id);

        const handleBoardUpdate = (updatedLists: BoardList[]) => {
          setBoardData(prev => ({ ...prev, [activeProject.id]: updatedLists }));
        };

        socket.on('board-updated', handleBoardUpdate);

        return () => {
          clearInterval(intervalId);
          socket.emit('leave-project', activeProject.id);
          socket.off('board-updated', handleBoardUpdate);
        };
      }

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [isMounted, activeProject?.id, socket]);

  const addProject = async (name: string, description?: string) => {
    if (!name.trim() || !user?.email) return;
    const newProject: Project = {
      id: Date.now().toString(),
      name: name.trim(),
      description: description?.trim(),
      isActive: false,
      userEmail: user.email,
    };
    setAllProjects(prev => [...prev, newProject]);

    setBoardData(prev => ({
      ...prev,
      [newProject.id]: [
        { id: 'todo', title: 'Todo', tasks: [] },
        { id: 'progress', title: 'Progress', tasks: [] },
        { id: 'review', title: 'Review', tasks: [] },
        { id: 'done', title: 'Done', tasks: [] },
      ]
    }));

    executeApi(projectService.createProject(newProject), `Error: Server is down or failed to save project!`);
  };

  const setActiveProject = (id: string | number) => {
    const currentUserEmail = user?.email || '';
    setAllProjects(prev => prev.map(p => ({
      ...p,
      isActive: p.id === id && (p.userEmail === currentUserEmail || (p.members || []).includes(currentUserEmail))
    })));
  };

  const addMemberToProject = async (projectId: string, email: string): Promise<{ success: boolean; message?: string }> => {
    showLoader(1500);
    if (!email || !email.trim()) {
      return { success: false, message: "Please enter an email address." };
    }
    const targetEmail = email.trim().toLowerCase();

    const targetProject = allProjects.find(p => p.id.toString() === projectId.toString());
    if (!targetProject) {
      return { success: false, message: "Project not found." };
    }

    if (targetProject.userEmail?.toLowerCase() === targetEmail) {
      return { success: false, message: "This user is already the owner of the project." };
    }

    const currentMembers = targetProject.members || [];
    if (currentMembers.map(m => m.toLowerCase()).includes(targetEmail)) {
      return { success: false, message: "This user is already a member of the project." };
    }

    const updatedMembers = [...currentMembers, targetEmail];

    if (USE_BACKEND_API) {
      const res = await memberService.addMember(projectId, targetEmail);
      if (res && res.data && res.data.success) {
        const newMembersList = res.data.members || updatedMembers;
        setAllProjects(prev => prev.map(p => {
          if (p.id.toString() === projectId.toString()) {
            return { ...p, members: newMembersList };
          }
          return p;
        }));
        return { success: true, message: res.data.message || `User ${targetEmail} added successfully!` };
      } else {
        return { success: false, message: res?.message || `Failed to add member ${targetEmail}.` };
      }
    } else {
      try {
        const storedUsersStr = localStorage.getItem('users');
        const storedUsers = storedUsersStr ? JSON.parse(storedUsersStr) : [];
        const userExists = storedUsers.some((u: any) => u.email?.toLowerCase() === targetEmail);
        if (!userExists) {
          return { success: false, message: `User with email "${targetEmail}" is not registered in the system.` };
        }
      } catch (e) {
        console.error("Error checking local users", e);
      }

      setAllProjects(prev => prev.map(p => {
        if (p.id.toString() === projectId.toString()) {
          return { ...p, members: updatedMembers };
        }
        return p;
      }));
      return { success: true, message: `User ${targetEmail} added successfully!` };
    }
  };

  const removeMemberFromProject = async (projectId: string, email: string): Promise<{ success: boolean; message?: string }> => {
    showLoader(1500);
    if (!email || !email.trim()) {
      return { success: false, message: "Please provide an email address." };
    }
    const targetEmail = email.trim().toLowerCase();

    const targetProject = allProjects.find(p => p.id.toString() === projectId.toString());
    if (!targetProject) {
      return { success: false, message: "Project not found." };
    }

    if (USE_BACKEND_API) {
      const res = await memberService.removeMember(projectId, targetEmail);
      if (res && res.data && res.data.success) {
        const newMembersList = res.data.members || (targetProject.members || []).filter(m => m.toLowerCase() !== targetEmail);
        setAllProjects(prev => prev.map(p => {
          if (p.id.toString() === projectId.toString()) {
            return { ...p, members: newMembersList };
          }
          return p;
        }));
        return { success: true, message: res.data.message || `User ${targetEmail} removed successfully!` };
      } else {
        return { success: false, message: res?.message || `Failed to remove member ${targetEmail}.` };
      }
    } else {
      const updatedMembers = (targetProject.members || []).filter(m => m.toLowerCase() !== targetEmail);
      setAllProjects(prev => prev.map(p => {
        if (p.id.toString() === projectId.toString()) {
          return { ...p, members: updatedMembers };
        }
        return p;
      }));
      return { success: true, message: `User ${targetEmail} removed successfully!` };
    }
  };

  const updateProjectListState = (projectId: string, listId: string, updater: (list: BoardList) => BoardList) => {
    setBoardData(prev => {
      const projectLists = prev[projectId] || [];
      const updatedLists = projectLists.map(list => list.id === listId ? updater(list) : list);
      return { ...prev, [projectId]: updatedLists };
    });
  };

  const addList = async (projectId: string, title: string) => {
    const newList = { id: Date.now().toString(), title, tasks: [] };
    setBoardData(prev => ({
      ...prev,
      [projectId]: [...(prev[projectId] || []), newList]
    }));
    executeApi(kanbanBoardService.createList(projectId, newList), `Error: Server is down or failed to save list!`);
  };

  const updateList = async (projectId: string, listId: string, title: string) => {
    updateProjectListState(projectId, listId, (list) => ({ ...list, title }));
    executeApi(kanbanBoardService.updateList(projectId, listId, { title }), `Error: Server is down or failed to update list!`);
  };

  const deleteList = async (projectId: string, listId: string) => {
    setBoardData(prev => ({
      ...prev,
      [projectId]: (prev[projectId] || []).filter(list => list.id !== listId)
    }));
    executeApi(kanbanBoardService.deleteList(projectId, listId), `Error: Server is down or failed to delete list!`);
  };

  const deleteProject = async (id: string | number) => {
    setAllProjects(prev => prev.filter(p => p.id !== id));
    setBoardData(prev => {
      const newData = { ...prev };
      delete newData[id];
      return newData;
    });

    if (activeProject?.id === id) setActiveProject('');
    executeApi(projectService.deleteProject(id), `Error: Server is down or failed to delete project!`);
  };

  const addTask = async (projectId: string, listId: string, task: Task) => {
    updateProjectListState(projectId, listId, (list) => ({ ...list, tasks: [...list.tasks, task] }));
    executeApi(taskService.createTask(listId, task), `Error: Server is down or failed to save task!`);
  };

  const updateTask = async (projectId: string, listId: string, taskId: string, updatedTask: Task) => {
    updateProjectListState(projectId, listId, (list) => ({ ...list, tasks: list.tasks.map(t => t.id === taskId ? updatedTask : t) }));
    executeApi(taskService.updateTask(taskId, updatedTask), `Error: Server is down or failed to update task!`);
  };

  const deleteTask = async (projectId: string, listId: string, taskId: string) => {
    updateProjectListState(projectId, listId, (list) => ({ ...list, tasks: list.tasks.filter(t => t.id !== taskId) }));
    executeApi(taskService.deleteTask(taskId), `Error: Server is down or failed to delete task!`);
  };

  const updateListTasks = async (projectId: string, listId: string, tasks: Task[]) => {
    updateProjectListState(projectId, listId, (list) => ({ ...list, tasks }));
    executeApi(kanbanBoardService.updateList(projectId, listId, { tasks }), `Error: Server is down or failed to move task!`);
  };

  const updateListsOrder = async (projectId: string, lists: BoardList[]) => {
    setBoardData(prev => ({ ...prev, [projectId]: lists }));
    executeApi(kanbanBoardService.updateBoardState(projectId, { lists }), `Error: Server is down or failed to reorder lists!`);

  };

  return (
    <AppContext.Provider value={{
      projects, addProject, setActiveProject, addMemberToProject, removeMemberFromProject, isMobileMenuOpen, setIsMobileMenuOpen,
      searchQuery, setSearchQuery,
      boardData, activeProject, addList, updateList, deleteList, deleteProject, addTask, updateTask, deleteTask, updateListTasks, updateListsOrder
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};