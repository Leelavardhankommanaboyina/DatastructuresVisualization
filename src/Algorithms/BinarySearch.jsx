import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { motion } from 'framer-motion';
import Papa from 'papaparse';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { PictureAsPdf as PictureAsPdfIcon } from '@mui/icons-material';

export default function BinarySearch() {
  // States for inputs, steps and configuration
  const [array, setArray] = useState('');
  const [target, setTarget] = useState('');
  const [steps, setSteps] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [foundIndex, setFoundIndex] = useState(null);
  const [timeComplexity, setTimeComplexity] = useState('');
  const [inputFormat, setInputFormat] = useState('normal'); // normal, json, csv
  const [targetFormat, setTargetFormat] = useState('normal'); // normal, json, csv
  const [fileContent, setFileContent] = useState(null);
  const [targetFileContent, setTargetFileContent] = useState(null);

  // Handle file uploads for the array input
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

  // Handle file uploads for the target input
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

  // Validate and parse the input according to the chosen format
  const validateInput = () => {
    let arr = [];
    let targetValue = null;
    try {
      if (inputFormat === 'normal') {
        arr = array.split(',').map(item => item.trim()).filter(item => item !== '');
      } else if (inputFormat === 'json') {
        arr = JSON.parse(fileContent);
        if (!Array.isArray(arr)) throw new Error();
      } else if (inputFormat === 'csv') {
        const parsed = Papa.parse(fileContent, { skipEmptyLines: true });
        arr = parsed.data.flat();
      }
      // Convert to numbers
      arr = arr.map(Number);
      if (arr.some(isNaN)) {
        alert("Please enter valid numbers in the array.");
        return false;
      }
      if (targetFormat === 'normal') {
        if (target.trim() === '') throw new Error();
        targetValue = Number(target);
      } else if (targetFormat === 'json') {
        targetValue = JSON.parse(targetFileContent);
        if (Array.isArray(targetValue)) {
          if (targetValue.length !== 1) {
            alert("Target JSON should contain a single value.");
            return false;
          }
          targetValue = Number(targetValue[0]);
        } else {
          targetValue = Number(targetValue);
        }
      } else if (targetFormat === 'csv') {
        const parsed = Papa.parse(targetFileContent, { skipEmptyLines: true });
        let tArr = parsed.data.flat();
        if (tArr.length !== 1) {
          alert("Target CSV must contain only one value.");
          return false;
        }
        targetValue = Number(tArr[0]);
      }
      if (isNaN(targetValue)) {
        alert("Please enter a valid target number.");
        return false;
      }
      return { arr, targetValue };
    } catch (error) {
      alert("Invalid input format.");
      return false;
    }
  };

  // The recursive binary search function (with delays for visualization)
  const binarySearchRecursive = async (arr, x, left, right, stepsArr) => {
    if (left > right) {
      stepsArr.push({
        step: `Target not found in the array.`,
        arrayState: [...arr],
        left,
        mid: null,
        right
      });
      setSteps([...stepsArr]);
      setTimeComplexity('O(log n) - Binary search has a time complexity of O(log n), where n is the array size.');
      setIsRunning(false);
      return;
    }
    let mid = Math.floor((left + right) / 2);
    let step = {
      step: `Checking middle index ${mid} (value: ${arr[mid]})`,
      arrayState: [...arr],
      left,
      mid,
      right
    };
    if (arr[mid] === x) {
      step.step += ` => Target found at index ${mid}!`;
      stepsArr.push(step);
      setSteps([...stepsArr]);
      setFoundIndex(mid);
      setTimeComplexity('O(log n) - Binary search has a time complexity of O(log n), where n is the array size.');
      setIsRunning(false);
      return;
    }
    if (arr[mid] < x) {
      step.step += ` => Discarding left half.`;
      stepsArr.push(step);
      setSteps([...stepsArr]);
      await new Promise(resolve => setTimeout(resolve, 1500));
      binarySearchRecursive(arr, x, mid + 1, right, stepsArr);
    } else {
      step.step += ` => Discarding right half.`;
      stepsArr.push(step);
      setSteps([...stepsArr]);
      await new Promise(resolve => setTimeout(resolve, 1500));
      binarySearchRecursive(arr, x, left, mid - 1, stepsArr);
    }
  };

  // Initiate the search after validating inputs
  const startSearch = () => {
    const validation = validateInput();
    if (!validation) return;
    const { arr, targetValue } = validation;
    const sortedArr = [...arr].sort((a, b) => a - b);
    setIsRunning(true);
    setSteps([]);
    setFoundIndex(null);
    let stepsArr = [];
    binarySearchRecursive(sortedArr, targetValue, 0, sortedArr.length - 1, stepsArr);
  };

  // Generate a PDF of the visualization steps using html2canvas and jsPDF
  const handleDownloadPDF = async () => {
    const element = document.getElementById('visualization');
    if (!element) {
      alert("Visualization not found!");
      return;
    }
    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      if (imgHeight > pdfHeight) {
        let heightLeft = imgHeight - pdfHeight;
        while (heightLeft > 0) {
          position = position - pdfHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pdfHeight;
        }
      }
      pdf.save('binary_search_visualization.pdf');
    } catch (error) {
      console.error("Error generating PDF", error);
      alert("An error occurred while generating the PDF.");
    }
  };

  // Helper function to render pointer labels (L, M, R) for each index
  const renderPointers = (idx, left, mid, right) => {
    const pointers = [];
    if (idx === left) {
      pointers.push(
        <Typography key="L" variant="caption" color="secondary" sx={{ position: 'absolute', top: -20, left: 0 }}>
          L
        </Typography>
      );
    }
    if (idx === mid) {
      pointers.push(
        <Typography key="M" variant="caption" color="primary" sx={{ position: 'absolute', top: -40, left: 0 }}>
          M
        </Typography>
      );
    }
    if (idx === right) {
      pointers.push(
        <Typography key="R" variant="caption" color="error" sx={{ position: 'absolute', top: -20, right: 0 }}>
          R
        </Typography>
      );
    }
    return pointers;
  };

  return (
    <Box sx={{ padding: 3 }}>
      {/* AppBar with title and Download PDF button */}
      <AppBar position="static" sx={{ mb: 3, backgroundColor: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Binary Search Visualization
          </Typography>
          <Button color="inherit" startIcon={<PictureAsPdfIcon />} onClick={handleDownloadPDF}>
            Download PDF
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 800, margin: 'auto' }}>
        <Typography variant="h4" gutterBottom align="center">
          Binary Search Algorithm
        </Typography>
        <Grid container spacing={2}>
          {/* Array input format selection and input */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Array Input Format</InputLabel>
              <Select
                value={inputFormat}
                onChange={(e) => setInputFormat(e.target.value)}
                label="Array Input Format"
              >
                <MenuItem value="normal">Normal (Comma Separated)</MenuItem>
                <MenuItem value="json">JSON</MenuItem>
                <MenuItem value="csv">CSV</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {inputFormat !== 'normal' && (
            <Grid item xs={12} md={6}>
              <Button variant="contained" component="label" fullWidth>
                Upload Array File
                <input type="file" accept=".json,.csv" hidden onChange={handleFileUpload} />
              </Button>
            </Grid>
          )}
          {inputFormat === 'normal' && (
            <Grid item xs={12}>
              <TextField
                label="Array (comma separated)"
                variant="outlined"
                fullWidth
                value={array}
                onChange={(e) => setArray(e.target.value)}
                margin="normal"
              />
            </Grid>
          )}

          {/* Target input format selection and input */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Target Input Format</InputLabel>
              <Select
                value={targetFormat}
                onChange={(e) => setTargetFormat(e.target.value)}
                label="Target Input Format"
              >
                <MenuItem value="normal">Normal</MenuItem>
                <MenuItem value="json">JSON</MenuItem>
                <MenuItem value="csv">CSV</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {targetFormat !== 'normal' && (
            <Grid item xs={12} md={6}>
              <Button variant="contained" component="label" fullWidth>
                Upload Target File
                <input type="file" accept=".json,.csv" hidden onChange={handleTargetFileUpload} />
              </Button>
            </Grid>
          )}
          {targetFormat === 'normal' && (
            <Grid item xs={12}>
              <TextField
                label="Target Value"
                variant="outlined"
                fullWidth
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                margin="normal"
              />
            </Grid>
          )}

          {/* Start Search Button */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={startSearch}
              disabled={isRunning}
              fullWidth
              sx={{ marginTop: 2 }}
            >
              {isRunning ? 'Searching...' : 'Start Search'}
            </Button>
          </Grid>
        </Grid>

        {/* Visualization Area */}
        <Card id="visualization" sx={{ mt: 4, mb: 4, boxShadow: 3 }}>
          <CardContent>
            {steps.length > 0 ? (
              <>
                <Typography variant="h6" gutterBottom>
                  Steps:
                </Typography>
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.5 }}
                  >
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      {step.step}
                    </Typography>
                    <Box sx={{ position: 'relative', marginTop: 2 }}>
                      <Grid container justifyContent="center" spacing={2}>
                        {step.arrayState.map((item, idx) => (
                          <Grid item key={idx} sx={{ position: 'relative' }}>
                            <motion.div
                              animate={{
                                scale: step.mid === idx ? 1.3 : 1,
                                backgroundColor: step.mid === idx ? 'lightblue' : 'white'
                              }}
                              style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: 50,
                                height: 50,
                                borderRadius: '10px',
                                border: '2px solid #000',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                position: 'relative'
                              }}
                            >
                              {item}
                            </motion.div>
                            {renderPointers(idx, step.left, step.mid, step.right)}
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  </motion.div>
                ))}
              </>
            ) : (
              <Typography variant="body1" align="center">
                Visualization steps will appear here.
              </Typography>
            )}
            <Typography variant="h6" align="center" sx={{ mt: 4 }}>
              {foundIndex !== null ? `Target found at index ${foundIndex}` : 'Target not found'}
            </Typography>
            <Typography variant="body1" align="center" sx={{ mt: 2 }}>
              {timeComplexity}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
