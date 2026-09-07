import { Folder, Trash2 } from 'lucide-react';
import { Button } from '../common/button';

interface ProjectItemProps {
  name: string;
  isActive?: boolean;
  taskCount?: number;
  onClick?: () => void;
  onDelete?: () => void;
}

export default function ProjectItem({ name, isActive, taskCount, onClick, onDelete }: ProjectItemProps) {
  return (
    <li 
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      className={`relative group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-300 ease-out text-[14.5px] font-semibold overflow-hidden ${
        isActive 
          ? 'bg-linear-to-r from-primary-50 to-primary-100/60 text-primary-900 shadow-sm shadow-primary-200/40 before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-1.5 before:bg-primary-600 before:rounded-r-full' 
          : 'text-neutral-500 hover:bg-sidebar-project-hover-bg hover:text-sidebar-project-hover-text'
      }`}
    >
      <Folder 
        className={`w-5 h-5 shrink-0 z-10 transition-colors duration-300 ${isActive ? 'text-primary-700' : 'text-neutral-400 group-hover:text-sidebar-project-hover-text'}`} 
        fill="currentColor" 
        strokeWidth={1.5}
      />
      <span className="truncate flex-1 min-w-0">{name}</span>
      <div className="flex items-center gap-1.5 shrink-0 ml-auto">
        {taskCount !== undefined && (
          <span className={`flex items-center justify-center min-w-6 h-6 px-1.5 rounded-full text-[11px] font-bold shrink-0 ${
            isActive 
              ? 'bg-primary-200 text-primary-900' 
              : 'bg-neutral-200 text-neutral-600'
          }`}>
            {taskCount}
          </span>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="w-6 h-6 p-1 opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-error-600 transition-opacity bg-transparent hover:bg-error-50 rounded-md"
            title="Delete Project"
          >
            <Trash2 className="w-3.5 h-3.5" strokeWidth={2.5} />
          </Button>
        )}
      </div>
    </li>
  );
}
