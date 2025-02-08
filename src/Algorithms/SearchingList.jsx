import { List, ListItem, ListItemText, ListItemIcon, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { Search, ListAlt, SearchOff } from "@mui/icons-material"; // Icons
import './SearchingList.css';

export default function SearchingList() {
  return (
    <div className="searching-list-container">
      {/* Heading */}
      <Typography variant="h4" sx={{ marginBottom: "20px", textAlign: "center" }}>
        Searching Algorithms
      </Typography>

      {/* List of Searching Algorithms */}
      <List className="searching-list">
        <ListItem button component={Link} to="/linearSearch" className="list-item">
          <ListItemIcon className="icon">
            <Search />
          </ListItemIcon>
          <ListItemText primary="Linear Search" />
        </ListItem>
        <ListItem button component={Link} to="/binarySearch" className="list-item">
          <ListItemIcon className="icon">
            <ListAlt />
          </ListItemIcon>
          <ListItemText primary="Binary Search" />
        </ListItem>
        <ListItem button component={Link} to="/interpolationSearch" className="list-item">
          <ListItemIcon className="icon">
            <SearchOff />
          </ListItemIcon>
          <ListItemText primary="Interpolation Search" />
        </ListItem>
      </List>
    </div>
  );
}
