import { ReactNode, useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { Sidebar, SIDEBAR_WIDTH } from "./Sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
          // Let the permanent Drawer occupy space in the flex layout
          // and avoid extra margin that creates a visible gap.
          ml: 0,
          pl: { xs: 2, md: 2, lg: 3 },
          pr: { xs: 2, md: 3, lg: 4 },
          py: { xs: 8, md: 10 },
          background: "linear-gradient(180deg, rgba(242,245,247,0.92) 0%, #f5f7fa 50%, #eef3f3 100%)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(circle at 25% 20%, rgba(50,102,90,0.08), transparent 40%), radial-gradient(circle at 80% 0%, rgba(27,73,145,0.08), transparent 45%)",
          }}
        />

        {isMobile && <Box sx={{ height: 64 }} />}

        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: { xs: "100%", xl: "min(1280px, 100%)" },
            mx: { xl: "auto" },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};
