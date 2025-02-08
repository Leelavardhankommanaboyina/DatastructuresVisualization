import { useState } from 'react';
import { TextField, Button, Typography, Box, Grid, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { motion } from 'framer-motion';
import Papa from 'papaparse';

export default function LinearSearch() {
  const [array, setArray] = useState('');
  const [target, setTarget] = useState('');
  const [steps, setSteps] = useState([]);
  const [found, setFound] = useState(false);
  const [timeComplexity, setTimeComplexity] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(null);
  const [foundIndex, setFoundIndex] = useState(null);
  const [inputFormat, setInputFormat] = useState('normal'); // To select input format (normal, json, csv)
  const [targetFormat, setTargetFormat] = useState('normal'); // To select target format
  const [fileContent, setFileContent] = useState(null);
  const [targetFileContent, setTargetFileContent] = useState(null);

  // Handle file upload for array
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      setFileContent(content);
      if (file.type === 'application/json') {
        setInputFormat('json');
      } else if (file.type === 'text/csv') {
        setInputFormat('csv');
      }
    };
    reader.readAsText(file);
  };

  // Handle file upload for target
  const handleTargetFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      setTargetFileContent(content);
      if (file.type === 'application/json') {
        setTargetFormat('json');
      } else if (file.type === 'text/csv') {
        setTargetFormat('csv');
      }
    };
    reader.readAsText(file);
  };

  const validateInput = () => {
    let arr = [];
    if (inputFormat === 'normal') {
      arr = array.split(',').map(item => item.trim());
    } else if (inputFormat === 'json') {
      try {
        arr = JSON.parse(fileContent);
        if (!Array.isArray(arr)) throw new Error();
      } catch (error) {
        alert('Invalid JSON format for array.');
        return false;
      }
    } else if (inputFormat === 'csv') {
      try {
        const parsed = Papa.parse(fileContent, { skipEmptyLines: true });
        arr = parsed.data.flat();
        if (arr.some(item => item === '')) {
          throw new Error();
        }
      } catch (error) {
        alert('Invalid CSV format for array.');
        return false;
      }
    }

    let targetValue = target;
    if (targetFormat === 'json') {
      try {
        targetValue = JSON.parse(targetFileContent);
        if (!Array.isArray(targetValue)) throw new Error();
      } catch (error) {
        alert('Invalid JSON format for target.');
        return false;
      }
    } else if (targetFormat === 'csv') {
      try {
        const parsed = Papa.parse(targetFileContent, { skipEmptyLines: true });
        targetValue = parsed.data.flat();
        if (targetValue.length !== 1) throw new Error('CSV for target must contain only one value.');
      } catch (error) {
        alert('Invalid CSV format for target.');
        return false;
      }
    }

    if (targetFormat === 'normal' && !targetValue) {
      alert("Please enter a valid target value.");
      return false;
    }

    if (arr.some(item => item === '')) {
      alert("Please enter valid elements in the array.");
      return false;
    }

    return true;
  };

  const linearSearch = async () => {
    if (!validateInput()) return;
    setIsRunning(true);
    setSteps([]);
    setHighlightIndex(null);
    setFoundIndex(null);

    // Parse the array based on selected format
    let arr = [];
    if (inputFormat === 'normal') {
      arr = array.split(',').map(item => item.trim());
    } else if (inputFormat === 'json') {
      arr = JSON.parse(fileContent);
    } else if (inputFormat === 'csv') {
      const parsed = Papa.parse(fileContent, { skipEmptyLines: true });
      arr = parsed.data.flat();
    }

    // Parse the target based on selected format
    let targetValue = target;
    if (targetFormat === 'json') {
      targetValue = JSON.parse(targetFileContent);
    } else if (targetFormat === 'csv') {
      const parsed = Papa.parse(targetFileContent, { skipEmptyLines: true });
      targetValue = parsed.data.flat()[0];
    }

    let stepsArr = [];
    let foundIndex = -1;

    for (let i = 0; i < arr.length; i++) {
      setHighlightIndex(i);
      stepsArr.push({ step: `Checking index ${i}: ${arr[i]}`, arrayState: [...arr], highlightIndex: i });
      setSteps([...stepsArr]);
      await new Promise(resolve => setTimeout(resolve, 800));

      if (arr[i] === targetValue) {
        foundIndex = i;
        setFoundIndex(i);
        stepsArr.push({ step: `Target found at index ${i}`, arrayState: [...arr], highlightIndex: null, targetFound: true });
        setSteps([...stepsArr]);
        setFound(true);
        break;
      }
    }

    if (foundIndex === -1) {
      stepsArr.push({ step: 'Target not found', arrayState: arr, highlightIndex: null, targetFound: false });
      setSteps([...stepsArr]);
      setFound(false);
    }

    setTimeComplexity('O(n) - Linear search has a time complexity of O(n), where n is the array size.');
    setIsRunning(false);
  };

  return (
    <Box sx={{ padding: 2, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>Linear Search Algorithm</Typography>

      <FormControl fullWidth variant="outlined" sx={{ marginBottom: 2 }}>
        <InputLabel>Input Format</InputLabel>
        <Select
          value={inputFormat}
          onChange={(e) => setInputFormat(e.target.value)}
          label="Input Format"
        >
          <MenuItem value="normal">Normal (Comma Separated)</MenuItem>
          <MenuItem value="json">JSON</MenuItem>
          <MenuItem value="csv">CSV</MenuItem>
        </Select>
      </FormControl>

      {/* Display file upload button and input fields only based on the selected input format */}
      {inputFormat !== 'normal' && (
        <Button variant="contained" component="label" sx={{ marginTop: 2 }}>
          Upload Array File
          <input type="file" accept=".json,.csv" hidden onChange={handleFileUpload} />
        </Button>
      )}

      {inputFormat === 'normal' && (
        <TextField 
          label="Array" 
          variant="outlined" 
          fullWidth 
          value={array} 
          onChange={(e) => setArray(e.target.value)} 
          margin="normal" 
          multiline
          rows={4}
          sx={{ maxWidth: 400, margin: 'auto' }} // Compact size for normal input
        />
      )}

      {/* Target format selector */}
      <FormControl fullWidth variant="outlined" sx={{ marginTop: 2, marginBottom: 2 }}>
        <InputLabel>Target Format</InputLabel>
        <Select
          value={targetFormat}
          onChange={(e) => setTargetFormat(e.target.value)}
          label="Target Format"
        >
          <MenuItem value="normal">Normal</MenuItem>
          <MenuItem value="json">JSON</MenuItem>
          <MenuItem value="csv">CSV</MenuItem>
        </Select>
      </FormControl>

      {/* Display file upload button and input fields only based on the selected target format */}
      {targetFormat !== 'normal' && (
        <Button variant="contained" component="label" sx={{ marginTop: 2 }}>
          Upload Target File
          <input type="file" accept=".json,.csv" hidden onChange={handleTargetFileUpload} />
        </Button>
      )}

      {targetFormat === 'normal' && (
        <TextField 
          label="Target Value" 
          variant="outlined" 
          fullWidth 
          value={target} 
          onChange={(e) => setTarget(e.target.value)} 
          margin="normal" 
          sx={{ maxWidth: 400, margin: 'auto' }} // Compact size for normal input
        />
      )}

      <Button variant="contained" color="primary" onClick={linearSearch} disabled={isRunning} sx={{ marginTop: 2 }}>
        {isRunning ? 'Searching...' : 'Start Search'}
      </Button>

      <Box sx={{ marginTop: 4 }}>
        {steps.length > 0 && (
          <>
            <Typography variant="h6">Steps:</Typography>
            {steps.map((step, index) => (
              <motion.div key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.5 }}>
                <Typography>{step.step}</Typography>
                <Grid container justifyContent="center" spacing={1} sx={{ marginTop: 2 }}>
                  {step.arrayState.map((item, idx) => (
                    <Grid item key={idx}>
                      <motion.div
                        animate={{
                          scale: step.highlightIndex === idx ? 1.3 : 1,
                          backgroundColor: foundIndex === idx && step.highlightIndex === null ? 'lightgreen' : step.highlightIndex === idx ? 'lightblue' : 'white',
                        }}
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: 50,
                          height: 50,
                          borderRadius: '10px',
                          border: '2px solid black',
                          fontSize: '18px',
                          fontWeight: 'bold',
                        }}
                      >
                        {item}
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            ))}
          </>
        )}

        <Typography variant="h6" sx={{ marginTop: 4 }}>
          {found ? `Target found at index ${foundIndex}` : 'Target not found'}
        </Typography>
        <Typography variant="body1" sx={{ marginTop: 2 }}>{timeComplexity}</Typography>
      </Box>
    </Box>
  );
}
