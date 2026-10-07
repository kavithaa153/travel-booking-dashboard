function StatusBadge({ status }) {
  const normalizedStatus = String(status || "pending").toLowerCase();

  return (
    <span className={`common-status-badge ${normalizedStatus}`}>
      {status || "Pending"}
    </span>
  );
}

export default StatusBadge;