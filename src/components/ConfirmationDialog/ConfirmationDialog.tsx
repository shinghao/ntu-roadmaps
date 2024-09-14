import {
  Dialog,
  IconButton,
  Box,
  DialogTitle,
  DialogContent,
  Typography,
  Stack,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  icon?: React.ReactNode;
}

function ConfirmationDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText,
  icon,
}: ConfirmationDialogProps) {
  return (
    <Dialog
      sx={{
        "& .MuiDialog-paper": {
          width: "100%",
          maxHeight: 435,
          padding: "10px",
          borderRadius: "16px",
        },
      }}
      maxWidth="sm"
      open={open}
      onClose={onClose}
    >
      <IconButton
        sx={{
          marginLeft: "auto",
          borderRadius: "100%",
        }}
        onClick={onClose}
      >
        <CloseIcon color="disabled" />
      </IconButton>
      {icon && <Box sx={{ margin: "0 auto" }}>{icon}</Box>}
      <DialogTitle textAlign="center" fontSize="1.5em">
        {title}
      </DialogTitle>
      <DialogContent>
        <Typography textAlign="center">{description}</Typography>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          gap="24px"
          maxWidth="400px"
          margin="0 auto"
          marginTop="32px"
        >
          <Button
            fullWidth
            autoFocus
            onClick={onClose}
            variant="outlined"
            color="primary"
            sx={{ paddingY: "10px" }}
          >
            {cancelText}
          </Button>
          <Button
            fullWidth
            onClick={onConfirm}
            variant="contained"
            color="error"
            sx={{ paddingY: "10px" }}
          >
            {confirmText}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmationDialog;
