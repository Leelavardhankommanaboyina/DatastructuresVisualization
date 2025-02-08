import React, { useState, useEffect } from "react";
import { Button, TextField, Typography, Box } from "@mui/material";
import { select } from "d3";

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
  const [stack, setStack] = useState(new StackClass());
  const [input, setInput] = useState("");

  useEffect(() => {
    drawStack();
  }, [stack]);

  const drawStack = () => {
    const svg = select("#stack-visual");
    svg.selectAll("*").remove();
    const elements = stack.toArray();
    elements.forEach((value, i) => {
      svg.append("rect")
        .attr("x", 50)
        .attr("y", 200 - i * 40)
        .attr("width", 100)
        .attr("height", 30)
        .style("fill", "lightblue");
      
      svg.append("text")
        .attr("x", 90)
        .attr("y", 220 - i * 40)
        .text(value)
        .style("font-size", "14px");
    });
  };

  return (
    <Box p={3}>
      <Typography variant="h5">Stack Operations</Typography>
      <TextField label="Value" variant="outlined" value={input} onChange={(e) => setInput(e.target.value)} />
      <Box mt={2}>
        <Button variant="contained" onClick={() => { stack.push(input); setInput(""); setStack(new StackClass()); setStack(Object.assign(Object.create(Object.getPrototypeOf(stack)), stack)); }}>Push</Button>
        <Button variant="contained" onClick={() => { stack.pop(); setStack(new StackClass()); setStack(Object.assign(Object.create(Object.getPrototypeOf(stack)), stack)); }}>Pop</Button>
      </Box>
      <svg id="stack-visual" width="200" height="250"></svg>
    </Box>
  );
}
