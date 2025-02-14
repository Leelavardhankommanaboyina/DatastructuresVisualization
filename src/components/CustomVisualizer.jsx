import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";

const CustomCodeVisualizer = () => {
  const [code, setCode] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [visualizing, setVisualizing] = useState(false);

  // Start visualization: reset current step and switch view
  const handleVisualize = () => {
    setCurrentStep(0);
    setVisualizing(true);
  };

  // Calculate total number of lines (steps)
  const totalLines = code.split("\n").filter((line) => line.trim() !== "").length;

  // Move to next step if possible
  const nextStep = () => {
    if (currentStep < totalLines - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Move to previous step if possible
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Reset everything for a new visualization session
  const resetVisualization = () => {
    setVisualizing(false);
    setCode("");
    setCurrentStep(0);
  };

  return (
    <Box sx={{ p: 3 }}>
      {!visualizing ? (
        <>
          <Typography variant="h4" gutterBottom>
            Custom Code Visualizer
          </Typography>
          <TextField
            label="Enter your code or algorithm logic"
            multiline
            fullWidth
            rows={10}
            variant="outlined"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleVisualize}
            sx={{ mt: 2 }}
          >
            Visualize Code
          </Button>
        </>
      ) : (
        <>
          <Typography variant="h5" gutterBottom>
            Visualization Step {currentStep + 1} of {totalLines}
          </Typography>
          <SyntaxHighlighter
            language="javascript" // change if needed based on expected code language
            style={okaidia}
            showLineNumbers
            wrapLines={true}
            // Use lineProps to highlight the current step line
            lineProps={(lineNumber) =>
              lineNumber === currentStep + 1
                ? { style: { backgroundColor: "rgba(255,255,0,0.3)" } }
                : {}
            }
            customStyle={{
              borderRadius: "8px",
              padding: "16px",
              backgroundColor: "#2d2d2d",
            }}
          >
            {code}
          </SyntaxHighlighter>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              onClick={prevStep}
              disabled={currentStep === 0}
              sx={{ mr: 2 }}
            >
              Previous Step
            </Button>
            <Button
              variant="outlined"
              onClick={nextStep}
              disabled={currentStep >= totalLines - 1}
              sx={{ mr: 2 }}
            >
              Next Step
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={resetVisualization}
            >
              Reset
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default CustomCodeVisualizer;
