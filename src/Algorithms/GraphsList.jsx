import { List, ListItem, ListItemText, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function GraphsList() {
  return (
    <div className="graphs-list-container">
      {/* Heading */}
      <Typography variant="h4" sx={{ marginBottom: "20px", textAlign: "center" }}>
        Graph Algorithms
      </Typography>

      {/* List of Graph Algorithms */}
      <List>
        <ListItem button component={Link} to="/bfs">
          <ListItemText primary="Breadth-First Search (BFS)" />
        </ListItem>
        <ListItem button component={Link} to="/dfs">
          <ListItemText primary="Depth-First Search (DFS)" />
        </ListItem>
        <ListItem button component={Link} to="/dijkstra">
          <ListItemText primary="Dijkstra's Algorithm" />
        </ListItem>
        <ListItem button component={Link} to="/primKruskal">
          <ListItemText primary="Prim's and Kruskal's (Minimum Spanning Tree)" />
        </ListItem>
      </List>
    </div>
  );
}
