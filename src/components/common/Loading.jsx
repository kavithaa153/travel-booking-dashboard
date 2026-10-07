import { LoaderCircle } from "lucide-react";

function Loading({ message = "Loading..." }) {
  return (
    <div className="common-loading">
      <LoaderCircle className="common-loading-spinner" size={32} />
      <span>{message}</span>
    </div>
  );
}

export default Loading;