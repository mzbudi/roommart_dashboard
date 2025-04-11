import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  cancelButtonMessage,
  successButtonMessage,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  title: string;
  message: string;
  cancelButtonMessage: string;
  successButtonMessage: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center">
        <DialogPanel className="bg-white p-6 rounded shadow-md max-w-sm w-full">
          <DialogTitle className="text-lg font-medium">{title}</DialogTitle>
          <p className="mt-2">{message}</p>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded">
              {cancelButtonMessage}
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              {successButtonMessage}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
