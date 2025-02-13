import { useState, useRef } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AppBar,
  Toolbar,
  Tabs,
  Tab,
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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function InterpolationSearch() {
  // Data and algorithm states
  const [array, setArray] = useState('');
  const [target, setTarget] = useState('');
  const [steps, setSteps] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [foundIndex, setFoundIndex] = useState(null);
  const [timeComplexity, setTimeComplexity] = useState('');
  const containerRef = useRef(null);

  // Input format states
  const [inputFormat, setInputFormat] = useState('normal'); // normal, json, csv
  const [targetFormat, setTargetFormat] = useState('normal'); // normal, json, csv
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
    javascript: `// JavaScript Implementation of Interpolation Search
function interpolationSearch(arr, target) {
  let low = 0, high = arr.length - 1;
  while (low <= high && target >= arr[low] && target <= arr[high]) {
    let pos = low + Math.floor(((target - arr[low]) / (arr[high] - arr[low])) * (high - low));
    if (arr[pos] === target) return pos;
    if (arr[pos] < target) low = pos + 1;
    else high = pos - 1;
  }
  return -1;
}`,
    java: `// Java Implementation of Interpolation Search
public class InterpolationSearch {
  public static int interpolationSearch(int[] arr, int target) {
    int low = 0, high = arr.length - 1;
    while (low <= high && target >= arr[low] && target <= arr[high]) {
      int pos = low + ((target - arr[low]) * (high - low)) / (arr[high] - arr[low]);
      if (arr[pos] == target) return pos;
      if (arr[pos] < target) low = pos + 1;
      else high = pos - 1;
    }
    return -1;
  }
}`,
    python: `# Python Implementation of Interpolation Search
def interpolation_search(arr, target):
    low = 0
    high = len(arr) - 1
    while low <= high and target >= arr[low] and target <= arr[high]:
        pos = low + int(((target - arr[low]) / (arr[high] - arr[low])) * (high - low))
        if arr[pos] == target:
            return pos
        elif arr[pos] < target:
            low = pos + 1
        else:
            high = pos - 1
    return -1`,
    cpp: `// C++ Implementation of Interpolation Search
#include <iostream>
#include <vector>
using namespace std;

int interpolationSearch(const vector<int>& arr, int target) {
  int low = 0, high = arr.size() - 1;
  while (low <= high && target >= arr[low] && target <= arr[high]) {
    int pos = low + ((double)(target - arr[low]) / (arr[high] - arr[low])) * (high - low);
    if (arr[pos] == target)
      return pos;
    if (arr[pos] < target)
      low = pos + 1;
    else
      high = pos - 1;
  }
  return -1;
}`
  };

  // File upload handlers with animation & file name display
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
    let numericTarget;
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
        alert('Invalid array numbers.');
        return false;
      }
      if (targetFormat === 'normal') {
        if (!target.trim()) throw new Error();
        numericTarget = Number(target);
      } else if (targetFormat === 'json') {
        let parsedTarget = JSON.parse(targetFileContent);
        if (Array.isArray(parsedTarget)) {
          if (parsedTarget.length !== 1) {
            alert("Target JSON must contain a single value.");
            return false;
          }
          numericTarget = Number(parsedTarget[0]);
        } else {
          numericTarget = Number(parsedTarget);
        }
      } else if (targetFormat === 'csv') {
        const parsed = Papa.parse(targetFileContent, { skipEmptyLines: true });
        let tArr = parsed.data.flat();
        if (tArr.length !== 1) {
          alert("Target CSV must contain a single value.");
          return false;
        }
        numericTarget = Number(tArr[0]);
      }
      if (isNaN(numericTarget)) {
        alert("Invalid target number.");
        return false;
      }
      return { arr, numericTarget };
    } catch (err) {
      alert("Invalid input format.");
      return false;
    }
  };

  const interpolationSearchAlgo = async () => {
    setShowCodePanel(false);
    const validation = validateInput();
    if (!validation) return;
    setIsRunning(true);
    setSteps([]);
    setFoundIndex(null);
    let { arr, numericTarget } = validation;
    arr.sort((a, b) => a - b);
    let low = 0, high = arr.length - 1;
    let stepsArr = [];
    let found = false;
    while (low <= high && arr[low] <= numericTarget && arr[high] >= numericTarget) {
      let pos = low + Math.floor(((numericTarget - arr[low]) / (arr[high] - arr[low])) * (high - low));
      let step = {
        step: `Step ${stepsArr.length + 1}:`,
        explanation: 'Calculated the probable position using the interpolation formula.',
        arrayState: [...arr],
        low,
        high,
        pos,
      };
      if (arr[pos] === numericTarget) {
        step.step += ` Target found at index ${pos}!`;
        step.explanation = `The target value ${numericTarget} was found at position ${pos}.`;
        step.targetFound = true; // mark final step
        setFoundIndex(pos);
        found = true;
        stepsArr.push(step);
        setSteps([...stepsArr]);
        break;
      }
      if (arr[pos] > numericTarget) {
        step.step += ` (pos = ${pos}, value = ${arr[pos]}), target is smaller.`;
        step.explanation = `Update high to pos - 1.`;
        high = pos - 1;
      } else {
        step.step += ` (pos = ${pos}, value = ${arr[pos]}), target is larger.`;
        step.explanation = `Update low to pos + 1.`;
        low = pos + 1;
      }
      stepsArr.push(step);
      setSteps([...stepsArr]);
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
    if (!found) {
      const step = {
        step: 'Target not found',
        explanation: 'The search ended without finding the target.',
        arrayState: arr,
      };
      stepsArr.push(step);
      setSteps([...stepsArr]);
    }
    setTimeComplexity('O(log log n) - Best case complexity for Interpolation Search.');
    setIsRunning(false);
  };

  const handleSavePDF = async () => {
    if (!containerRef.current) return;
    const element = containerRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('interpolation_search_visualization.pdf');
  };

  return (
    <Box sx={{ padding: 4, background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ mb: 3, backgroundColor: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Interpolation Search Visualization
          </Typography>
          <Button color="inherit" onClick={() => setShowCodePanel((prev) => !prev)}>
            {showCodePanel ? (
              <>
                <DesktopMacIcon sx={{ mr: 1 }} />Screen
              </>
            ) : (
              <>
                <CodeIcon sx={{ mr: 1 }} />Code
              </>
            )}
          </Button>
          <Button color="inherit" onClick={handleSavePDF}>
            Save Visualization
          </Button>
        </Toolbar>
      </AppBar>
      <Paper elevation={6} sx={{ maxWidth: '800px', margin: '0 auto', padding: 4, borderRadius: 3 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
          Interpolation Search Visualization
        </Typography>
        <Typography variant="subtitle1" align="center" gutterBottom>
          Learn and visualize each step of the Interpolation Search algorithm.
        </Typography>
        {/* Input Row for Array */}
        <Box sx={{ mt: 3 }}>
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
        </Box>
        {/* Input Row for Target */}
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2} alignItems="center">
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
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button variant="contained" color="primary" onClick={interpolationSearchAlgo} disabled={isRunning}>
            {isRunning ? 'Searching...' : 'Start Search'}
          </Button>
        </Box>
        {/* Visualization / Code Panel */}
        <Box ref={containerRef} sx={{ mt: 4 }}>
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
                      <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
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
                                {!step.targetFound && step.pos === idx && (
                                  <Typography variant="caption" sx={{ position: 'absolute', top: -20, color: '#1976d2', fontWeight: 'bold' }}>
                                    current pos
                                  </Typography>
                                )}
                              </motion.div>
                            </Grid>
                          ))}
                        </Grid>
                      </Paper>
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
        </Box>
      </Paper>
    </Box>
  );
}
