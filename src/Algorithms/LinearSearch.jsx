import { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Card,
  CardContent,
  AppBar,
  Toolbar
} from '@mui/material';
import { Save as SaveIcon, PictureAsPdf as PictureAsPdfIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Papa from 'papaparse';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export default function LinearSearch() {
  const [array, setArray] = useState('');
  const [target, setTarget] = useState('');
  const [steps, setSteps] = useState([]);
  const [found, setFound] = useState(false);
  const [timeComplexity, setTimeComplexity] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(null);
  const [foundIndex, setFoundIndex] = useState(null);
  const [inputFormat, setInputFormat] = useState('normal'); // "normal", "json", "csv"
  const [targetFormat, setTargetFormat] = useState('normal'); // "normal", "json", "csv"
  const [fileContent, setFileContent] = useState(null);
  const [targetFileContent, setTargetFileContent] = useState(null);

  // For saved visualizations
  const [savedVisualizations, setSavedVisualizations] = useState([]);

  // Load saved visualizations from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedVisualizations');
    if (saved) {
      setSavedVisualizations(JSON.parse(saved));
    }
  }, []);

  // Save current visualization to localStorage
  const handleSaveVisualization = () => {
    const visualization = {
      timestamp: new Date().toISOString(),
      steps,
      found,
      foundIndex,
      timeComplexity,
      array,
      target
    };
    const updated = [...savedVisualizations, visualization];
    setSavedVisualizations(updated);
    localStorage.setItem('savedVisualizations', JSON.stringify(updated));
    alert('Visualization saved!');
  };

  // Function to download the visualization as a PDF
  const handleDownloadPDF = async () => {
    const element = document.getElementById('visualization');
    if (!element) {
      alert("Visualization not found!");
      return;
    }
    try {
      // Use html2canvas to capture the visualization element
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Calculate the image dimensions to maintain aspect ratio
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      // If the captured image height is larger than the page height, add multiple pages
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
      pdf.save('visualization.pdf');
    } catch (error) {
      console.error("Error generating PDF", error);
      alert("An error occurred while generating the PDF.");
    }
  };

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
    let arr = [];
    if (inputFormat === 'normal') {
      arr = array.split(',').map(item => item.trim());
    } else if (inputFormat === 'json') {
      arr = JSON.parse(fileContent);
    } else if (inputFormat === 'csv') {
      const parsed = Papa.parse(fileContent, { skipEmptyLines: true });
      arr = parsed.data.flat();
    }
    let targetValue = target;
    if (targetFormat === 'json') {
      targetValue = JSON.parse(targetFileContent);
    } else if (targetFormat === 'csv') {
      const parsed = Papa.parse(targetFileContent, { skipEmptyLines: true });
      targetValue = parsed.data.flat()[0];
    }
    let stepsArr = [];
    let foundIdx = -1;
    for (let i = 0; i < arr.length; i++) {
      setHighlightIndex(i);
      stepsArr.push({ step: `Checking index ${i}: ${arr[i]}`, arrayState: [...arr], highlightIndex: i });
      setSteps([...stepsArr]);
      await new Promise(resolve => setTimeout(resolve, 800));
      if (arr[i] === targetValue) {
        foundIdx = i;
        setFoundIndex(i);
        stepsArr.push({ step: `Target found at index ${i}`, arrayState: [...arr], highlightIndex: null, targetFound: true });
        setSteps([...stepsArr]);
        setFound(true);
        break;
      }
    }
    if (foundIdx === -1) {
      stepsArr.push({ step: 'Target not found', arrayState: arr, highlightIndex: null, targetFound: false });
      setSteps([...stepsArr]);
      setFound(false);
    }
    setTimeComplexity('O(n) - Linear search has a time complexity of O(n), where n is the array size.');
    setIsRunning(false);
  };

  return (
    <Box sx={{ padding: 3 }}>
      {/* AppBar with Save Visualization and Download PDF buttons */}
      <AppBar position="static" sx={{ mb: 3, backgroundColor: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Linear Search Visualization
          </Typography>
          <Button color="inherit" startIcon={<SaveIcon />} onClick={handleSaveVisualization}>
            Save Visualization
          </Button>
          <Button color="inherit" startIcon={<PictureAsPdfIcon />} onClick={handleDownloadPDF}>
            Download PDF
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 800, margin: 'auto' }}>
        <Typography variant="h4" gutterBottom align="center">
          Linear Search Algorithm
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
                label="Array" 
                variant="outlined" 
                fullWidth 
                value={array} 
                onChange={(e) => setArray(e.target.value)} 
                margin="normal" 
                multiline
                rows={4}
              />
            </Grid>
          )}

          {/* Target Format Selector */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined">
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
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={linearSearch} disabled={isRunning} fullWidth>
              {isRunning ? 'Searching...' : 'Start Search'}
            </Button>
          </Grid>
        </Grid>

        {/* Visualization Card (with an id to target for PDF conversion) */}
        <Card id="visualization" sx={{ mt: 4, mb: 4, boxShadow: 3 }}>
          <CardContent>
            {steps.length > 0 ? (
              <>
                <Typography variant="h6" gutterBottom>
                  Steps:
                </Typography>
                {steps.map((step, index) => (
                  <motion.div key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.5 }}>
                    <Typography variant="body1">{step.step}</Typography>
                    <Grid container justifyContent="center" spacing={1} sx={{ mt: 2, mb: 2 }}>
                      {step.arrayState.map((item, idx) => (
                        <Grid item key={idx}>
                          <motion.div
                            animate={{
                              scale: step.highlightIndex === idx ? 1.3 : 1,
                              backgroundColor:
                                foundIndex === idx && step.highlightIndex === null
                                  ? 'lightgreen'
                                  : step.highlightIndex === idx
                                  ? 'lightblue'
                                  : '#fff',
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
                              padding: '4px'
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
            ) : (
              <Typography variant="body1" align="center">
                Visualization steps will appear here.
              </Typography>
            )}
            <Typography variant="h6" align="center" sx={{ mt: 2 }}>
              {found ? `Target found at index ${foundIndex}` : 'Target not found'}
            </Typography>
            <Typography variant="body2" align="center" sx={{ mt: 1 }}>
              {timeComplexity}
            </Typography>
          </CardContent>
        </Card>

        {/* Saved Visualizations Card */}
        {savedVisualizations.length > 0 && (
          <Card sx={{ mt: 4, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Saved Visualizations
              </Typography>
              {savedVisualizations.map((viz, index) => (
                <Box key={index} sx={{ p: 1, borderBottom: '1px solid #ccc' }}>
                  <Typography variant="body2">
                    Saved on: {new Date(viz.timestamp).toLocaleString()}
                  </Typography>
                  <Typography variant="body2">
                    Steps Count: {viz.steps.length}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
}
