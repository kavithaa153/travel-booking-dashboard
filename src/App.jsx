import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Toast from "./components/common/Toast";
import { AppProvider, useAppContext } from "./context/AppContext";

function AppContent() {
  const { toast, hideToast } = useAppContext();

  return (
    <>
      <AppRoutes />

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={hideToast}
        />
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;