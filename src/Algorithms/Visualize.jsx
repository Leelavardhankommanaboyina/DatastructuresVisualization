import { useEffect, useState } from "react";
import { Typography, Box, Paper, Grid } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

// Algorithm visualization component
const Visualize = () => {
  const location = useLocation();
  const { algorithm, data } = location.state || {};

  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [finalOutput, setFinalOutput] = useState([]);
  const [timeComplexity, setTimeComplexity] = useState("");

  useEffect(() => {
    if (!algorithm || !data) return;
    let stepsArray = [];
    let finalArray = [...data];
    let complexity = "";

    switch (algorithm.name) {
      case "Linear Search":
        complexity = "O(n)";
        linearSearch(finalArray, stepsArray);
        break;
      case "Binary Search":
        complexity = "O(log n)";
        binarySearch(finalArray, stepsArray);
        break;
      case "Bubble Sort":
        complexity = "O(n^2)";
        bubbleSort(finalArray, stepsArray);
        break;
      case "Quick Sort":
        complexity = "O(n log n)";
        quickSort(finalArray, 0, finalArray.length - 1, stepsArray);
        break;
      case "Merge Sort":
        complexity = "O(n log n)";
        finalArray = mergeSort(finalArray, stepsArray);
        break;
      default:
        console.log("Algorithm not implemented");
    }

    setSteps(stepsArray);
    setFinalOutput(finalArray);
    setTimeComplexity(complexity);
  }, [algorithm, data]);

  useEffect(() => {
    if (currentStep < steps.length) {
      const timer = setTimeout(() => setCurrentStep(currentStep + 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCompleted(true);
    }
  }, [currentStep, steps]);

  const linearSearch = (arr, stepsArray) => {
    const target = arr[arr.length - 1];
    for (let i = 0; i < arr.length; i++) {
      stepsArray.push({ type: "searching", index: i, value: arr[i], array: [...arr] });
      if (arr[i] === target) {
        stepsArray.push({ type: "found", index: i, array: [...arr] });
        break;
      }
    }
  };

  const bubbleSort = (arr, stepsArray) => {
    let swapped;
    do {
      swapped = false;
      for (let i = 0; i < arr.length - 1; i++) {
        stepsArray.push({ type: "compare", index1: i, index2: i + 1, array: [...arr] });
        if (arr[i] > arr[i + 1]) {
          [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
          swapped = true;
          stepsArray.push({ type: "swap", index1: i, index2: i + 1, array: [...arr] });
        }
      }
    } while (swapped);
  };

  const renderArray = (arr, highlightedIndices = [], operation = "") => {
    return (
      <Grid container spacing={1} justifyContent="center">
        {arr.map((value, index) => (
          <Grid item key={index}>
            <Paper
              elevation={3}
              sx={{
                backgroundColor: highlightedIndices.includes(index)
                  ? operation === "compare"
                    ? "blue"
                    : operation === "swap"
                    ? "yellow"
                    : operation === "found"
                    ? "green"
                    : "lightgray"
                  : "lightblue",
                padding: 2,
                textAlign: "center",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: highlightedIndices.includes(index) ? "bold" : "normal",
              }}
            >
              <Typography variant="body1">{value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box textAlign="center" p={3}>
      <Typography variant="h5" gutterBottom>
        Input Data: {JSON.stringify(data)}
      </Typography>

      <Typography variant="h4" gutterBottom>
        Visualizing {algorithm?.name}
      </Typography>

      <AnimatePresence>
        {steps.slice(0, currentStep + 1).map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
              <Typography variant="h6">
                Step {index + 1}: {step.type.toUpperCase()}
              </Typography>

              {renderArray(
                step.array,
                step.type === "compare"
                  ? [step.index1, step.index2]
                  : step.type === "swap"
                  ? [step.index1, step.index2]
                  : step.type === "searching"
                  ? [step.index]
                  : step.type === "found"
                  ? [step.index]
                  : [],
                step.type
              )}

              <Typography variant="body1" sx={{ marginTop: 2 }}>
                {step.type === "compare"
                  ? `Comparing elements at index ${step.index1} and ${step.index2}`
                  : step.type === "swap"
                  ? `Swapped elements at index ${step.index1} and ${step.index2}`
                  : step.type === "searching"
                  ? `Searching element at index ${step.index}`
                  : step.type === "found"
                  ? `Element found at index ${step.index}`
                  : ""}
              </Typography>
            </Paper>
          </motion.div>
        ))}
      </AnimatePresence>

      {completed && (
        <Box sx={{ marginTop: 3 }}>
          <Typography variant="h5" gutterBottom>
            Final Output: {JSON.stringify(finalOutput)}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Time Complexity: {timeComplexity}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Visualize;
