import React, { useState, useEffect, useRef } from "react";
import { Button, TextField, Typography, Box, Grid } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { select } from "d3";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

// Simple Stack class for managing stack operations.
class StackClass {
  constructor() {
    this.items = [];
  }
  push(element) {
    this.items.push(element);
  }
  pop() {
    return this.items.length === 0 ? "Underflow" : this.items.pop();
  }
  toArray() {
    return [...this.items];
  }
}

export default function StackVisualization() {
  // Initialize with a new stack instance.
  const [stack, setStack] = useState(new StackClass());
  // Removed localStorage so that steps do not persist across reloads.
  const [logSteps, setLogSteps] = useState([]);
  const [input, setInput] = useState("");

  // Refs for the SVG container and the Box that holds the visualization.
  const svgRef = useRef();
  const visualizationRef = useRef();

  useEffect(() => {
    drawStack();
  }, [stack]);

  const drawStack = () => {
    const svg = select(svgRef.current);
    // Clear previous drawings
    svg.selectAll("*").remove();

    // Add a drop shadow filter for a realistic look
    const defs = svg.append("defs");
    const filter = defs
      .append("filter")
      .attr("id", "drop-shadow")
      .attr("height", "130%");
    filter
      .append("feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", 3)
      .attr("result", "blur");
    filter
      .append("feOffset")
      .attr("in", "blur")
      .attr("dx", 2)
      .attr("dy", 2)
      .attr("result", "offsetBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "offsetBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Visualization dimensions and settings
    const svgWidth = 300;
    const elementWidth = 120;
    const elementHeight = 40;
    const spacing = 10;
    const elements = stack.toArray();

    // Calculate the total required height for the stack,
    // ensuring a minimum height (here, 400px) so that even with few elements the area is sufficient.
    const computedStackHeight = elements.length * (elementHeight + spacing) + spacing;
    const svgHeight = Math.max(400, computedStackHeight);

    // Set the SVG dimensions dynamically.
    select(svgRef.current)
      .attr("height", svgHeight)
      .attr("width", svgWidth);

    // Draw each stack element from bottom up.
    elements.forEach((value, i) => {
      // Position each element relative to the bottom of the SVG.
      const y = svgHeight - (i + 1) * (elementHeight + spacing);
      const x = (svgWidth - elementWidth) / 2;

      // Draw the rectangle with rounded corners and drop shadow.
      svg
        .append("rect")
        .attr("x", x)
        .attr("y", y)
        .attr("width", elementWidth)
        .attr("height", elementHeight)
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("fill", "#90caf9")
        .attr("stroke", "#42a5f5")
        .attr("stroke-width", 2)
        .attr("filter", "url(#drop-shadow)");

      // Display the value centered within the rectangle.
      svg
        .append("text")
        .attr("x", x + elementWidth / 2)
        .attr("y", y + elementHeight / 2 + 5)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("fill", "#0d47a1")
        .text(value);

      // Label the top element with "TOP".
      if (i === elements.length - 1) {
        svg
          .append("text")
          .attr("x", x + elementWidth / 2)
          .attr("y", y - 10)
          .attr("text-anchor", "middle")
          .style("font-size", "14px")
          .style("fill", "#d32f2f")
          .text("TOP");
      }
    });
  };

  // Force an update to trigger re-rendering the visualization.
  const updateStackState = () => {
    setStack(Object.assign(Object.create(Object.getPrototypeOf(stack)), stack));
  };

  // Update log steps without persisting to localStorage.
  const updateLogSteps = (newStep) => {
    setLogSteps(prevSteps => [...prevSteps, newStep]);
  };

  const handlePush = () => {
    if (!input) return;
    stack.push(input);
    updateLogSteps(`Pushed: ${input}`);
    setInput("");
    updateStackState();
  };

  const handlePop = () => {
    const popped = stack.pop();
    if (popped === "Underflow") {
      updateLogSteps("Attempted pop on empty stack");
    } else {
      updateLogSteps(`Popped: ${popped}`);
    }
    updateStackState();
  };

  // Save the visualization (the Box containing the SVG) as a PDF.
  const handleSaveVisualization = async () => {
    if (!visualizationRef.current) return;
    try {
      const canvas = await html2canvas(visualizationRef.current, {
        scale: 2,
        backgroundColor: "#fff"
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight);
      pdf.save("stack_visualization.pdf");
    } catch (error) {
      console.error("Error saving visualization", error);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" align="center" gutterBottom>
        Stack Operations
      </Typography>
      {/* Centered Input Field */}
      <Box display="flex" justifyContent="center" mb={2}>
        <TextField
          label="Enter Value to Push into the Stack"
          variant="outlined"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          sx={{ mr: 2 }}
        />
      </Box>
      {/* Centered Push/Pop Buttons */}
      <Box display="flex" justifyContent="center" mb={2}>
        <Button variant="contained" onClick={handlePush} sx={{ mr: 2 }}>
          Push
        </Button>
        <Button variant="contained" onClick={handlePop}>
          Pop
        </Button>
      </Box>
      {/* Save Visualization Button with Icon */}
      <Box display="flex" justifyContent="center" mb={2}>
        <Button
          variant="outlined"
          onClick={handleSaveVisualization}
          startIcon={<SaveIcon />}
        >
          Save Visualization
        </Button>
      </Box>
      {/* Layout: Left - Visualization; Right - Operation Log */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Box
            ref={visualizationRef}
            sx={{
              border: "1px solid #ccc",
              height: "400px",
              overflowY: "auto",
              p: 2,
              backgroundColor: "#f9f9f9",
              display: "flex",
              justifyContent: "center"
            }}
          >
            {/* The SVG element will have its height adjusted dynamically */}
            <svg ref={svgRef} />
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              border: "1px solid #ccc",
              height: "400px",
              overflowY: "auto",
              p: 2,
              backgroundColor: "#fff"
            }}
          >
            <Typography variant="h6" gutterBottom>
              Operation Steps
            </Typography>
            {logSteps.length === 0 ? (
              <Typography variant="body2">No operations yet.</Typography>
            ) : (
              logSteps.map((step, index) => (
                <Typography key={index} variant="body2">
                  {index + 1}. {step}
                </Typography>
              ))
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
