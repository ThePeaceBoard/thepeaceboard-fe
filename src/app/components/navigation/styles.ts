import { SxProps, Theme } from '@mui/material';

export const iconButtonStyles: SxProps<Theme> = {
  backgroundColor: "rgba(226, 138, 75, 0.05)",
  borderRadius: "50%",
  border: "1.542px solid rgba(226, 138, 75, 0.38)",
  width: "30px",
  height: "30px",
  display: "flex",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06)",
  transition: "box-shadow 0.3s ease, transform 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(226, 138, 75, 0.2)",
    boxShadow: "0 10px 15px rgba(0, 0, 0, 0.2), 0 4px 6px rgba(0, 0, 0, 0.1)",
    transform: "translateY(-4px)",
  },
};

export const iconStyles = {
  color: "#E28A4B",
  fontSize: "15px",
} as const; 