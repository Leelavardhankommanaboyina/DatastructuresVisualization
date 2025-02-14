import { AppBar, Toolbar, Typography, Box, IconButton } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import Sidebar from "./Sidebar";

export default function Navbar({ toggleTheme, isDarkMode }) {
  return (
    <AppBar
      position="static"
      sx={{
        width: "100%",
        background: isDarkMode
          ? "linear-gradient(45deg, #424242, #212121)"
          : "linear-gradient(45deg, #1976d2, #42a5f5)",
        boxShadow: 3,
      }}
    >
      <Toolbar sx={{ display: "flex", alignItems: "center" }}>
        <Sidebar />
        <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
          <img
            src="dsae.png" // Update with your logo path
            alt="Logo"
            style={{ height: "40px", marginRight: "10px" }}
          />
          <Typography
            variant="h6"
            sx={{
              color: "white",
              fontWeight: "bold",
              transition: "transform 0.3s",
              "&:hover": { transform: "scale(1.05)" },
            }}
          >
            DSA Executors
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton
          onClick={toggleTheme}
          color="inherit"
          aria-label="toggle theme"
        >
          {isDarkMode ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
