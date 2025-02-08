import { useState } from "react";
import { Drawer, List, ListItem, ListItemText, IconButton } from "@mui/material";
import { Menu, Home, Storage, Functions, Visibility } from "@mui/icons-material";  // Corrected icon name
import { Link, NavLink } from "react-router-dom";
import "./Sidebar.css"; // Add a CSS file for styling

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton onClick={() => setOpen(true)} className="menu-icon">
        <Menu />
      </IconButton>
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)} className="sidebar">
        <List>
          {[
            { text: "Home", path: "/", icon: <Home /> },
            { text: "Datastructures", path: "/typesofalgorithms", icon: <Storage /> },
            { text: "Algorithms", path: "/typesofdatastructures", icon: <Functions /> },
            { text: "Visualization", path: "/display", icon: <Visibility /> },
          ].map(({ text, path, icon }, index) => (
            <ListItem button key={index} component={NavLink} to={path} onClick={() => setOpen(false)} activeClassName="active-link">
              <div className="icon-container">{icon}</div>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}
