import { useState } from 'react';
import { TextField, Button, Typography, Box, Grid } from '@mui/material';
import { motion } from 'framer-motion';

export default function BinarySearch() {
  const [array, setArray] = useState('');
  const [target, setTarget] = useState('');
  const [steps, setSteps] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [foundIndex, setFoundIndex] = useState(null);
  const [timeComplexity, setTimeComplexity] = useState('');

  const validateInput = () => {
    const arr = array.split(',').map(item => item.trim()).filter(item => item !== '');
    if (arr.some(isNaN)) {
      alert("Please enter valid numbers separated by commas.");
      return false;
    }
    return true;
  };

  const binarySearchRecursive = async (arr, x, start, end, stepsArr) => {
    if (start > end) {
      stepsArr.push({ step: `Target not found`, arrayState: [...arr] });
      setSteps([...stepsArr]);
      setTimeComplexity('O(log n) - Binary search has a time complexity of O(log n), where n is the array size.');
      setIsRunning(false);
      return;
    }

    let mid = Math.floor((start + end) / 2);

    // Prepare the current step state
    let step = {
      step: `Checking index ${mid} with value ${arr[mid]}`,
      arrayState: [...arr],
      mid,
      left: start,
      right: end,
    };

    if (arr[mid] === x) {
      setFoundIndex(mid);
      step.step += ` - Target found at index ${mid}!`;
      stepsArr.push(step);
      setSteps([...stepsArr]);
      setTimeComplexity('O(log n) - Binary search has a time complexity of O(log n), where n is the array size.');
      setIsRunning(false);
      return;
    }

    // Recurse based on comparison
    if (arr[mid] < x) {
      step.step += ` (mid = ${arr[mid]}), Discard left half, search in right half.`;
      stepsArr.push(step);
      setSteps([...stepsArr]);
      await new Promise(resolve => setTimeout(resolve, 1500));
      binarySearchRecursive(arr, x, mid + 1, end, stepsArr);  // Search right half
    } else {
      step.step += ` (mid = ${arr[mid]}), Discard right half, search in left half.`;
      stepsArr.push(step);
      setSteps([...stepsArr]);
      await new Promise(resolve => setTimeout(resolve, 1500));
      binarySearchRecursive(arr, x, start, mid - 1, stepsArr);  // Search left half
    }
  };

  const startSearch = () => {
    if (!validateInput()) return;
    setIsRunning(true);
    setSteps([]);
    setFoundIndex(null);
    let arr = array.split(',').map(Number).sort((a, b) => a - b);
    let x = Number(target);
    let stepsArr = [];
    binarySearchRecursive(arr, x, 0, arr.length - 1, stepsArr);
  };

  return (
    <Box sx={{ padding: 2, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>Binary Search Algorithm</Typography>
      <TextField
        label="Array (comma separated)"
        variant="outlined"
        fullWidth
        value={array}
        onChange={(e) => setArray(e.target.value)}
        margin="normal"
      />
      <TextField
        label="Target Value"
        variant="outlined"
        fullWidth
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={startSearch}
        disabled={isRunning}
        sx={{ marginTop: 2 }}
      >
        {isRunning ? 'Searching...' : 'Start Search'}
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
                          scale: step.mid === idx ? 1.3 : 1,
                          backgroundColor: step.mid === idx ? 'lightblue' : (foundIndex === idx ? 'lightgreen' : 'white'),
                        }}
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
                      {step.mid === idx && (
                        <div style={{ position: 'absolute', top: -10, fontSize: '20px', color: 'blue' }}>
                          ↑
                        </div>
                      )}
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            ))}
          </>
        )}
        <Typography variant="h6" sx={{ marginTop: 4 }}>
          {foundIndex !== null ? `Target found at index ${foundIndex}` : 'Target not found'}
        </Typography>
        <Typography variant="body1" sx={{ marginTop: 2 }}>{timeComplexity}</Typography>
      </Box>
    </Box>
  );
}
