import { List, ListItem, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";

export default function SortingList() {
  return (
    <List>
      <ListItem button component={Link} to="/bubbleSort">
        <ListItemText primary="Bubble Sort" />
      </ListItem>
      <ListItem button component={Link} to="/quickSort">
        <ListItemText primary="Quick Sort" />
      </ListItem>
      <ListItem button component={Link} to="/mergeSort">
        <ListItemText primary="Merge Sort" />
      </ListItem>
      <ListItem button component={Link} to="/heapSort">
        <ListItemText primary="Heap Sort" />
      </ListItem>
      <ListItem button component={Link} to="/countSort">
        <ListItemText primary="Counting Sort" />
      </ListItem>
    </List>
  );
}
