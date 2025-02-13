import { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import {
  Menu,
  Home,
  Storage,
  Functions,
  Visibility,
  Speed, // Imported Speed icon
} from "@mui/icons-material";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  // Set default state to true so the sidebar is open on load
  const [open, setOpen] = useState(true);

  const navItems = [
    { text: "Home", path: "/", icon: <Home /> },
    { text: "Algorithms", path: "/typesofalgorithms", icon: <Storage /> },
    { text: "Datastructure", path: "/typesofdatastructures", icon: <Functions /> },
    { text: "Custom Visualizer", path: "/customv", icon: <Visibility /> },
    { text: "Visualize Charts", path: "/display", icon: <Visibility /> },
    { text: "Feedback", path: "/feedback", icon: <Speed /> }, // Changed icon to Speed
  ];

  return (
    <>
      {/* The menu button remains available if you want to reopen the drawer after closing it */}
      <IconButton
        onClick={() => setOpen(true)}
        className="menu-icon"
        aria-label="Open navigation menu"
      >
        <Menu />
      </IconButton>

      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: 250, sm: 300 },
          },
        }}
      >
        <List>
          {navItems.map(({ text, path, icon }) => (
            <ListItem
              button
              key={path}
              component={NavLink}
              to={path}
              end={path === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <div className="icon-container">{icon}</div>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}
