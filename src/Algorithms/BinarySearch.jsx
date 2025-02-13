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
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CodeIcon from '@mui/icons-material/Code';
import DesktopMacIcon from '@mui/icons-material/DesktopMac';
import { motion } from 'framer-motion';
import Papa from 'papaparse';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export default function BinarySearch() {
  // Data states
  const [array, setArray] = useState('');
  const [target, setTarget] = useState('');
  const [steps, setSteps] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [foundIndex, setFoundIndex] = useState(null);
  const [timeComplexity, setTimeComplexity] = useState('');

  // Input format states
  const [inputFormat, setInputFormat] = useState('normal');
  const [targetFormat, setTargetFormat] = useState('normal');
  const [fileContent, setFileContent] = useState(null);
  const [targetFileContent, setTargetFileContent] = useState(null);
  const [uploadingArray, setUploadingArray] = useState(false);
  const [uploadedArrayFileName, setUploadedArrayFileName] = useState('');
  const [uploadingTarget, setUploadingTarget] = useState(false);
  const [uploadedTargetFileName, setUploadedTargetFileName] = useState('');

  // Dynamic code panel state
  const [showCodePanel, setShowCodePanel] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState('javascript');

  const codeSnippets = {
    javascript: `// JavaScript Implementation of Binary Search
function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
    java: `// Java Implementation of Binary Search
public class BinarySearch {
  public static int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left <= right) {
      int mid = (left + right) / 2;
      if (arr[mid] == target) return mid;
      if (arr[mid] < target) left = mid + 1;
      else right = mid - 1;
    }
    return -1;
  }
}`,
    python: `# Python Implementation of Binary Search
