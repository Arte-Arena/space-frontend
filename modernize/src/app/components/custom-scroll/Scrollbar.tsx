import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import Box from '@mui/material/Box'
import { SxProps } from '@mui/system';
import { styled } from '@mui/material/styles'
import { useMediaQuery } from "@mui/material";

const SimpleBarStyle = styled(SimpleBar)(({ theme }) => ({
  maxHeight: "100%",
  ".simplebar-scrollbar": {
    "&:before": {
      backgroundColor: theme.palette.mode === "dark" 
        ? "rgba(255, 255, 255, 0.3)" 
        : "rgba(0, 0, 0, 0.2)",
      borderRadius: 8,
    },
    "&.simplebar-visible:before": {
      opacity: 0.7,
    },
  },
  ".simplebar-track.simplebar-vertical": {
    width: "10px",
    marginRight: "2px",
  },
  ".simplebar-track.simplebar-horizontal .simplebar-scrollbar": {
    height: "6px",
  },
}));

interface PropsType {
  children: React.ReactElement | React.ReactNode;
  sx: SxProps;
}

const Scrollbar = (props: PropsType) => {
  const { children, sx, ...other } = props;
  const lgDown = useMediaQuery((theme: any) => theme.breakpoints.down('lg'));

  if (lgDown) {
    return <Box sx={{ overflowX: "auto" }}>{children}</Box>;
  }

  return (
    <SimpleBarStyle sx={sx} {...other}>
      {children}
    </SimpleBarStyle>
  );
};

export default Scrollbar;
