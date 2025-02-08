import React, { useState } from 'react';
import { TextField, Button, Grid } from '@mui/material';
import { useAppContext } from '../context/AppContext';

export default function ManualInput() {
  const { updateInputData } = useAppContext();
  const [rows, setRows] = useState([{ value: '', category: '' }]);

  const handleAddRow = () => {
    setRows([...rows, { value: '', category: '' }]);
  };

  const handleChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  const handleSubmit = () => {
    // Ensure that all rows have valid data before submitting
    if (rows.some(row => !row.value || !row.category)) {
      alert("Please fill in all fields.");
      return;
    }
    updateInputData(rows);  // Update the context with the input data
    alert("Data successfully submitted!");
  };

  return (
    <div>
      {rows.map((row, index) => (
        <Grid container spacing={2} key={index}>
          <Grid item xs={6}>
            <TextField
              label="Value"
              value={row.value}
              onChange={(e) => handleChange(index, 'value', e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Category"
              value={row.category}
              onChange={(e) => handleChange(index, 'category', e.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>
      ))}
      <Button variant="contained" onClick={handleAddRow}>Add Row</Button>
      <Button variant="contained" color="primary" onClick={handleSubmit}>Submit Data</Button>
    </div>
  );
}
