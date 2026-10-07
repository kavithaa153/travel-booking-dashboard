import { CheckCircle2, XCircle, X } from "lucide-react";
import "./Toast.css";

function Toast({ type = "success", message, onClose }) {
  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-icon">
        {type === "success" ? (
          <CheckCircle2 size={20} />
        ) : (
          <XCircle size={20} />
        )}
      </div>

      <span className="toast-message">{message}</span>

      <button
        type="button"
        className="toast-close"
        onClick={onClose}
        aria-label="Close notification"
      >
        <X size={17} />
      </button>
    </div>
  );
}

export default Toast;