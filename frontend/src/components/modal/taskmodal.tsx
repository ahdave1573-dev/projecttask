import { useState, useEffect } from 'react';
import { Task } from '../../contexts/appcontext';
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop, Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import { X, ChevronDown, UploadCloud } from 'lucide-react';
import { useRef } from 'react';
import { Button } from '../common/button';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id'>) => void;
  initialData?: Task;
  isReadOnly?: boolean;
}

export default function TaskModal({ isOpen, onClose, onSave, initialData, isReadOnly }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Compress as JPEG with 0.7 quality
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setImageUrl(dataUrl);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setImageUrl(initialData.imageUrl || '');
      setPriority(initialData.priority || 'Medium');
    } else {
      setTitle('');
      setDescription('');
      setImageUrl('');
      setPriority('Medium');
    }
  }, [initialData, isOpen]);

  const handleSave = () => {
    if (title.trim()) {
      onSave({
        title: title.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim() || undefined,
        priority,
        tags: [],
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-text-muted/30 backdrop-blur-[1px] transition-opacity" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="bg-background w-full max-w-115 max-h-[90vh] rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden flex flex-col font-sans border border-neutral-100">
          {isReadOnly ? (
            <>
              <div className="pt-6 px-8 pb-4 flex justify-between items-center border-b border-board-border/60">
                <span className={`text-[11px] px-3 py-1 rounded-full font-bold tracking-wide
                  ${priority === 'High' ? 'bg-badge-danger-bg text-badge-danger-text' :
                    priority === 'Medium' ? 'bg-badge-warning-bg text-badge-warning-text' :
                      'bg-badge-success-bg text-badge-success-text'}
                `}>
                  {priority}
                </span>
                <Button variant="ghost" size="icon" onClick={onClose} className="text-text-placeholder hover:text-text-body">
                  <X className="w-5 h-5" strokeWidth={2.5} />
                </Button>
              </div>

              <div className="px-8 py-6 flex-1 min-h-0 overflow-y-auto">
                <h2 className="text-2xl font-bold text-text-heading mb-5 leading-snug break-all">{title}</h2>
                {imageUrl && (
                  <div className="mb-6 rounded-2xl overflow-hidden bg-board-bg border border-board-border/50 flex justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrl}
                      alt={title}
                      className="w-full max-h-64 object-contain bg-neutral-900/5"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                )}

                <div className="mb-2">
                  <span className="text-xs font-bold text-text-placeholder tracking-wider uppercase">Full Description</span>
                </div>

                <div className="bg-board-bg border border-board-border rounded-2xl p-5 mb-2">
                  <p className="text-text-body text-[15px] leading-relaxed whitespace-pre-wrap break-all">
                    {description || 'No description provided.'}
                  </p>
                </div>
              </div>
              <div className="px-8 py-5 flex justify-end gap-4 border-t border-board-border/30">
                <Button
                  variant="ghost"
                  onClick={() => {
                    // Re-open in edit mode
                    onClose();
                    // Small delay to allow modal to close before re-opening (or we can just pass a prop to switch modes)
                    // The easiest way is to trigger the parent's handleOpenEditModal.
                    // But we don't have that prop here. We can just change local state if we want, 
                    // but isReadOnly is a prop. So we need to trigger it from outside, or simply 
                    // we can't easily without adding an onEditRequest prop.
                    // Actually, if we just don't have it, let's add onEditRequest?
                  }}
                  className="hidden"
                >
                  Edit
                </Button>
                <Button
                  variant="primary"
                  onClick={onClose}
                  className="px-6! py-2.5! rounded-xl! bg-primary-950! hover:bg-primary-900!"
                >
                  Close
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="pt-5 px-6 pb-3 flex justify-between items-center">
                <DialogTitle className="text-xl font-bold text-text-heading">
                  {initialData ? 'Edit Task' : 'Create New Task'}
                </DialogTitle>
                <Button variant="ghost" size="icon" onClick={onClose} className="text-icon-default hover:text-text-body">
                  <X className="w-5 h-5" strokeWidth={2.5} />
                </Button>
              </div>

              <div className="px-6 pb-6 flex-1 min-h-0 space-y-4 overflow-y-auto">
                <div>
                  <label className="block text-xs font-bold text-text-muted tracking-wider mb-2 uppercase">Task Title</label>
                  <input
                    autoFocus
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 border border-board-border rounded-xl bg-card-bg text-text-body text-sm outline-none focus:border-icon-default focus:ring-4 focus:ring-board-divider transition-all placeholder:text-text-placeholder"
                    placeholder="e.g., Update mobile view"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-muted tracking-wider mb-2 uppercase">Description</label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full px-4 py-2.5 border border-board-border rounded-xl bg-card-bg text-text-body text-sm min-h-20 outline-none focus:border-icon-default focus:ring-4 focus:ring-board-divider transition-all resize-none placeholder:text-text-placeholder"
                    placeholder="Add details..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-muted tracking-wider mb-2 uppercase">Attach Image</label>
                  <div className="flex flex-col gap-4 p-4 border border-board-border rounded-xl bg-card-bg">
                    <div className="flex items-center gap-4 w-full">
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        ref={fileInputRef} 
                        onChange={handleFileUpload} 
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center justify-center w-1/3 py-4 border-2 border-dashed border-board-border rounded-xl hover:border-icon-default hover:bg-neutral-50 transition-colors"
                      >
                        <UploadCloud className="w-5 h-5 text-icon-default mb-2" strokeWidth={2.5} />
                        <span className="text-xs font-bold text-text-body">Upload file</span>
                      </button>
                      
                      <div className="flex-1">
                        <input
                          type="text"
                          value={imageUrl}
                          onChange={e => setImageUrl(e.target.value)}
                          className="w-full px-4 py-2.5 border border-board-border rounded-xl bg-card-bg text-text-body text-sm outline-none focus:border-icon-default focus:ring-4 focus:ring-board-divider transition-all placeholder:text-text-placeholder"
                          placeholder="Or paste Image URL..."
                        />
                      </div>
                    </div>
                    {imageUrl && (
                      <div className="relative self-center mt-2">
                        <img 
                          src={imageUrl} 
                          alt="Preview" 
                          className="h-32 max-w-full rounded-xl object-contain bg-neutral-900/5 shadow-sm border border-board-border/50" 
                        />
                        <button 
                          type="button"
                          onClick={() => setImageUrl('')}
                          className="absolute -top-2.5 -right-2.5 bg-badge-danger-text text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md"
                          title="Remove image"
                        >
                          <X className="w-4 h-4" strokeWidth={3} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-text-muted tracking-wider mb-2 uppercase">Priority</label>
                    <Listbox value={priority} onChange={setPriority}>
                      <div className="relative">
                        <ListboxButton className="w-full px-4 py-2.5 border border-board-border rounded-xl bg-card-bg text-text-body text-sm outline-none focus:border-icon-default focus:ring-4 focus:ring-board-divider transition-all flex justify-between items-center cursor-pointer">
                          <span className="block truncate">{priority}</span>
                          <ChevronDown className="w-4 h-4 text-text-placeholder shrink-0" strokeWidth={2.5} />
                        </ListboxButton>
                        <ListboxOptions
                          anchor="bottom"
                          className="z-50 w-(--button-width) mt-1 bg-card-bg border border-board-border rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.08)] overflow-hidden py-1 focus:outline-none"
                        >
                          {['Low', 'Medium', 'High'].map((level) => (
                            <ListboxOption
                              key={level}
                              value={level}
                              className="cursor-pointer select-none relative px-4 py-1.5 text-sm text-text-body data-focus:bg-board-bg data-selected:font-bold transition-colors"
                            >
                              {level}
                            </ListboxOption>
                          ))}
                        </ListboxOptions>
                      </div>
                    </Listbox>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 flex justify-end items-center gap-6 border-t border-board-border/30">
                <Button
                  variant="ghost"
                  onClick={onClose}
                  className="text-text-muted hover:text-text-body"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSave}
                  disabled={!title.trim()}
                  className="px-6! py-2.5! rounded-lg! bg-primary-950! hover:bg-primary-900! disabled:opacity-50 disabled:cursor-not-allowed tracking-wide"
                >
                  {initialData ? 'Update Task' : 'Save Task'}
                </Button>
              </div>
            </>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
}

