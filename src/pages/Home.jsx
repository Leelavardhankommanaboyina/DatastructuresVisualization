import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  List, 
  ListItem, 
  ListItemText 
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function Home() {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Welcome to DSA Executors!!
      </Typography>
      <Typography variant="body1" align="center" sx={{ mb: 3 }}>
        This website makes data structures and algorithms visual, interactive, and easy to understand.
        Use the sidebar to navigate to a topic, or click on one of the sectors below.
      </Typography>
      
      {/* Sectors in a horizontal row */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'row', 
          gap: 2, 
          overflowX: 'auto', 
          padding: 1 
        }}
      >
        {/* Searching Algorithms */}
        <Card sx={{ minWidth: 250 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Searching Algorithms
            </Typography>
            <List>
              <ListItem button component={RouterLink} to="/linearSearch">
                <ListItemText primary="Linear Search" sx={{ color: 'blue' }} />
              </ListItem>
              <ListItem button component={RouterLink} to="/binarySearch">
                <ListItemText primary="Binary Search" sx={{ color: 'blue' }} />
              </ListItem>
              <ListItem button component={RouterLink} to="/interpolationSearch">
                <ListItemText primary="Interpolation Search" sx={{ color: 'blue' }} />
              </ListItem>
            </List>
          </CardContent>
        </Card>
        
        {/* Sorting Algorithms */}
        <Card sx={{ minWidth: 250 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Sorting Algorithms
            </Typography>
            <List>
              <ListItem button component={RouterLink} to="/bubbleSort">
                <ListItemText primary="Bubble Sort" sx={{ color: 'blue' }} />
              </ListItem>
              <ListItem button component={RouterLink} to="/quickSort">
                <ListItemText primary="Quick Sort" sx={{ color: 'blue' }} />
              </ListItem>
              <ListItem button component={RouterLink} to="/mergeSort">
                <ListItemText primary="Merge Sort" sx={{ color: 'blue' }} />
              </ListItem>
              <ListItem button component={RouterLink} to="/heapSort">
                <ListItemText primary="Heap Sort" sx={{ color: 'blue' }} />
              </ListItem>
              <ListItem button component={RouterLink} to="/countSort">
                <ListItemText primary="Count Sort" sx={{ color: 'blue' }} />
              </ListItem>
            </List>
          </CardContent>
        </Card>
        
        {/* Graph Algorithms */}
        <Card sx={{ minWidth: 250 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Graph Algorithms
            </Typography>
            <List>
              <ListItem button component={RouterLink} to="/bfs">
                <ListItemText primary="BFS" sx={{ color: 'blue' }} />
              </ListItem>
              <ListItem button component={RouterLink} to="/dfs">
                <ListItemText primary="DFS" sx={{ color: 'blue' }} />
              </ListItem>
              <ListItem button component={RouterLink} to="/dijkstra">
                <ListItemText primary="Dijkstra's Algorithm" sx={{ color: 'blue' }} />
              </ListItem>
              <ListItem button component={RouterLink} to="/pk">
                <ListItemText primary="Prim's & Kruskal's (MST)" sx={{ color: 'blue' }} />
              </ListItem>
            </List>
          </CardContent>
        </Card>
        
        {/* Data Structures */}
        <Card sx={{ minWidth: 250 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Data Structures
            </Typography>
            <List>
              <ListItem button component={RouterLink} to="/linkedlist">
                <ListItemText primary="Linked List" sx={{ color: 'blue' }} />
              </ListItem>
              <ListItem button component={RouterLink} to="/stack">
                <ListItemText primary="Stack" sx={{ color: 'blue' }} />
              </ListItem>
              <ListItem button component={RouterLink} to="/queue">
                <ListItemText primary="Queue" sx={{ color: 'blue' }} />
              </ListItem>
              <ListItem button component={RouterLink} to="/bst">
                <ListItemText primary="BST" sx={{ color: 'blue' }} />
              </ListItem>
              <ListItem button component={RouterLink} to="/avl">
                <ListItemText primary="AVL Tree" sx={{ color: 'blue' }} />
              </ListItem>
              <ListItem button component={RouterLink} to="/hashTable">
                <ListItemText primary="Hash Table" sx={{ color: 'blue' }} />
              </ListItem>
              <ListItem button component={RouterLink} to="/typesoftrees">
                <ListItemText primary="Types of Trees" sx={{ color: 'blue' }} />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Box>
      
      {/* Instructions Section */}
      <Box sx={{ mt: 4, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>
          How to Use the Website
        </Typography>
        <Typography variant="body1">
          Use the sectors above to navigate through different algorithms and data structures.
          Each sector represents a category of topics. Click on any link (displayed in blue) to
          view interactive visualizations and detailed explanations. The sidebar also provides additional navigation options.
          Enjoy exploring and learning through interactive visualizations!
        </Typography>
      </Box>
    </Box>
  );
}
