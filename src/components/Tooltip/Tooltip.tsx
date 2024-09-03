import { styled, Tooltip, tooltipClasses, TooltipProps } from "@mui/material";

const TheTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow placement="top" classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    fontSize: theme.typography.pxToRem(13),
  },
}));

export default TheTooltip;
