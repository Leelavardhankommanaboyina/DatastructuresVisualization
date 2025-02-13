import React from 'react';
import { List, ListItem, ListItemText, Paper, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import SpeedIcon from '@mui/icons-material/Speed';
import MergeTypeIcon from '@mui/icons-material/MergeType';
import FilterHdrIcon from '@mui/icons-material/FilterHdr';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';

const sortItems = [
  { text: "Bubble Sort", to: "/bubbleSort", icon: <BubbleChartIcon fontSize="large" /> },
  { text: "Quick Sort", to: "/quickSort", icon: <SpeedIcon fontSize="large" /> },
  { text: "Merge Sort", to: "/mergeSort", icon: <MergeTypeIcon fontSize="large" /> },
  { text: "Heap Sort", to: "/heapSort", icon: <FilterHdrIcon fontSize="large" /> },
  { text: "Counting Sort", to: "/countSort", icon: <FormatListNumberedIcon fontSize="large" /> },
];

export default function SortingList() {
  return (
    <Paper
      elevation={4}
      sx={{
        p: 3,
        mx: 'auto',
        my: 4,
        maxWidth: 600,
        background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
        borderRadius: 2,
      }}
    >
      <List>
        {sortItems.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.03 }}
            style={{ borderRadius: '8px' }}
          >
            <ListItem
              button
              component={Link}
              to={item.to}
              sx={{
                mb: 1,
                borderRadius: 1,
                backgroundColor: '#fff',
                transition: 'background-color 0.3s ease',
                "&:hover": { backgroundColor: "#e3f2fd" },
              }}
            >
              <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                {item.icon}
              </Box>
              <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 'medium', fontSize: '1.1rem' }} />
            </ListItem>
          </motion.div>
        ))}
      </List>
    </Paper>
  );
}
