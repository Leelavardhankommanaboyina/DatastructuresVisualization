import React from 'react';
import { Card, CardContent, Box, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SearchIcon from '@mui/icons-material/Search';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SearchOffIcon from '@mui/icons-material/SearchOff';

export default function SearchingList() {
  const algorithms = [
    { label: "Linear Search", to: "/linearSearch", icon: <SearchIcon fontSize="large" color="primary" /> },
    { label: "Binary Search", to: "/binarySearch", icon: <ListAltIcon fontSize="large" color="primary" /> },
    { label: "Interpolation Search", to: "/interpolationSearch", icon: <SearchOffIcon fontSize="large" color="primary" /> },
  ];

  return (
    <Box sx={{ p: 3, background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ textAlign: 'center', mb: 4, fontWeight: 'bold', color: '#333' }}>
        Searching Algorithms
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {algorithms.map((algo, index) => (
          <Grid item key={index}>
            <motion.div whileHover={{ scale: 1.05 }} style={{ borderRadius: 8 }}>
              <Link to={algo.to} style={{ textDecoration: 'none' }}>
                <Card sx={{ minWidth: 220, p: 2, borderRadius: 2, boxShadow: 3 }}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {algo.icon}
                    <Typography variant="h6" sx={{ mt: 1, color: '#333' }}>
                      {algo.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
