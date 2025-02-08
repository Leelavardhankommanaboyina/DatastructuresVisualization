import { AppBar, Toolbar, Typography, Box, IconButton } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material"; // Importing modern icons
import Sidebar from "./Sidebar";

export default function Navbar({ toggleTheme, isDarkMode }) {
  return (
    <AppBar
      position="static"
      sx={{
        width: "100%",
        backgroundColor: isDarkMode ? "#424242" : "#1976d2",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Sidebar />
        <Typography variant="h6">Binary Brains</Typography>
        <Box>
          {/* Using Material-UI IconButton for theme toggle */}
          <IconButton onClick={toggleTheme} color="inherit" aria-label="toggle theme">
            {isDarkMode ? (
              <Brightness7 /> // Sun icon for light mode
            ) : (
              <Brightness4 /> // Moon icon for dark mode
            )}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
