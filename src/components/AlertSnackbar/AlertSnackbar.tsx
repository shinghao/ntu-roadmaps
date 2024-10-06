import { Alert, Snackbar } from "@mui/material";
import useAlertStore from "@store/useAlertStore";

const AUTO_CLOSE_TIME = 3000; // 3 seconds

const AlertSnackBar = () => {
  const { alert, setAlert } = useAlertStore();

  if (!alert) return null;

  return (
    <Snackbar
      open={Boolean(alert)}
      autoHideDuration={AUTO_CLOSE_TIME}
      onClose={() => setAlert(null)}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={() => setAlert(null)}
        severity={alert.severity}
        sx={{ width: "100%" }}
      >
        {alert.message}
      </Alert>
    </Snackbar>
  );
};

export default AlertSnackBar;
