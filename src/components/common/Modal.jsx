import { X, AlertTriangle } from "lucide-react";

import "./Modal.css";

function Modal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel"
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal-card"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="modal-close"
          onClick={onCancel}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="modal-icon">
          <AlertTriangle size={22} />
        </div>

        <h2>{title}</h2>

        <p>{message}</p>

        <div className="modal-actions">
          <button
            className="modal-cancel"
            onClick={onCancel}
          >
            {cancelText}
          </button>

          <button
            className="modal-confirm"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;