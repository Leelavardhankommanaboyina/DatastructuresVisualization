// ErrorPage.jsx
import { Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h4" color="error" sx={{ mb: 2 }}>
        Invalid Input Data
      </Typography>
      <Typography sx={{ mb: 3 }}>
        Please enter valid comma-separated numerical values
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate('data-input')}
      >
        Go Back
      </Button>
    </Box>
  );
}