import { useState } from 'react';
import { TextField, Button, Typography, Box, Grid } from '@mui/material';
import { motion } from 'framer-motion';

export default function MergeSortVisualization() {
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

  // MergeSort function with tree-like visualization
  const mergeSort = async () => {
    if (!validateInput()) return;

    setIsRunning(true);
    setSteps([]);
    setSortedArray(null);

    let arr = inputArray.split(',').map(item => item.trim());
    let stepsArr = [];

    // Helper function to merge two sorted arrays
    const merge = (left, right) => {
      let result = [];
      let leftIndex = 0;
      let rightIndex = 0;
      while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex] <= right[rightIndex]) {
          result.push(left[leftIndex]);
          leftIndex++;
        } else {
          result.push(right[rightIndex]);
          rightIndex++;
        }
      }
      return result.concat(left.slice(leftIndex), right.slice(rightIndex));
    };

    // Helper function to recursively divide the array and merge it back
    const recursiveMergeSort = async (arr) => {
      if (arr.length <= 1) return arr;
      let middle = Math.floor(arr.length / 2);
      let left = arr.slice(0, middle);
      let right = arr.slice(middle);

      stepsArr.push({
        step: `Dividing: ${arr.join(', ')}`,
        arrayState: [...arr],
        leftPartition: left,
        rightPartition: right,
      });
      setSteps(prev => [...prev, stepsArr[stepsArr.length - 1]]);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Delay for visualization

      let leftSorted = await recursiveMergeSort(left);
      let rightSorted = await recursiveMergeSort(right);
      let merged = merge(leftSorted, rightSorted);

      stepsArr.push({
        step: `Merging: ${leftSorted.join(', ')} and ${rightSorted.join(', ')}`,
        arrayState: [...merged],
        leftPartition: leftSorted,
        rightPartition: rightSorted,
      });
      setSteps(prev => [...prev, stepsArr[stepsArr.length - 1]]);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Delay for visualization

      return merged;
    };

    let sorted = await recursiveMergeSort(arr);
    setSortedArray(sorted);
    setIsRunning(false);
  };

  return (
    <Box sx={{ padding: 2, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>MergeSort Algorithm Visualization</Typography>
      <TextField
        label="Array (comma separated)"
        variant="outlined"
        fullWidth
        value={inputArray}
        onChange={(e) => setInputArray(e.target.value)}  // This updates the inputArray state
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={mergeSort}
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
                          scale: 1.3,
                          backgroundColor: 'lightblue',
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
