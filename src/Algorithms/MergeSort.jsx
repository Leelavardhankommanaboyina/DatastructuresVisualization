import React, { useState, useRef } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
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
import {
  PictureAsPdf as PictureAsPdfIcon,
  DesktopMac as DesktopMacIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

/* ------------------------- */
/* Helper Functions          */
/* ------------------------- */

// mergeSorted: Standard merging of two sorted arrays.
function mergeSorted(L, R) {
  let result = [];
  let i = 0,
    j = 0;
  while (i < L.length && j < R.length) {
    if (L[i] <= R[j]) {
      result.push(L[i]);
      i++;
    } else {
      result.push(R[j]);
      j++;
    }
  }
  return result.concat(L.slice(i)).concat(R.slice(j));
}

// buildMergeSortTree: Recursively builds a tree representing the MergeSort process.
function buildMergeSortTree(arr) {
  if (arr.length <= 1) {
    return { original: arr, merged: arr };
  }
  const mid = Math.floor(arr.length / 2);
  const leftArr = arr.slice(0, mid);
  const rightArr = arr.slice(mid);
  const leftTree = buildMergeSortTree(leftArr);
  const rightTree = buildMergeSortTree(rightArr);
  const merged = mergeSorted(leftTree.merged, rightTree.merged);
  return { original: arr, left: leftTree, right: rightTree, merged };
}

/* ------------------------- */
/* Diagram Components        */
/* ------------------------- */

// MergeSortNode: Displays node details and arrows for MergeSort.
function MergeSortNode({ node }) {
  // For leaf nodes, just display the element.
  if (!node.left && !node.right) {
    return (
      <Box sx={{ textAlign: 'center', m: 1 }}>
        <Card sx={{ backgroundColor: '#fff', display: 'inline-block', minWidth: 80 }}>
          <CardContent>
            <Typography variant="body2">[{node.merged.join(', ')}]</Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ textAlign: 'center', m: 2 }}>
      {/* Row 1: Input Card */}
      <Card sx={{ backgroundColor: '#e0e0e0', display: 'inline-block', minWidth: 140 }}>
        <CardContent>
          <Typography variant="body2">Input: [{node.original.join(', ')}]</Typography>
        </CardContent>
      </Card>

      {/* Arrow from Input to Children */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
        <svg width="120" height="40">
          <defs>
            <marker
              id="arrow1"
              markerWidth="10"
              markerHeight="7"
              refX="0"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="black" />
            </marker>
          </defs>
          <line
            x1="60"
            y1="0"
            x2="60"
            y2="40"
            stroke="black"
            strokeWidth="2"
            markerEnd="url(#arrow1)"
          />
        </svg>
        <Typography variant="caption" sx={{ ml: 1 }}>
          mergeSort()
        </Typography>
      </Box>

      {/* Row 2: Children Nodes */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 4,
          mt: 1,
          flexWrap: 'wrap',
        }}
      >
        <MergeSortNode node={node.left} />
        <MergeSortNode node={node.right} />
      </Box>

      {/* Arrow from Children to Merged Result */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
        <svg width="120" height="40">
          <defs>
            <marker
              id="arrow2"
              markerWidth="10"
              markerHeight="7"
              refX="0"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="green" />
            </marker>
          </defs>
          <line
            x1="60"
            y1="0"
            x2="60"
            y2="40"
            stroke="green"
            strokeWidth="2"
            markerEnd="url(#arrow2)"
          />
        </svg>
        <Typography variant="caption" sx={{ ml: 1, color: 'green' }}>
          merge()
        </Typography>
      </Box>

      {/* Row 3: Merged Result Card */}
      <Card
        sx={{ backgroundColor: '#c8e6c9', display: 'inline-block', minWidth: 140, mt: 1 }}
      >
        <CardContent>
          <Typography variant="body2">
            Merged: [{node.merged.join(', ')}]
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

/* ------------------------- */
/* Main Component            */
/* ------------------------- */

export default function MergeSortVisualization() {
  const [inputArray, setInputArray] = useState('');
  const [tree, setTree] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [inputFormat, setInputFormat] = useState('normal'); // Options: "normal", "json", "csv"

  // New states for dynamic code panel
  const [showCodePanel, setShowCodePanel] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState('javascript');

  // Code snippets for MergeSort in various languages.
  const codeSnippets = {
    javascript: `// JavaScript MergeSort Implementation
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  let result = [];
  while (left.length && right.length) {
    if (left[0] <= right[0]) result.push(left.shift());
    else result.push(right.shift());
  }
  return result.concat(left, right);
}

// Example:
console.log(mergeSort([5,3,8,4,2]));`,
    java: `// Java MergeSort Implementation
public class MergeSort {
  public static void mergeSort(int[] arr, int l, int r) {
    if (l < r) {
      int m = (l + r) / 2;
      mergeSort(arr, l, m);
      mergeSort(arr, m + 1, r);
      merge(arr, l, m, r);
    }
  }
  
  public static void merge(int[] arr, int l, int m, int r) {
    int n1 = m - l + 1;
    int n2 = r - m;
    int[] L = new int[n1];
    int[] R = new int[n2];
    for (int i = 0; i < n1; ++i) L[i] = arr[l + i];
    for (int j = 0; j < n2; ++j) R[j] = arr[m + 1 + j];
    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
      if (L[i] <= R[j]) arr[k++] = L[i++];
      else arr[k++] = R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
  }
}`,
    python: `# Python MergeSort Implementation
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    while left and right:
        if left[0] <= right[0]:
            result.append(left.pop(0))
        else:
            result.append(right.pop(0))
    return result + left + right

# Example:
print(merge_sort([5,3,8,4,2]))`,
    cpp: `// C++ MergeSort Implementation
#include <vector>
using namespace std;

void merge(vector<int>& arr, int l, int m, int r) {
  int n1 = m - l + 1, n2 = r - m;
  vector<int> L(n1), R(n2);
  for (int i = 0; i < n1; i++)
    L[i] = arr[l + i];
  for (int j = 0; j < n2; j++)
    R[j] = arr[m + 1 + j];
  int i = 0, j = 0, k = l;
  while (i < n1 && j < n2) {
    if (L[i] <= R[j])
      arr[k++] = L[i++];
    else
      arr[k++] = R[j++];
  }
  while (i < n1)
    arr[k++] = L[i++];
  while (j < n2)
    arr[k++] = R[j++];
}

void mergeSort(vector<int>& arr, int l, int r) {
  if (l < r) {
    int m = l + (r - l) / 2;
    mergeSort(arr, l, m);
    mergeSort(arr, m + 1, r);
    merge(arr, l, m, r);
  }
}`,
  };

  // Use a ref to reliably capture the visualization container.
  const vizRef = useRef(null);

  // Handle file upload (for JSON or CSV formats)
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

  // Validate and parse the input. Only alphanumeric values are allowed.
  const validateInput = () => {
    let arr = [];
    if (inputFormat === 'normal') {
      arr = inputArray.split(',').map((item) => item.trim());
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
    if (arr.some((item) => !item || !/^[a-zA-Z0-9]+$/.test(item))) {
      alert('Please enter a valid array with numbers, characters, or strings.');
      return false;
    }
    return arr;
  };

  // Build the MergeSort tree when the user clicks "Start MergeSort"
  const handleMergeSort = () => {
    const arr = validateInput();
    if (!arr) return;
    setIsRunning(true);
    const tree = buildMergeSortTree(arr);
    setTree(tree);
    setIsRunning(false);
  };

  // Revised PDF export function to capture the full visualization.
  const handleDownloadPDF = async () => {
    const element = vizRef.current;
    if (!element) {
      alert('Visualization not found!');
      return;
    }
    try {
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        logging: true,
        backgroundColor: '#fff',
        width: element.scrollWidth,
        height: element.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('merge_sort_tree.pdf');
    } catch (error) {
      console.error('Error generating PDF', error);
      alert('An error occurred while generating the PDF.');
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      {/* AppBar with Title, dynamic code toggle, and Download PDF Button */}
      <AppBar position="static" sx={{ mb: 3, backgroundColor: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            MergeSort Tree Visualization
          </Typography>
          <Button color="inherit" onClick={() => setShowCodePanel((prev) => !prev)}>
            {showCodePanel ? (
              <>
                <DesktopMacIcon sx={{ mr: 1 }} />
                Screen
              </>
            ) : (
              <>
                <CodeIcon sx={{ mr: 1 }} />
                Code
              </>
            )}
          </Button>
          <Button color="inherit" startIcon={<PictureAsPdfIcon />} onClick={handleDownloadPDF}>
            Download PDF
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 1200, margin: 'auto' }}>
        <Typography variant="h4" align="center" gutterBottom>
          MergeSort Algorithm (Tree Diagram)
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
          {/* Start MergeSort Button */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleMergeSort}
              disabled={isRunning}
              fullWidth
              sx={{ mt: 2 }}
            >
              {isRunning ? 'Sorting...' : 'Start MergeSort'}
            </Button>
          </Grid>
        </Grid>

        {/* Visualization / Code Panel Area */}
        <Box
          id="visualization"
          ref={vizRef}
          sx={{
            mt: 4,
            mb: 4,
            p: 2,
            border: '1px solid #ccc',
            overflowX: 'auto',
            overflowY: 'auto',
            maxHeight: '80vh',
            minWidth: '100%',
            backgroundColor: '#f9f9f9',
          }}
        >
          {showCodePanel ? (
            <>
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
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
                <pre
                  style={{
                    backgroundColor: '#f5f5f5',
                    padding: '16px',
                    borderRadius: '4px',
                    overflow: 'auto',
                  }}
                >
                  {codeSnippets[codeLanguage]}
                </pre>
              </Box>
            </>
          ) : tree ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <MergeSortNode node={tree} />
            </motion.div>
          ) : (
            <Typography variant="body1" align="center">
              MergeSort tree visualization will appear here.
            </Typography>
          )}
        </Box>

        {tree && (
          <Typography variant="h6" align="center">
            Sorted Array: [{tree.merged.join(', ')}]
          </Typography>
        )}

        {/* Detailed Explanation Accordion */}
        <Accordion sx={{ mt: 4 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Detailed Explanation</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>MergeSort Algorithm:</strong>
            </Typography>
            <Typography variant="body2" paragraph>
              MergeSort is a divide‑and‑conquer algorithm that divides the input array into two halves,
              recursively sorts each half, and then merges the sorted halves.
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>How It Works:</strong>
              <br />
              1. Divide the array into two halves until you have subarrays of size 1.
              <br />
              2. Merge the subarrays in a manner that results in a sorted array.
              <br />
              3. The merging process involves comparing the elements of the subarrays and combining them in order.
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Time Complexity:</strong> O(n log n) in the average and best cases, with a worst-case of O(n log n).
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
}
