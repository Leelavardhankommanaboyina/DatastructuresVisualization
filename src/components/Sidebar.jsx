import { useState } from "react";
import { Drawer, List, ListItem, ListItemText, IconButton } from "@mui/material";
import { Menu, Home, Storage, Functions, Visibility } from "@mui/icons-material";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  const navItems = [
    { text: "Home", path: "/", icon: <Home /> },
    { text: "Algorithms", path: "/typesofalgorithms", icon: <Storage /> },
    { text: "Datastructure", path: "/typesofdatastructures", icon: <Functions /> },
    { text: "Visualization", path: "/display", icon: <Visibility /> },
  ];

  return (
    <>
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
          '& .MuiDrawer-paper': {
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
              className={({ isActive }) => 
                isActive ? "active-link" : ""
              }
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