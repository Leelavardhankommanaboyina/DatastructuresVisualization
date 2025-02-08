import { useState } from 'react';
import { TextField, Button, Typography, Box, Grid } from '@mui/material';
import { motion } from 'framer-motion';

export default function QuickSortVisualization() {
  const [inputArray, setInputArray] = useState('');
  const [steps, setSteps] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [sortedArray, setSortedArray] = useState(null);

  // Validate input to ensure it's a valid array of numbers, chars, or strings
  const validateInput = () => {
    const arr = inputArray.split(',').map(item => item.trim());
    if (arr.some(item => !item || !/^[a-zA-Z0-9]+$/.test(item))) {
      alert('Please enter a valid array with numbers, characters, or strings.');
      return false;
    }
    return true;
  };

  // QuickSort function with tree-like visualization
  const quickSort = async () => {
    if (!validateInput()) return;

    setIsRunning(true);
    setSteps([]);
    setSortedArray(null);

    let arr = inputArray.split(',').map(item => item.trim());
    let stepsArr = [];

    // Helper function to recursively perform QuickSort
    const partition = (arr, low, high) => {
      let pivot = arr[high];
      let i = low - 1;
      for (let j = low; j <= high - 1; j++) {
        if (arr[j] <= pivot) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
        }
      }
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]; // Move pivot to correct position
      return i + 1;
    };

    const recursiveQuickSort = async (arr, low, high) => {
      if (low < high) {
        let pi = partition(arr, low, high);
        // Store the partitioning steps
        stepsArr.push({
          step: `Pivot: ${arr[pi]} at index ${pi}`,
          arrayState: [...arr],
          leftPartition: arr.slice(low, pi),
          rightPartition: arr.slice(pi + 1),
        });
        setSteps(prev => [...prev, stepsArr[stepsArr.length - 1]]);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Delay for visualization

        // Recurse on the left and right partition
        await recursiveQuickSort(arr, low, pi - 1);
        await recursiveQuickSort(arr, pi + 1, high);
      }
    };

    await recursiveQuickSort(arr, 0, arr.length - 1);
    setSortedArray(arr);
    setIsRunning(false);
  };

  return (
    <Box sx={{ padding: 2, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>QuickSort Algorithm Visualization</Typography>
      <TextField
        label="Array (comma separated)"
        variant="outlined"
        fullWidth
        value={inputArray}
        onChange={(e) => setInputArray(e.target.value)}
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={quickSort}
        disabled={isRunning}
        sx={{ marginTop: 2 }}
      >
        {isRunning ? 'Sorting...' : 'Start Sorting'}
      </Button>

      <Box sx={{ marginTop: 4 }}>
        {steps.length > 0 && (
          <>
            <Typography variant="h6">Steps:</Typography>
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.5 }}
              >
                <Typography variant="body1" sx={{ marginTop: 2 }}>
                  {step.step}
                </Typography>
                <Grid container justifyContent="center" spacing={1} sx={{ marginTop: 2 }}>
                  {step.arrayState.map((item, idx) => (
                    <Grid item key={idx}>
                      <motion.div
                        animate={{
                          scale: step.leftPartition.includes(item) || step.rightPartition.includes(item) ? 1.3 : 1,
                          backgroundColor: step.leftPartition.includes(item) || step.rightPartition.includes(item) ? 'lightblue' : 'white',
                        }}
                        transition={{ duration: 0.3 }}
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
                <Typography variant="body2" sx={{ marginTop: 2 }}>
                  Left Partition: {step.leftPartition.join(', ')} | Right Partition: {step.rightPartition.join(', ')}
                </Typography>
              </motion.div>
            ))}
          </>
        )}

        <Typography variant="h6" sx={{ marginTop: 4 }}>
          {sortedArray ? `Sorted Array: ${sortedArray.join(', ')}` : 'Sorting in progress...'}
        </Typography>
      </Box>
    </Box>
  );
}
