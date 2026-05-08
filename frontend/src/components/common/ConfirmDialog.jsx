import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', isDanger = true }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex items-start mb-6">
        <div className={`p-2 rounded-full mr-4 ${isDanger ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <p className="text-slate-600">{message}</p>
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>
          {cancelText}
        </Button>
        <Button variant={isDanger ? 'danger' : 'primary'} onClick={onConfirm}>
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
