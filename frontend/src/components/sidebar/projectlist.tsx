"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProjectItem from './projectitem';
import { useApp } from '@/src/contexts/appcontext';
import ConfirmationModal from '../modal/confirmationmodal';

export default function ProjectList() {
    const { projects, setActiveProject, setIsMobileMenuOpen, boardData, deleteProject } = useApp();
    const [projectToDelete, setProjectToDelete] = useState<{id: string | number, name: string} | null>(null);
    const router = useRouter();

    const handleDeleteConfirm = () => {
        if (projectToDelete) {
            deleteProject(projectToDelete.id);
            setProjectToDelete(null);
        }
    };

    return (
        <>
            <ul className="space-y-1">
                {projects.map(project => {
                    const projectLists = boardData[project.id] || [];
                    const taskCount = projectLists.reduce((total, list) => total + list.tasks.length, 0);

                    return (
                        <ProjectItem
                            key={project.id}
                            name={project.name}
                            isActive={project.isActive}
                            taskCount={taskCount}
                            onClick={() => {
                                setActiveProject(project.id);
                                setIsMobileMenuOpen(false);
                                router.push(`/desktop/${encodeURIComponent(project.name)}`);
                            }}
                            onDelete={() => setProjectToDelete({ id: project.id, name: project.name })}
                        />
                    );
                })}
                {projects.length === 0 && (
                    <li className="px-3 py-2 text-sm text-neutral-500 italic">No projects yet.</li>
                )}
            </ul>
            
            <ConfirmationModal
                isOpen={!!projectToDelete}
                onClose={() => setProjectToDelete(null)}
                onConfirm={handleDeleteConfirm}
                title="Delete Project"
                description={`Are you sure you want to delete the project "${projectToDelete?.name}"? This action cannot be undone.`}
                confirmText="Delete"
                type="delete"
            />
        </>
    );
}
