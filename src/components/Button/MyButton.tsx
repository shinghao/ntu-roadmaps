import { Button, ButtonProps } from "@mui/material";

interface Props extends ButtonProps {
  children: React.ReactNode;
}

const MyButton = ({ children, ...props }: Props) => {
  return (
    <Button
      variant="contained"
      disableElevation
      sx={{
        "&:hover": {
          borderBottom: "none",
        },
        textTransform: "none",
        borderRadius: "0.9rem",
        padding: "0.4rem 1rem",
      }}
      size="small"
      {...props}
    >
      {children}
    </Button>
  );
};

export default MyButton;
