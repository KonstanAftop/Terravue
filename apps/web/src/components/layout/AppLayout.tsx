import { ReactNode, useMemo, useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Sidebar, SIDEBAR_WIDTH } from "./Sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  const backgroundGradient = useMemo(() => {
    const surface = theme.palette.background.paper;
    const base = theme.palette.background.default;
    const tail = alpha(theme.palette.primary.dark || theme.palette.primary.main, 0.65);

    return `linear-gradient(180deg, ${base} 0%, ${alpha(surface, 0.96)} 48%, ${tail} 100%)`;
  }, [theme]);

  const overlayGradient = useMemo(() => {
    const primary = alpha(theme.palette.primary.main, 0.28);
    const secondary = alpha(theme.palette.secondary.main, 0.22);

    return `radial-gradient(circle at 18% 12%, ${primary}, transparent 55%), radial-gradient(circle at 82% 8%, ${secondary}, transparent 58%)`;
  }, [theme]);

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar mobileOpen={mobileOpen} onDrawerToggle={handleDrawerToggle} />

      <Box
        component="main"
        sx={{
          position: "relative",
          flexGrow: 1,
          minHeight: "100vh",
          ml: 0,
          px: { xs: 1.5, md: 2, lg: 2.5 },
          py: { xs: 3, md: 4 },
          overflowX: "hidden",
          background: backgroundGradient,
          color: theme.palette.text.primary,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: overlayGradient,
          }}
        />

        {isMobile && <Box sx={{ height: 48 }} />}

        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: "1400px",
            mx: "auto",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};