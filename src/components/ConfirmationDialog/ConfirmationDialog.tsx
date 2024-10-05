import {
  Dialog,
  IconButton,
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
}: ConfirmationDialogProps) {
  return (
    <Dialog
      sx={{
        "& .MuiDialog-paper": {
          maxHeight: 435,
          borderRadius: "16px",
          padding: "1rem",
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
      <DialogTitle textAlign="center" fontSize="1.5em">
        {title}
      </DialogTitle>
      <DialogContent>
        <Typography textAlign="center">{description}</Typography>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          gap="16px"
          margin="0 auto"
          marginTop="32px"
        >
          <Button
            fullWidth
            autoFocus
            onClick={onClose}
            variant="outlined"
            color="primary"
            sx={{
              borderRadius: "24px",
              padding: "0.8rem 1rem",
            }}
          >
            {cancelText}
          </Button>
          <Button
            fullWidth
            onClick={onConfirm}
            variant="contained"
            color="primary"
            sx={{
              borderRadius: "24px",
              padding: "0.8rem 1rem",
            }}
          >
            {confirmText}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmationDialog;
