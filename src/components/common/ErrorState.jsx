import { AlertCircle, RefreshCw } from "lucide-react";

function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load the requested data.",
  onRetry,
}) {
  return (
    <div className="common-error-state">
      <div className="common-error-icon">
        <AlertCircle size={28} />
      </div>

      <h3>{title}</h3>
      <p>{message}</p>

      {onRetry && (
        <button
          type="button"
          className="common-error-button"
          onClick={onRetry}
        >
          <RefreshCw size={15} />
          Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorState;