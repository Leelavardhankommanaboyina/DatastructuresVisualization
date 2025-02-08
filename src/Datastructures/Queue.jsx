import React, { useState, useEffect } from "react";
import { Button, TextField, Typography, Box } from "@mui/material";
import { select } from "d3";

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
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    drawQueue();
  }, [queue]);

  const drawQueue = () => {
    const svg = select("#queue-visual");
    svg.selectAll("*").remove();
    const elements = queue.toArray();
    elements.forEach((value, i) => {
      svg.append("rect")
        .attr("x", i * 80 + 20)
        .attr("y", 50)
        .attr("width", 60)
        .attr("height", 40)
        .style("fill", "lightgreen");
      
      svg.append("text")
        .attr("x", i * 80 + 45)
        .attr("y", 75)
        .text(value)
        .style("font-size", "14px");
    });
  };

  return (
    <Box p={3}>
      <Typography variant="h5">Queue Operations</Typography>
      <TextField label="Value" variant="outlined" value={input} onChange={(e) => setInput(e.target.value)} />
      <Box mt={2}>
        <Button variant="contained" onClick={() => { queue.enqueue(input); setInput(""); setQueue(new QueueClass()); setQueue(Object.assign(Object.create(Object.getPrototypeOf(queue)), queue)); }}>Rear (Enqueue)</Button>
        <Button variant="contained" onClick={() => { queue.dequeue(); setQueue(new QueueClass()); setQueue(Object.assign(Object.create(Object.getPrototypeOf(queue)), queue)); }}>Front (Dequeue)</Button>
      </Box>
      <svg id="queue-visual" width="600" height="150"></svg>
    </Box>
  );
}
