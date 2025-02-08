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

export default function QuickSortVisualization() {
  // States for input, visualization steps, and sorting status
  const [inputArray, setInputArray] = useState('');
  const [steps, setSteps] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [sortedArray, setSortedArray] = useState(null);
  const [inputFormat, setInputFormat] = useState('normal'); // "normal", "json", or "csv"
  const [fileContent, setFileContent] = useState(null);

  // Handle file upload for non‑normal formats
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      setInputArray(content);
      if (file.type === 'application/json') {
        setInputFormat('json');
      } else if (file.type === 'text/csv') {
        setInputFormat('csv');
      }
    };
    reader.readAsText(file);
  };

  // Validate input and parse it based on the selected format.
  // The array should contain alphanumeric values (numbers, characters, or strings).
  const validateInput = () => {
    let arr = [];
    if (inputFormat === 'normal') {
      arr = inputArray.split(',').map(item => item.trim());
    } else if (inputFormat === 'json') {
      try {
        arr = JSON.parse(inputArray);
        if (!Array.isArray(arr)) throw new Error();
      } catch (error) {
        alert('Invalid JSON format.');
        return false;
      }
    } else if (inputFormat === 'csv') {
      try {
        const parsed = Papa.parse(inputArray, { skipEmptyLines: true });
        arr = parsed.data.flat();
      } catch (error) {
        alert('Invalid CSV format.');
        return false;
      }
    }
    if (arr.some(item => !item || !/^[a-zA-Z0-9]+$/.test(item))) {
      alert('Please enter a valid array with numbers, characters, or strings.');
      return false;
    }
    return arr;
  };

  // QuickSort algorithm with recursive partitioning.
  // For every partition, a step is recorded that shows:
  // - The pivot chosen and its new index
  // - The left partition (elements before the pivot)
  // - The right partition (elements after the pivot)
  const quickSort = async () => {
    const arrInput = validateInput();
    if (!arrInput) return;

    setIsRunning(true);
    setSteps([]);
    setSortedArray(null);

    let arr = [...arrInput]; // make a copy so as not to mutate the original input
    let stepsArr = [];

    // Partition function that reorders the subarray and returns pivot index.
    const partition = (arr, low, high) => {
      let pivot = arr[high];
      let i = low - 1;
      for (let j = low; j <= high - 1; j++) {
        if (arr[j] <= pivot) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
      }
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      return i + 1;
    };

    // Recursive QuickSort with delay for visualization.
    const recursiveQuickSort = async (arr, low, high) => {
      if (low < high) {
        let pi = partition(arr, low, high);
        const pivot = arr[pi];
        const leftPartition = arr.slice(low, pi);
        const rightPartition = arr.slice(pi + 1, high + 1);

        // Record this partitioning step.
        const stepData = {
          step: `Pivot ${pivot} placed at index ${pi}`,
          arrayState: [...arr],
          pivot,
          pivotIndex: pi,
          leftPartition,
          rightPartition,
          range: { low, high }
        };
        stepsArr.push(stepData);
        setSteps(prev => [...prev, stepData]);
        // Wait a bit before recursing further.
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Recursively sort left and right partitions.
        await recursiveQuickSort(arr, low, pi - 1);
        await recursiveQuickSort(arr, pi + 1, high);
      }
    };

    await recursiveQuickSort(arr, 0, arr.length - 1);
    setSortedArray(arr);
    setIsRunning(false);
  };

  // Save the visualization area as a PDF using html2canvas and jsPDF.
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
          position -= pdfHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pdfHeight;
        }
      }
      pdf.save('quick_sort_visualization.pdf');
    } catch (error) {
      console.error("Error generating PDF", error);
      alert("An error occurred while generating the PDF.");
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      {/* AppBar with title and Download PDF button */}
      <AppBar position="static" sx={{ mb: 3, backgroundColor: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            QuickSort Visualization
          </Typography>
          <Button color="inherit" startIcon={<PictureAsPdfIcon />} onClick={handleDownloadPDF}>
            Download PDF
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 800, margin: 'auto' }}>
        <Typography variant="h4" gutterBottom align="center">
          QuickSort Algorithm
        </Typography>
        <Grid container spacing={2}>
          {/* Input Format Selector */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined">
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
                value={inputArray}
                onChange={(e) => setInputArray(e.target.value)}
                margin="normal"
              />
            </Grid>
          )}
          {/* Start Sorting Button */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={quickSort}
              disabled={isRunning}
              fullWidth
              sx={{ marginTop: 2 }}
            >
              {isRunning ? 'Sorting...' : 'Start Sorting'}
            </Button>
          </Grid>
        </Grid>

        {/* Visualization Card */}
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
                      {step.step} (Range: {step.range.low} - {step.range.high})
                    </Typography>
                    <Grid container justifyContent="center" spacing={2} sx={{ mt: 2 }}>
                      {step.arrayState.map((item, idx) => {
                        // Color-code the pivot, left partition, and right partition
                        let bgColor = 'white';
                        if (item === step.pivot && idx === step.pivotIndex) {
                          bgColor = 'lightgreen';
                        } else if (step.leftPartition.includes(item)) {
                          bgColor = 'lightblue';
                        } else if (step.rightPartition.includes(item)) {
                          bgColor = 'lightcoral';
                        }
                        return (
                          <Grid item key={idx}>
                            <motion.div
                              animate={{ scale: 1.1 }}
                              transition={{ duration: 0.3 }}
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
                                backgroundColor: bgColor,
                              }}
                            >
                              {item}
                            </motion.div>
                          </Grid>
                        );
                      })}
                    </Grid>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      Left Partition: {step.leftPartition.join(', ') || 'None'} | Right Partition: {step.rightPartition.join(', ') || 'None'}
                    </Typography>
                  </motion.div>
                ))}
              </>
            ) : (
              <Typography variant="body1" align="center">
                Visualization steps will appear here.
              </Typography>
            )}
            <Typography variant="h6" align="center" sx={{ mt: 4 }}>
              {sortedArray ? `Sorted Array: ${sortedArray.join(', ')}` : 'Sorting in progress...'}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
