import { ReactNode, useMemo, useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Sidebar } from "./Sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  const backgroundGradient = useMemo(() => {
    const base = alpha(theme.palette.background.default, 0.94);
    const tint = alpha(theme.palette.primary.light, 0.35);
    const dusk = alpha(theme.palette.secondary.dark, 0.45);

    return `linear-gradient(140deg, ${base} 0%, ${tint} 48%, ${dusk} 100%)`;
  }, [theme]);

  const overlayGradient = useMemo(() => {
    const aurora = alpha(theme.palette.primary.main, 0.18);
    const mist = alpha(theme.palette.common.white, 0.16);

    return `radial-gradient(circle at 18% 12%, ${aurora}, transparent 55%), radial-gradient(circle at 82% 8%, ${mist}, transparent 58%)`;
  }, [theme]);

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  return (
    <Box
      sx={{
        display: "flex",
        position: "relative",
        minHeight: "100vh",
        background: backgroundGradient,
        overflow: "hidden",
      }}
    >
      <Sidebar mobileOpen={mobileOpen} onDrawerToggle={handleDrawerToggle} />

      <Box
        component="main"
        sx={{
          position: "relative",
          flexGrow: 1,
          minHeight: "100vh",
          px: { xs: 1.5, md: 2.5, lg: 4 },
          py: { xs: 4, md: 5.5 },
          display: "flex",
          justifyContent: "center",
          color: theme.palette.text.primary,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: overlayGradient,
            opacity: 0.9,
          }}
        />

        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: "1440px",
            display: "flex",
            flexDirection: "column",
            gap: { xs: 3, md: 4 },
          }}
        >
          {isMobile && <Box sx={{ height: 48 }} />}

          <Box
            sx={(theme) => ({
              position: "relative",
              borderRadius: { xs: 3, md: 4 },
              border: `1px solid ${alpha(theme.palette.common.white, 0.15)}`,
              backgroundColor: alpha(theme.palette.background.paper, 0.72),
              boxShadow: `0 24px 72px ${alpha(theme.palette.common.black, 0.25)}`,
              backdropFilter: "blur(16px)",
              px: { xs: 2.5, sm: 3, md: 4 },
              py: { xs: 3, md: 4.5 },
              minHeight: "calc(100vh - 96px)",
              "&::before": {
                content: '""',
                position: "absolute",
                inset: 0,
                borderRadius: "inherit",
                background: `linear-gradient(140deg, ${alpha(theme.palette.primary.light, 0.18)} 0%, ${alpha(
                  theme.palette.secondary.main,
                  0.12
                )} 65%, transparent 100%)`,
                pointerEvents: "none",
                zIndex: -1,
              },
            })}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: "1400px",
                mx: "auto",
              }}
            >
              {children}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
