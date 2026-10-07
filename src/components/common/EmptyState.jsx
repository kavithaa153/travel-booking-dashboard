import { Inbox } from "lucide-react";

function EmptyState({
  title = "No data found",
  message = "There is nothing to display here.",
  action,
}) {
  return (
    <div className="common-empty-state">
      <div className="common-empty-icon">
        <Inbox size={28} />
      </div>

      <h3>{title}</h3>
      <p>{message}</p>

      {action && <div className="common-empty-action">{action}</div>}
    </div>
  );
}

export default EmptyState;