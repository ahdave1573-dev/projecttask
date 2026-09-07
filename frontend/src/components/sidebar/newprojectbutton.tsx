"use client";

import { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react';
import { X, Plus } from 'lucide-react';
import { useApp } from '@/src/contexts/appcontext';
import { Button } from '../common/button';

export default function NewProjectButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const { addProject } = useApp();

  const handleCreateProject = () => {
    if (projectName.trim()) {
      addProject(projectName, description);
      setProjectName('');
      setDescription('');
      setIsOpen(false);
    }
  };

  return (
    <>
      <Button 
        variant="secondary"
        onClick={() => setIsOpen(true)}
        className="flex! items-center justify-center gap-2 w-full px-4! py-2! text-[15px] font-medium text-primary-700! bg-primary-50! border! border-primary-200! rounded-xl! hover:bg-primary-100! shadow-none!"
      >
        <Plus className="w-5 h-5" />
        New Project
      </Button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" />

        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-card-bg p-6 text-left align-middle shadow-xl transition-all border border-neutral-100">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <DialogTitle as="h3" className="text-xl font-bold leading-6 text-neutral-800">
                  Create New Project
                </DialogTitle>
                <Button 
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)} 
                  className="text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-sm text-neutral-500">
                Add a new project workspace to organize your tasks.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label htmlFor="projectName" className="block text-xs font-bold text-neutral-600 mb-2 uppercase tracking-wide">Project Name</label>
                <input
                  type="text"
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600 shadow-sm transition-all text-sm text-neutral-800 placeholder:text-neutral-400"
                  placeholder="Add Project Name"
                  autoFocus
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-xs font-bold text-neutral-600 mb-2 uppercase tracking-wide">Short Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  maxLength={100}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600 shadow-sm transition-all text-sm text-neutral-800 placeholder:text-neutral-400 resize-none"
                  placeholder="Add Project Description"
                />
                <p className="text-right text-[10px] text-neutral-400 mt-1">
                  {description.length}/100 characters
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => { setIsOpen(false); setProjectName(''); setDescription(''); }}
                  className="px-5! py-2.5! text-sm font-semibold text-neutral-600 border! border-neutral-200! rounded-xl! hover:bg-neutral-50"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleCreateProject}
                  disabled={!projectName.trim()}
                  className="px-5! py-2.5! text-sm font-semibold text-btn-text bg-btn-primary! rounded-xl! hover:bg-btn-primary-hover! disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Project
                </Button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
