import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TextField, List, ListItem, ListItemText, Box, Typography } from '@mui/material';

const algorithms = [
  { name: 'Linear Search', complexity: 'O(n)' },
  { name: 'Binary Search', complexity: 'O(log n)' },
  { name: 'Bubble Sort', complexity: 'O(n²)' },
  { name: 'Quick Sort', complexity: 'O(n log n)' },
  { name: 'Merge Sort', complexity: 'O(n log n)' }
];

export default function SelectAlgorithmStep() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [filteredAlgos, setFilteredAlgos] = useState(algorithms);

  useEffect(() => {
    if (!location.state?.data) {
      navigate('/data-input');
    }
  }, [location, navigate]);

  useEffect(() => {
    const results = algorithms.filter(alg =>
      alg.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredAlgos(results);
  }, [search]);

  const handleSelect = (algorithm) => {
    navigate('/visualize', {
      state: { data: location.state?.data, algorithm }
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Select Algorithm</Typography>
      <TextField
        fullWidth
        label="Search algorithms"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ my: 2 }}
      />
      {filteredAlgos.length === 0 ? (
        <Typography>No algorithms found</Typography>
      ) : (
        <List>
          {filteredAlgos.map((alg) => (
            <ListItem button key={alg.name} onClick={() => handleSelect(alg)}>
              <ListItemText
                primary={alg.name}
                secondary={`Time Complexity: ${alg.complexity}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}
