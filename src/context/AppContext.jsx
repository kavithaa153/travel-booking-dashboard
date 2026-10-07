import { createContext, useCallback, useContext, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({
      id: Date.now(),
      message,
      type,
    });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return (
    <AppContext.Provider
      value={{
        toast,
        showToast,
        hideToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used inside AppProvider");
  }

  return context;
}