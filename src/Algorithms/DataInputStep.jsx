import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';

export default function DataInputStep() {
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const validateData = (data) => {
    return data.split(',').every(item => !isNaN(item.trim()));
  };

  const handleSubmit = () => {
    if (validateData(input)) {
      navigate('/select-algorithm', { 
        state: { data: input.split(',').map(Number) } 
      });
    } else {
      navigate('/algorithms/error');
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 500, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Enter Algorithm Input
      </Typography>
      <TextField
        fullWidth
        label="Enter data (comma-separated)"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Example: 12, 45, 78, 23, 56"
        sx={{ my: 2 }}
      />
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        <strong>Example Input:</strong> 10, 20, 30, 40, 50  
      </Typography>
      <Button variant="contained" onClick={handleSubmit}>
        Next
      </Button>
    </Box>
  );
}
