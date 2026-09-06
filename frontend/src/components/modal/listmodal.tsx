import { useState, useEffect } from 'react';
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react';
import { X } from 'lucide-react';
import { Button } from '../common/button';

interface ListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string) => void;
  initialTitle: string;
}

export default function ListModal({ isOpen, onClose, onSave, initialTitle }: ListModalProps) {
  const [title, setTitle] = useState('');

  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle, isOpen]);

  const handleSave = () => {
    if (title.trim()) {
      onSave(title.trim());
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-text-muted/30 backdrop-blur-[1px] transition-opacity" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="bg-background w-full max-w-md rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden flex flex-col font-sans border border-neutral-100">
          <div className="pt-7 px-8 pb-4 flex justify-between items-center">
            <DialogTitle className="text-xl font-bold text-text-heading">
              Edit List Title
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-icon-default hover:text-text-body">
              <X className="w-5 h-5" strokeWidth={2.5} />
            </Button>
          </div>

          <div className="px-8 pb-4 flex-1 space-y-5 overflow-y-auto">
            <div>
              <label className="block text-xs font-bold text-text-muted tracking-wider mb-2 uppercase">List Title</label>
              <input
                autoFocus
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSave();
                }}
                className="w-full px-4 py-3 border border-board-border rounded-xl bg-card-bg text-text-body text-sm outline-none focus:border-icon-default focus:ring-4 focus:ring-board-divider transition-all placeholder:text-text-placeholder"
                placeholder="e.g., In Progress"
              />
            </div>
          </div>

          <div className="px-8 py-7 mt-1 flex justify-end items-center gap-6">
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
              disabled={!title.trim() || title.trim() === initialTitle}
              className="px-6! py-2.5! rounded-lg! bg-primary-950! hover:bg-primary-900! disabled:opacity-50 disabled:cursor-not-allowed tracking-wide"
            >
              Save List
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
