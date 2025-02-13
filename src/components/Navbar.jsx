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
        <Typography
          variant="h6"
          sx={{
            color: "white",
            marginLeft: 2,
            fontWeight: "bold",
            transition: "transform 0.3s",
            "&:hover": { transform: "scale(1.05)" },
          }}
        >
          DSA Executors
        </Typography>
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
