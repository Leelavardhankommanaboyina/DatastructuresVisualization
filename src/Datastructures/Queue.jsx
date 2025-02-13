import React, { useState, useEffect, useRef } from "react";
import { Button, TextField, Typography, Box, Grid } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { select } from "d3";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

class QueueClass {
  constructor() {
    this.items = [];
  }

  enqueue(element) {
    this.items.push(element);
  }

  dequeue() {
    return this.items.length === 0 ? "Underflow" : this.items.shift();
  }

  toArray() {
    return [...this.items];
  }
}

export default function QueueVisualization() {
  const [queue, setQueue] = useState(new QueueClass());
  const [input, setInput] = useState("");
  const [logSteps, setLogSteps] = useState([]);

  // Refs for the SVG container and the Box containing the visualization (for PDF saving)
  const svgRef = useRef();
  const visualizationRef = useRef();

  useEffect(() => {
    drawQueue();
  }, [queue]);

  const drawQueue = () => {
    const svg = select(svgRef.current);
    // Clear previous content
    svg.selectAll("*").remove();

    const elementWidth = 60;
    const elementHeight = 40;
    const spacing = 20;
    const elements = queue.toArray();

    // Compute the SVG width dynamically based on the number of elements,
    // with a minimum width of 600px.
    const computedWidth = Math.max(600, elements.length * (elementWidth + spacing) + spacing);
    svg.attr("width", computedWidth).attr("height", 150);

    // Draw each element in the queue as a rectangle with centered text.
    elements.forEach((value, i) => {
      const x = spacing + i * (elementWidth + spacing);
      const y = 50; // fixed y position

      // Draw the rectangle with rounded corners and a stroke.
      svg.append("rect")
        .attr("x", x)
        .attr("y", y)
        .attr("width", elementWidth)
        .attr("height", elementHeight)
        .attr("rx", 5)
        .attr("ry", 5)
        .style("fill", "#a5d6a7")
        .style("stroke", "#66bb6a")
        .style("stroke-width", 2);

      // Draw the text inside the rectangle.
      svg.append("text")
        .attr("x", x + elementWidth / 2)
        .attr("y", y + elementHeight / 2 + 5)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("fill", "#1b5e20")
        .text(value);
    });

    // Label the Front and Rear of the queue if there are any elements.
    if (elements.length > 0) {
      // Label for Front (first element)
      svg.append("text")
        .attr("x", spacing + elementWidth / 2)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("fill", "#d32f2f")
        .text("Front");
      
      // Label for Rear (last element)
      svg.append("text")
        .attr("x", spacing + (elements.length - 1) * (elementWidth + spacing) + elementWidth / 2)
        .attr("y", 110)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("fill", "#1976d2")
        .text("Rear");
    }
  };

  // Helper function to force a re-render of the queue visualization.
  const updateQueueState = () => {
    setQueue(Object.assign(Object.create(Object.getPrototypeOf(queue)), queue));
  };

  // Log operation steps (no localStorage persistence so logs are cleared on reload).
  const updateLogSteps = (newStep) => {
    setLogSteps((prevSteps) => [...prevSteps, newStep]);
  };

  const handleEnqueue = () => {
    if (!input) return;
    queue.enqueue(input);
    updateLogSteps(`Enqueued: ${input}`);
    setInput("");
    updateQueueState();
  };

  const handleDequeue = () => {
    const removed = queue.dequeue();
    if (removed === "Underflow") {
      updateLogSteps("Attempted dequeue on empty queue");
    } else {
      updateLogSteps(`Dequeued: ${removed}`);
    }
    updateQueueState();
  };

  // Save only the visualization area as a PDF.
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
      pdf.save("queue_visualization.pdf");
    } catch (error) {
      console.error("Error saving visualization", error);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" align="center" gutterBottom>
        Queue Operations
      </Typography>
      {/* Centered input field */}
      <Box display="flex" justifyContent="center" mb={2}>
        <TextField
          label="Enter Value to Enqueue"
          variant="outlined"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          sx={{ mr: 2 }}
        />
      </Box>
      {/* Centered buttons for queue operations */}
      <Box display="flex" justifyContent="center" mb={2}>
        <Button variant="contained" onClick={handleEnqueue} sx={{ mr: 2 }}>
          Enqueue
        </Button>
        <Button variant="contained" onClick={handleDequeue}>
          Dequeue
        </Button>
      </Box>
      {/* Save Visualization button */}
      <Box display="flex" justifyContent="center" mb={2}>
        <Button
          variant="outlined"
          onClick={handleSaveVisualization}
          startIcon={<SaveIcon />}
        >
          Save Visualization
        </Button>
      </Box>
      {/* Layout: Left for visualization, Right for operation log */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Box
            ref={visualizationRef}
            sx={{
              border: "1px solid #ccc",
              height: "200px",
              overflowX: "auto",
              p: 2,
              backgroundColor: "#f9f9f9",
              display: "flex",
              justifyContent: "center"
            }}
          >
            <svg ref={svgRef} />
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              border: "1px solid #ccc",
              height: "200px",
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
