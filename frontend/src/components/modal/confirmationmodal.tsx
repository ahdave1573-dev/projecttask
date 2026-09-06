import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { AlertTriangle, LogOut, Trash2 } from 'lucide-react';
import { Button } from '../common/button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'delete' | 'logout' | 'danger';
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
}: ConfirmationModalProps) {
  const Icon = type === 'logout' ? LogOut : type === 'delete' ? Trash2 : AlertTriangle;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity data-closed:opacity-0 data-enter:duration-300 data-leave:duration-200 data-enter:ease-out data-leave:ease-in"
      />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-2xl bg-modal-bg text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-leave:duration-200 data-enter:ease-out data-leave:ease-in sm:my-8 sm:w-full sm:max-w-md data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <div className="bg-modal-bg px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className={`mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10 ${type === 'logout' ? 'bg-primary-100 text-primary-600' : 'bg-error-100 text-error-600'}`}>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle as="h3" className="text-base font-semibold leading-6 text-modal-title">
                    {title}
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-modal-desc">
                      {description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-modal-footer-bg px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <Button
                variant={type === 'logout' ? 'primary' : 'danger'}
                className="inline-flex! w-full justify-center! px-3! py-2! text-sm font-semibold sm:ml-3 sm:w-auto"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
              >
                {confirmText}
              </Button>
              <Button
                variant="outline"
                className="mt-3 inline-flex! w-full justify-center! px-3! py-2! text-sm font-semibold text-modal-title ring-1! ring-inset! ring-modal-border! border-0! hover:bg-modal-footer-bg sm:mt-0 sm:w-auto"
                onClick={onClose}
              >
                {cancelText}
              </Button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
