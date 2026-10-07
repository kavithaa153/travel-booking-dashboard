import "./Button.css";

function Button({
  children,
  type = "button",
  variant = "primary",
  size = "medium",
  onClick,
  disabled = false,
  icon,
}) {
  return (
    <button
      type={type}
      className={`common-button common-button-${variant} common-button-${size}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="common-button-icon">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

export default Button;