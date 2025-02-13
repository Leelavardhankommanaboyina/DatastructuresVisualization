import React from 'react';
import { Card, CardContent, Grid, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import TimelineIcon from '@mui/icons-material/Timeline';

export default function TypesofAlgorithms() {
  const algorithmTypes = [
    { label: "Searching Algorithms", to: "/searchingList", icon: <SearchIcon fontSize="large" color="primary" /> },
    { label: "Sorting Algorithms", to: "/sortingList", icon: <SortIcon fontSize="large" color="primary" /> },
    { label: "Graph Algorithms", to: "/graphsList", icon: <TimelineIcon fontSize="large" color="primary" /> },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 2, p: 2 }}>
      {algorithmTypes.map((item, index) => (
        <motion.div key={index} whileHover={{ scale: 1.05 }} style={{ borderRadius: 8 }}>
          <Link to={item.to} style={{ textDecoration: "none" }}>
            <Card sx={{ minWidth: 200, textAlign: "center", p: 2, borderRadius: 2, transition: "transform 0.3s" }}>
              <CardContent>
                <Box sx={{ mb: 1 }}>{item.icon}</Box>
                <Typography variant="h6">{item.label}</Typography>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </Box>
  );
}
