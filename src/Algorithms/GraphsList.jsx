import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  ListItemIcon,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import { BubbleChart, Timeline, Speed, NetworkCheck } from "@mui/icons-material";

export default function GraphsList() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 4,
        px: 2,
      }}
    >
      <Paper elevation={4} sx={{ p: 4, maxWidth: 600, width: "100%" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Graph Algorithms
        </Typography>
        <List>
          <ListItem
            button
            component={Link}
            to="/bfs"
            sx={{
              transition: "background-color 0.3s",
              "&:hover": { backgroundColor: "action.hover" },
              borderRadius: 1,
            }}
          >
            <ListItemIcon>
              <BubbleChart />
            </ListItemIcon>
            <ListItemText primary="Breadth-First Search (BFS)" />
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/dfs"
            sx={{
              transition: "background-color 0.3s",
              "&:hover": { backgroundColor: "action.hover" },
              borderRadius: 1,
            }}
          >
            <ListItemIcon>
              <Timeline />
            </ListItemIcon>
            <ListItemText primary="Depth-First Search (DFS)" />
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/dijkstra"
            sx={{
              transition: "background-color 0.3s",
              "&:hover": { backgroundColor: "action.hover" },
              borderRadius: 1,
            }}
          >
            <ListItemIcon>
              <Speed />
            </ListItemIcon>
            <ListItemText primary="Dijkstra's Algorithm" />
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/pk"
            sx={{
              transition: "background-color 0.3s",
              "&:hover": { backgroundColor: "action.hover" },
              borderRadius: 1,
            }}
          >
            <ListItemIcon>
              <NetworkCheck />
            </ListItemIcon>
            <ListItemText primary="Prim's and Kruskal's (Minimum Spanning Tree)" />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
}