def binary_search(arr, target):
    left, right = 0, len(arr)-1
    while left <= right:
        mid = (left+right)//2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
    cpp: `// C++ Implementation of Binary Search
#include <iostream>
#include <vector>
using namespace std;

int binarySearch(const vector<int>& arr, int target) {
  int left = 0, right = arr.size() - 1;
  while (left <= right) {
    int mid = (left + right) / 2;
    if (arr[mid] == target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`
  };

  // File upload handlers with animation & feedback
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingArray(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setFileContent(ev.target.result);
      setUploadedArrayFileName(file.name);
      setUploadingArray(false);
      if (file.type === 'application/json') setInputFormat('json');
      else if (file.type === 'text/csv') setInputFormat('csv');
    };
    reader.readAsText(file);
  };

  const handleTargetFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingTarget(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setTargetFileContent(ev.target.result);
      setUploadedTargetFileName(file.name);
      setUploadingTarget(false);
      if (file.type === 'application/json') setTargetFormat('json');
      else if (file.type === 'text/csv') setTargetFormat('csv');
    };
    reader.readAsText(file);
  };

  const validateInput = () => {
    let arr = [];
    let targetValue;
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
      arr = arr.map(Number);
      if (arr.some(isNaN)) {
        alert("Invalid array numbers.");
        return false;
      }
      if (targetFormat === 'normal') {
        if (!target.trim()) throw new Error();
        targetValue = Number(target);
      } else if (targetFormat === 'json') {
        let parsedTarget = JSON.parse(targetFileContent);
        if (Array.isArray(parsedTarget)) {
          if (parsedTarget.length !== 1) {
            alert("Target JSON must contain a single value.");
            return false;
          }
          targetValue = Number(parsedTarget[0]);
        } else {
          targetValue = Number(parsedTarget);
        }
      } else if (targetFormat === 'csv') {
        const parsed = Papa.parse(targetFileContent, { skipEmptyLines: true });
        let tArr = parsed.data.flat();
        if (tArr.length !== 1) {
          alert("Target CSV must contain a single value.");
          return false;
        }
        targetValue = Number(tArr[0]);
      }
      if (isNaN(targetValue)) {
        alert("Invalid target number.");
        return false;
      }
      return { arr, targetValue };
    } catch (err) {
      alert("Invalid input format.");
      return false;
    }
  };

  const binarySearchAlgo = async () => {
    setShowCodePanel(false);
    const validation = validateInput();
    if (!validation) return;
    setIsRunning(true);
    setSteps([]);
    setFoundIndex(null);
    let { arr, targetValue } = validation;
    arr.sort((a, b) => a - b);
    let left = 0, right = arr.length - 1;
    let stepsArr = [];
    let found = false;
    while (left <= right) {
      let mid = Math.floor((left + right) / 2);
      let step = {
        step: `Checking mid index ${mid} (value: ${arr[mid]})`,
        arrayState: [...arr],
        left,
        mid,
        right,
      };
      if (arr[mid] === targetValue) {
        step.step += ` => Target found at index ${mid}!`;
        step.targetFound = true;
        stepsArr.push(step);
        setSteps([...stepsArr]);
        setFoundIndex(mid);
        found = true;
        break;
      }
      if (arr[mid] < targetValue) {
        step.step += ` => Discarding left half.`;
        left = mid + 1;
      } else {
        step.step += ` => Discarding right half.`;
        right = mid - 1;
      }
      stepsArr.push(step);
      setSteps([...stepsArr]);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    if (!found) {
      const step = {
        step: 'Target not found',
        arrayState: arr,
        left,
        mid: null,
        right,
      };
      stepsArr.push(step);
      setSteps([...stepsArr]);
    }
    setTimeComplexity('O(log n) - Binary search has a time complexity of O(log n).');
    setIsRunning(false);
  };

  const handleSavePDF = async () => {
    const element = document.getElementById('visualization');
    if (!element) return;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('binary_search_visualization.pdf');
  };

  return (
    <Box sx={{ padding: 3 }}>
      <AppBar position="static" sx={{ mb: 3, backgroundColor: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Binary Search Visualization
          </Typography>
          <Button color="inherit" onClick={() => setShowCodePanel(prev => !prev)}>
            {showCodePanel ? (<><DesktopMacIcon sx={{ mr: 1 }} />Screen</>) : (<><CodeIcon sx={{ mr: 1 }} />Code</>)}
          </Button>
          <Button color="inherit" onClick={handleSavePDF}>
            Save Visualization
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ maxWidth: 800, margin: 'auto' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Binary Search Algorithm
        </Typography>
        {/* Array Input Row */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Array Format</InputLabel>
              <Select value={inputFormat} label="Array Format" onChange={(e) => setInputFormat(e.target.value)}>
                <MenuItem value="normal">Normal</MenuItem>
                <MenuItem value="json">JSON</MenuItem>
                <MenuItem value="csv">CSV</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={9}>
            {inputFormat === 'normal' ? (
              <TextField
                label="Array"
                variant="outlined"
                fullWidth
                size="small"
                value={array}
                onChange={(e) => setArray(e.target.value)}
               
              />
            ) : (
              <Box display="flex" alignItems="center" gap={2}>
                <Button variant="contained" component="label">
                  Upload Array File
                  <input type="file" accept=".json,.csv" hidden onChange={handleFileUpload} />
                </Button>
                {uploadingArray ? <CircularProgress size={24} /> : uploadedArrayFileName && <Typography variant="body2">{uploadedArrayFileName}</Typography>}
              </Box>
            )}
          </Grid>
        </Grid>
        {/* Target Input Row */}
        <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Target Format</InputLabel>
              <Select value={targetFormat} label="Target Format" onChange={(e) => setTargetFormat(e.target.value)}>
                <MenuItem value="normal">Normal</MenuItem>
                <MenuItem value="json">JSON</MenuItem>
                <MenuItem value="csv">CSV</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={9}>
            {targetFormat === 'normal' ? (
              <TextField
                label="Target Value"
                variant="outlined"
                fullWidth
                size="small"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                
              />
            ) : (
              <Box display="flex" alignItems="center" gap={2}>
                <Button variant="contained" component="label">
                  Upload Target File
                  <input type="file" accept=".json,.csv" hidden onChange={handleTargetFileUpload} />
                </Button>
                {uploadingTarget ? <CircularProgress size={24} /> : uploadedTargetFileName && <Typography variant="body2">{uploadedTargetFileName}</Typography>}
              </Box>
            )}
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button variant="contained" color="primary" onClick={binarySearchAlgo} disabled={isRunning} fullWidth>
            {isRunning ? 'Searching...' : 'Start Search'}
          </Button>
        </Box>
        <Card id="visualization" sx={{ mt: 4, mb: 4, boxShadow: 3 }}>
          <CardContent>
            {showCodePanel ? (
              <>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center' }}>
                  <Tabs value={codeLanguage} onChange={(e, newValue) => setCodeLanguage(newValue)} textColor="primary" indicatorColor="primary">
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
                      <motion.div key={index} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.5 }}>
                        <Card sx={{ padding: 2, marginBottom: 2 }}>
                          <Typography variant="subtitle1" color="primary">
                            {step.step}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {step.explanation}
                          </Typography>
                          <Grid container justifyContent="center" spacing={1} sx={{ mt: 2 }}>
                            {step.arrayState.map((item, idx) => (
                              <Grid item key={idx}>
                                <motion.div
                                  animate={{
                                    scale: step.targetFound
                                      ? (idx === foundIndex ? 1.3 : 1)
                                      : (step.highlightIndex === idx ? 1.3 : 1),
                                    backgroundColor: step.targetFound
                                      ? (idx === foundIndex ? 'lightgreen' : '#fff')
                                      : (step.highlightIndex === idx ? 'lightblue' : '#fff'),
                                  }}
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: 50,
                                    height: 50,
                                    borderRadius: '10px',
                                    border: '2px solid #333',
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                  }}
                                >
                                  {item}
                                </motion.div>
                              </Grid>
                            ))}
                          </Grid>
                        </Card>
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
                <Typography variant="body2" align="center" sx={{ mt: 2, color: '#555' }}>
                  {timeComplexity}
                </Typography>
              </>
            )}
          </CardContent>
        </Card>
        <Accordion sx={{ mt: 4 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Detailed Explanation</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Binary Search Algorithm:</strong>
            </Typography>
            <Typography variant="body2" paragraph>
              Binary search efficiently finds a target in a sorted array by repeatedly dividing the search space in half.
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>How It Works:</strong>
              <br />
              1. Start with the entire sorted array.
              <br />
              2. Calculate the middle index.
              <br />
              3. If the middle element equals the target, return the index.
              <br />
              4. Otherwise, discard the half in which the target cannot lie.
              <br />
              5. Repeat until the target is found or the array is exhausted.
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Time Complexity:</strong> O(log n) – because the search space is halved each time.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
}
