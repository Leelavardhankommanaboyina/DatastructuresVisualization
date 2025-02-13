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
  MenuItem,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { motion } from 'framer-motion';
import Papa from 'papaparse';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { PictureAsPdf as PictureAsPdfIcon, DesktopMac as DesktopMacIcon, Code as CodeIcon } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function BubbleSortVisualization() {
  // States for input and visualization
  const [inputArray, setInputArray] = useState('');
  const [steps, setSteps] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [sortedArray, setSortedArray] = useState(null);
  const [inputFormat, setInputFormat] = useState('normal'); // Options: "normal", "json", "csv"
  const [fileContent, setFileContent] = useState(null);

  // New states for dynamic code panel
  const [showCodePanel, setShowCodePanel] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState('javascript');

  // Code snippets for Bubble Sort in various languages
  const codeSnippets = {
    javascript: `// JavaScript Implementation of Bubble Sort
function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`,
    java: `// Java Implementation of Bubble Sort
public void bubbleSort(int[] arr) {
  int n = arr.length;
  for (int i = 0; i < n - 1; i++) {
    for (int j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j+1]) {
        int temp = arr[j];
        arr[j] = arr[j+1];
        arr[j+1] = temp;
      }
    }
  }
}`,
    python: `# Python Implementation of Bubble Sort
def bubble_sort(arr):
    n = len(arr)
    for i in range(n-1):
        for j in range(n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr`,
    cpp: `// C++ Implementation of Bubble Sort
void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n-1; i++) {
        for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                swap(arr[j], arr[j+1]);
            }
        }
    }
}`
  };

  // Handle file upload for array input (JSON or CSV)
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

  // Validate the input and return an array if valid.
  // It supports a normal comma‑separated list, a JSON array, or CSV.
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
    // Validate: allow numbers, characters, or strings (alphanumeric only)
    if (arr.some(item => !item || !/^[a-zA-Z0-9]+$/.test(item))) {
      alert('Please enter a valid array with numbers, characters, or strings.');
      return false;
    }
    return arr;
  };

  // Bubble Sort algorithm with step-by-step recording and realistic animations.
  const bubbleSort = async () => {
    const arrOriginal = validateInput();
    if (!arrOriginal) return;
    setIsRunning(true);
    setSteps([]);
    setSortedArray(null);

    let arr = [...arrOriginal]; // copy to avoid mutating original
    let stepsArr = [];
    const n = arr.length;

    // Outer loop for Bubble Sort
    for (let i = 0; i < n - 1; i++) {
      // Inner loop for comparing adjacent items
      for (let j = 0; j < n - i - 1; j++) {
        let stepMessage = `Comparing ${arr[j]} and ${arr[j + 1]}`;
        let swapOccurred = false;

        // Swap if out of order
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          swapOccurred = true;
          stepMessage += ` => Swapped`;
        }

        // Record the current step
        const step = {
          step: stepMessage,
          arrayState: [...arr],
          compare: [j, j + 1],
          swap: swapOccurred,
        };

        stepsArr.push(step);
        setSteps([...stepsArr]);
        // Delay for visualization
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    setSortedArray(arr);
    setIsRunning(false);
  };

  // Generate a PDF of the visualization using html2canvas and jsPDF.
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
      pdf.save('bubble_sort_visualization.pdf');
    } catch (error) {
      console.error("Error generating PDF", error);
      alert("An error occurred while generating the PDF.");
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      {/* AppBar with title, code toggle, and Download PDF button */}
      <AppBar position="static" sx={{ mb: 3, backgroundColor: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Bubble Sort Visualization
          </Typography>
          <Button color="inherit" onClick={() => setShowCodePanel(prev => !prev)}>
            {showCodePanel ? (<><DesktopMacIcon sx={{ mr: 1 }} />Screen</>) : (<><CodeIcon sx={{ mr: 1 }} />Code</>)}
          </Button>
          <Button color="inherit" startIcon={<PictureAsPdfIcon />} onClick={handleDownloadPDF}>
            Save Visualization
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 800, margin: 'auto' }}>
        <Typography variant="h4" gutterBottom align="center">
          Bubble Sort Algorithm
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
              onClick={bubbleSort}
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
            {showCodePanel ? (
              <>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center' }}>
                  <Tabs
                    value={codeLanguage}
                    onChange={(e, newValue) => setCodeLanguage(newValue)}
                    textColor="primary"
                    indicatorColor="primary"
                  >
                    <Tab value="javascript" label="JavaScript" />
                    <Tab value="java" label="Java" />
                    <Tab value="python" label="Python" />
                    <Tab value="cpp" label="C++" />
                  </Tabs>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <pre style={{ backgroundColor: '#f5f5f5', padding: '16px', borderRadius: '4px', overflow: 'auto' }}>
                    {codeSnippets[codeLanguage]}
                  </pre>
                </Box>
              </>
            ) : (
              <>
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
                        <Grid container justifyContent="center" spacing={2} sx={{ mt: 2 }}>
                          {step.arrayState.map((item, idx) => (
                            <Grid item key={idx}>
                              <motion.div
                                animate={{
                                  // Highlight compared elements
                                  scale: step.compare.includes(idx) ? 1.3 : 1,
                                  backgroundColor: step.compare.includes(idx) ? 'lightblue' : 'white',
                                  y: step.compare.includes(idx) ? [0, -10, 0] : 0,
                                  x: step.swap && step.compare.includes(idx)
                                    ? (idx === step.compare[0] ? [-10, 10, 0] : [10, -10, 0])
                                    : 0,
                                }}
                                transition={{ duration: 0.5 }}
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
              </>
            )}
            <Typography variant="h6" align="center" sx={{ mt: 4 }}>
              {sortedArray ? `Sorted Array: ${sortedArray.join(', ')}` : 'Sorting in progress...'}
            </Typography>
          </CardContent>
        </Card>

        {/* Detailed Explanation Accordion */}
        <Accordion sx={{ mt: 4 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Detailed Explanation</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Bubble Sort Algorithm:</strong>
            </Typography>
            <Typography variant="body2" paragraph>
              Bubble Sort repeatedly steps through the list, comparing adjacent elements and swapping them if they are in the wrong order.
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>How It Works:</strong>
              <br />
              1. Compare adjacent elements.
              <br />
              2. Swap them if they are out of order.
              <br />
              3. Continue through the list.
              <br />
              4. Repeat until no swaps are needed.
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Time Complexity:</strong> O(n²) on average and in the worst case, though it can perform better (O(n)) if the array is already sorted.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
}
