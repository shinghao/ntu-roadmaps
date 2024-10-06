import { useEffect, useState } from "react";
import emailjs from "emailjs-com";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ArticleOutlined, Close } from "@mui/icons-material";
import useAlertStore from "@store/useAlertStore";

const successAlertMessage = "Successfully submitted feedback. Thank you! 😊";
const errorAlertMessage = "Failed to send feedback. Please try again.";

const FeedbackModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setAlert } = useAlertStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    setFeedback("");
  }, [isOpen]);

  const sendFeedback = async () => {
    const templateParams = {
      message: feedback,
    };
    setIsLoading(true);

    try {
      emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      setAlert({ message: successAlertMessage, severity: "success" });
      onClose();
    } catch (error) {
      console.error("Failed to send feedback", error);
      setAlert({ message: errorAlertMessage, severity: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: isMobile ? 0 : "16px",
          padding: "16px",
        },
      }}
      fullWidth
      open={isOpen}
      onClose={onClose}
      fullScreen={isMobile}
    >
      <IconButton
        sx={{
          marginLeft: "auto",
          borderRadius: "100%",
        }}
        onClick={onClose}
      >
        <Close color="disabled" />
      </IconButton>
      <DialogTitle textAlign="center" fontSize="1.5em">
        {"Feedback / Report Bug"}
      </DialogTitle>
      <DialogContent>
        <TextField
          multiline
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Your feedback"
          required
          fullWidth
          rows={8}
          disabled={isLoading}
        />

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
              height: "54px",
            }}
          >
            {"Cancel"}
          </Button>
          <Button
            fullWidth
            onClick={sendFeedback}
            variant="contained"
            color="primary"
            sx={{
              borderRadius: "24px",
              height: "54px",
            }}
            disabled={isLoading || feedback === ""}
          >
            {isLoading ? <CircularProgress size={20} /> : "Submit"}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

const FeedbackButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isSmallMobile = useMediaQuery("(max-width: 480px)");

  return (
    <>
      {isSmallMobile ? (
        <IconButton
          sx={{ border: "1px solid lightgrey", padding: "0.5rem" }}
          size="small"
          onClick={() => setIsModalOpen(true)}
        >
          <ArticleOutlined fontSize="small" color="primary" />
        </IconButton>
      ) : (
        <Button
          variant="outlined"
          disableElevation
          sx={{
            textTransform: "none",
            borderRadius: "0.9rem",
            paddingX: "16px",
            height: "38px",
          }}
          size="small"
          onClick={() => setIsModalOpen(true)}
        >
          Feedback
        </Button>
      )}
      <FeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default FeedbackButton;
