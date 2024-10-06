import { create } from "zustand";

interface Alert {
  message: string;
  severity: "success" | "error";
}

interface AlertStore {
  alert: Alert | null;
  setAlert: (alert: Alert | null) => void;
}

const useAlertStore = create<AlertStore>((set) => ({
  alert: null,
  setAlert: (alert) => set({ alert }),
}));

export default useAlertStore;
