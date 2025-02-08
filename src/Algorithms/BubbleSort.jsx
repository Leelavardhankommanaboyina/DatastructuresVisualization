import { useState } from 'react';
import { TextField, Button, Typography, Box, Grid } from '@mui/material';
import { motion } from 'framer-motion';

export default function BubbleSortVisualization() {
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

  // Bubble Sort function with real-time animation
  const bubbleSort = async () => {
    if (!validateInput()) return;

    setIsRunning(true);
    setSteps([]);
    setSortedArray(null);

    let arr = inputArray.split(',').map(item => item.trim());
    let stepsArr = [];
    let n = arr.length;

    // Perform bubble sort and record each step for animation
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        let step = {
          step: `Comparing: ${arr[j]} and ${arr[j + 1]}`,
          arrayState: [...arr],
          compare: [j, j + 1],
        };

        // If elements are out of order, swap them with an animation
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          step.step += ` --> Swapped: ${arr[j]} and ${arr[j + 1]}`;
        }

        stepsArr.push(step);
        setSteps(prev => [...prev, step]);
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay for animation effect
      }
    }

    setSortedArray(arr);
    setIsRunning(false);
  };

  return (
    <Box sx={{ padding: 2, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>Bubble Sort Algorithm Visualization</Typography>
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
        onClick={bubbleSort}
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
                          scale: step.compare.includes(idx) ? 1.3 : 1,
                          backgroundColor: step.compare.includes(idx) ? 'lightblue' : 'white',
                          y: step.compare.includes(idx) ? [0, -10, 0] : 0, // Add vertical jump animation during swap
                        }}
                        transition={{ duration: 0.3 }} // Smooth transition for jump
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
