import React, { useState } from 'react';
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
  MenuItem
} from '@mui/material';
import { motion } from 'framer-motion';
import Papa from 'papaparse';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { PictureAsPdf as PictureAsPdfIcon } from '@mui/icons-material';

/* ------------------------- */
/* Helper Functions          */
/* ------------------------- */

/* mergeSorted:
   Standard merging of two sorted arrays.
*/
function mergeSorted(L, R) {
  let result = [];
  let i = 0, j = 0;
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

/* buildMergeSortTree:
   Recursively builds a tree representing the MergeSort process.
   Each node has:
   - original: the input subarray for that call
   - merged: the sorted (merged) result
   - left/right: child nodes (if any)
*/
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

/* MergeSortNode:
   For non‑leaf nodes, displays a three‑row diagram:
   1. Row 1 (Input): Shows the subarray passed to mergeSort.
   2. Row 2 (Divide): An arrow labeled "mergeSort()" points down to two child nodes.
   3. Row 3 (Merge): An arrow labeled "merge()" points to a card with the merged (sorted) result.
   For leaf nodes, simply display the element.
*/
function MergeSortNode({ node }) {
  // Leaf node: single element array.
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
          <Typography variant="body2">
            Input: [{node.original.join(', ')}]
          </Typography>
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
          <line x1="60" y1="0" x2="60" y2="40" stroke="black" strokeWidth="2" markerEnd="url(#arrow1)" />
        </svg>
        <Typography variant="caption" sx={{ ml: 1 }}>mergeSort()</Typography>
      </Box>

      {/* Row 2: Children Nodes */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 1, flexWrap: 'wrap' }}>
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
          <line x1="60" y1="0" x2="60" y2="40" stroke="green" strokeWidth="2" markerEnd="url(#arrow2)" />
        </svg>
        <Typography variant="caption" sx={{ ml: 1, color: 'green' }}>merge()</Typography>
      </Box>

      {/* Row 3: Merged Result Card */}
      <Card sx={{ backgroundColor: '#c8e6c9', display: 'inline-block', minWidth: 140, mt: 1 }}>
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

  // Build the MergeSort tree when the user clicks "Start MergeSort"
  const handleMergeSort = () => {
    const arr = validateInput();
    if (!arr) return;
    setIsRunning(true);
    const tree = buildMergeSortTree(arr);
    setTree(tree);
    setIsRunning(false);
  };

  // Updated PDF export function that attempts to capture the entire scrollable area
  const handleDownloadPDF = async () => {
    const element = document.getElementById('visualization');
    if (!element) {
      alert("Visualization not found!");
      return;
    }
    try {
      // Use html2canvas with options to capture the full scrollable area
      const canvas = await html2canvas(element, {
        scale: 3, // Higher scale for better quality
        backgroundColor: '#fff',
        scrollX: 0,
        scrollY: 0,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // Create a PDF whose page size matches the captured image size.
      const pdf = new jsPDF('p', 'mm', [canvas.width / 3, canvas.height / 3]);
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 3, canvas.height / 3);
      pdf.save('merge_sort_tree.pdf');
    } catch (error) {
      console.error("Error generating PDF", error);
      alert("An error occurred while generating the PDF.");
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      {/* AppBar with Title and Download PDF Button */}
      <AppBar position="static" sx={{ mb: 3, backgroundColor: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            MergeSort Tree Visualization
          </Typography>
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

        {/* Scrollable Visualization Area */}
        <Box
          id="visualization"
          sx={{
            mt: 4,
            mb: 4,
            p: 2,
            border: '1px solid #ccc',
            overflowX: 'auto',
            overflowY: 'auto',
            maxHeight: '80vh',
            minWidth: '100%',
            backgroundColor: '#f9f9f9'
          }}
        >
          {tree ? (
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
      </Box>
    </Box>
  );
}
