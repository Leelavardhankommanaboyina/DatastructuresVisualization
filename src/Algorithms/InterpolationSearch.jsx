import { useState } from 'react';
import { TextField, Button, Typography, Box, Grid } from '@mui/material';
import { motion } from 'framer-motion';

export default function InterpolationSearch() {
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

  const interpolationSearch = async () => {
    if (!validateInput()) return;
    setIsRunning(true);
    setSteps([]);
    setFoundIndex(null);

    let arr = array.split(',').map(Number).sort((a, b) => a - b);
    let low = 0, high = arr.length - 1;
    let stepsArr = [];
    let found = false;
    let numericTarget = Number(target);

    while (low <= high && arr[low] <= numericTarget && arr[high] >= numericTarget) {
      let pos = low + Math.floor(((numericTarget - arr[low]) / (arr[high] - arr[low])) * (high - low));

      let step = {
        step: `Step ${stepsArr.length + 1}:`,
        arrayState: [...arr],
        low,
        high,
        pos,
      };

      // If the target is found at the position
      if (arr[pos] === numericTarget) {
        step.step += ` Target found at index ${pos}!`;
        setFoundIndex(pos);
        found = true;
        stepsArr.push(step);
        setSteps(prev => [...prev, step]); // Update state immediately
        break;
      }

      // If target is smaller, search left side
      if (arr[pos] > numericTarget) {
        step.step += ` (pos = ${pos}, value = ${arr[pos]}), Target is smaller, search left side.`;
        high = pos - 1;
      } else {
        // If target is larger, search right side
        step.step += ` (pos = ${pos}, value = ${arr[pos]}), Target is larger, search right side.`;
        low = pos + 1;
      }

      stepsArr.push(step);
      setSteps(prev => [...prev, step]); // Update state after each step
      await new Promise(resolve => setTimeout(resolve, 1500)); // Wait for better UI visualization
    }

    if (!found) {
      stepsArr.push({ step: 'Target not found', arrayState: arr });
      setSteps(prev => [...prev, { step: 'Target not found', arrayState: arr }]);
    }

    setTimeComplexity('O(log log n) - Interpolation search has a time complexity of O(log log n) in the best case.');
    setIsRunning(false);
  };

  return (
    <Box sx={{ padding: 2, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>Interpolation Search Algorithm</Typography>
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
        onClick={interpolationSearch}
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
                          scale: step.pos === idx ? 1.3 : 1,
                          backgroundColor: step.pos === idx ? 'lightblue' : (foundIndex === idx ? 'lightgreen' : 'white'),
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
                      {step.pos === idx && (
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
