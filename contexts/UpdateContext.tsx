import * as Updates from "expo-updates";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface UpdateContextValue {
  isChecking: boolean;
  isDownloading: boolean;
  updateAvailable: boolean;
}

const UpdateContext = createContext<UpdateContextValue | undefined>(undefined);

interface UpdateProviderProps {
  children: ReactNode;
}

export function UpdateProvider({ children }: UpdateProviderProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    async function checkForUpdates() {
      // Skip if running in development mode
      if (__DEV__) {
        console.log("Skipping update check in development mode");
        return;
      }

      try {
        setIsChecking(true);

        // Check if updates are enabled
        if (!Updates.isEnabled) {
          console.log("Updates are not enabled");
          return;
        }

        // Check for available updates
        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          console.log("Update available, downloading...");
          setUpdateAvailable(true);
          setIsDownloading(true);

          // Download the update
          await Updates.fetchUpdateAsync();

          console.log("Update downloaded, reloading app...");

          // Reload the app automatically without user confirmation
          await Updates.reloadAsync();
        } else {
          console.log("No updates available");
        }
      } catch (error) {
        console.error("Error checking for updates:", error);
      } finally {
        setIsChecking(false);
        setIsDownloading(false);
      }
    }

    // Check for updates when the app starts
    checkForUpdates();
  }, []);

  const value: UpdateContextValue = {
    isChecking,
    isDownloading,
    updateAvailable,
  };

  return (
    <UpdateContext.Provider value={value}>{children}</UpdateContext.Provider>
  );
}

export function useUpdate(): UpdateContextValue {
  const ctx = useContext(UpdateContext);
  if (!ctx) {
    throw new Error("useUpdate must be used within an UpdateProvider");
  }
  return ctx;
}
