import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  Grid,
  AppBar,
  Toolbar
} from "@mui/material";
import { select } from "d3-selection";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

/* ------------------------- */
/* Linked List Classes       */
/* ------------------------- */

class Node {
  constructor(value) {
    this.value = value;
    this.address = "0x" + Math.floor(Math.random() * 0xffffff).toString(16);
    this.next = null;
  }
}

class LinkedListClass {
  constructor() {
    this.head = null;
    this.size = 0;
  }

  add(value) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
    } else {
      let current = this.head;
      while (current.next) current = current.next;
      current.next = newNode;
    }
    this.size++;
  }

  insertAt(value, index) {
    if (index < 0 || index > this.size) return;
    const newNode = new Node(value);
    if (index === 0) {
      newNode.next = this.head;
      this.head = newNode;
    } else {
      let current = this.head,
        prev = null,
        i = 0;
      while (i < index) {
        prev = current;
        current = current.next;
        i++;
      }
      newNode.next = current;
      prev.next = newNode;
    }
    this.size++;
  }

  removeFrom(index) {
    if (index < 0 || index >= this.size) return;
    let current = this.head;
    if (index === 0) {
      this.head = current.next;
    } else {
      let prev = null,
        i = 0;
      while (i < index) {
        prev = current;
        current = current.next;
        i++;
      }
      prev.next = current.next;
    }
    this.size--;
  }

  removeLast() {
    if (this.size === 0) return;
    let current = this.head;
    if (this.size === 1) {
      this.head = null;
    } else {
      let prev = null;
      while (current.next) {
        prev = current;
        current = current.next;
      }
      prev.next = null;
    }
    this.size--;
  }

  reverse() {
    let prev = null;
    let current = this.head;
    while (current) {
      let next = current.next;
      current.next = prev;
      prev = current;
      current = next;
    }
    this.head = prev;
  }

  // Return an array of nodes for easy iteration in the visualization.
  toArray() {
    const result = [];
    let current = this.head;
    while (current) {
      result.push(current);
      current = current.next;
    }
    return result;
  }
}

/* ------------------------- */
/* Linked List Visualization */
/* ------------------------- */

export default function LinkedListVisualization() {
  const [list, setList] = useState(new LinkedListClass());
  const [input, setInput] = useState("");
  const [index, setIndex] = useState("");
  const [logs, setLogs] = useState([]);
  const svgRef = useRef();

  // Redraw linked list whenever the list changes.
  useEffect(() => {
    drawLinkedList();
  }, [list]);

  const drawLinkedList = () => {
    const svg = select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous drawings

    const nodes = list.toArray();
    const nodeWidth = 150; // increased width for two halves
    const nodeHeight = 60;
    const spacing = 50;
    const startX = 50;
    const startY = 50;

    // Define arrow marker for pointers.
    svg.append("defs")
      .append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 5)
      .attr("refY", 5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto-start-reverse")
      .append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z")
      .attr("fill", "#000");

    nodes.forEach((node, i) => {
      const x = startX + i * (nodeWidth + spacing);
      const y = startY;
      const group = svg.append("g").attr("transform", `translate(${x}, ${y})`);

      // Draw the node's outer rectangle.
      group.append("rect")
        .attr("width", nodeWidth)
        .attr("height", nodeHeight)
        .attr("rx", 10)
        .attr("ry", 10)
        .attr("fill", "#e3f2fd")
        .attr("stroke", "#0d47a1")
        .attr("stroke-width", 2);

      // Draw vertical divider between data and pointer.
      group.append("line")
        .attr("x1", nodeWidth / 2)
        .attr("y1", 0)
        .attr("x2", nodeWidth / 2)
        .attr("y2", nodeHeight)
        .attr("stroke", "#0d47a1")
        .attr("stroke-width", 2);

      // Left half: Display node data.
      group.append("text")
        .attr("x", nodeWidth / 4)
        .attr("y", nodeHeight / 2)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .style("font-size", "16px")
        .style("fill", "#0d47a1")
        .text(node.value);

      // Right half: Display address of the next node (or "null").
      group.append("text")
        .attr("x", (3 * nodeWidth) / 4)
        .attr("y", nodeHeight / 2)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .style("font-size", "12px")
        .style("fill", "#424242")
        .text(node.next ? node.next.address : "null");

      // Below the node: Display the current node's own address.
      group.append("text")
        .attr("x", nodeWidth / 2)
        .attr("y", nodeHeight + 15)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .style("font-size", "10px")
        .style("fill", "#757575")
        .text(node.address);

      // Draw arrow to the next node (if any).
      if (i < nodes.length - 1) {
        const arrowStartX = x + nodeWidth;
        const arrowStartY = y + nodeHeight / 2;
        const arrowEndX = x + nodeWidth + spacing;
        const arrowEndY = arrowStartY;
        svg.append("line")
          .attr("x1", arrowStartX)
          .attr("y1", arrowStartY)
          .attr("x2", arrowEndX)
          .attr("y2", arrowEndY)
          .attr("stroke", "#000")
          .attr("stroke-width", 2)
          .attr("marker-end", "url(#arrow)");
      }
    });
  };

  /* Operation Handlers with Logging */

  const handleAdd = () => {
    if (!input) return;
    list.add(input);
    setList(Object.assign(Object.create(Object.getPrototypeOf(list)), list));
    setLogs((prev) => [...prev, `Added node with value "${input}"`]);
    setInput("");
  };

  const handleInsertAt = () => {
    if (!input || index === "") return;
    list.insertAt(input, parseInt(index, 10));
    setList(Object.assign(Object.create(Object.getPrototypeOf(list)), list));
    setLogs((prev) => [
      ...prev,
      `Inserted node with value "${input}" at index ${index}`
    ]);
    setInput("");
    setIndex("");
  };

  const handleRemoveAt = () => {
    if (index === "") return;
    list.removeFrom(parseInt(index, 10));
    setList(Object.assign(Object.create(Object.getPrototypeOf(list)), list));
    setLogs((prev) => [...prev, `Removed node at index ${index}`]);
    setIndex("");
  };

  const handleRemoveLast = () => {
    list.removeLast();
    setList(Object.assign(Object.create(Object.getPrototypeOf(list)), list));
    setLogs((prev) => [...prev, "Removed last node"]);
  };

  const handleReverse = () => {
    list.reverse();
    setList(Object.assign(Object.create(Object.getPrototypeOf(list)), list));
    setLogs((prev) => [...prev, "Reversed the list"]);
  };

  /* Save Visualization (captures both the linked list and the logs) */
  const handleSaveVisualization = async () => {
    // Capture the wrapper that contains both the visualization and logs.
    const element = document.getElementById("visualization-wrapper");
    if (!element) return;
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#fff"
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "mm", [
        canvas.width * 0.264583,
        canvas.height * 0.264583
      ]);
      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        canvas.width * 0.264583,
        canvas.height * 0.264583
      );
      pdf.save("linked_list_visualization.pdf");
    } catch (error) {
      console.error("Error saving visualization", error);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      {/* AppBar with title and Save button */}
      <AppBar position="static" sx={{ mb: 3, backgroundColor: "#1976d2" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Linked List Visualization
          </Typography>
          <Button color="inherit" onClick={handleSaveVisualization}>
            Save Visualization
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: "1200px", margin: "auto" }}>
        <Typography variant="h5" align="center" gutterBottom>
          Linked List Operations
        </Typography>

        {/* Input fields */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Value"
              variant="outlined"
              fullWidth
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Index"
              variant="outlined"
              fullWidth
              value={index}
              onChange={(e) => setIndex(e.target.value)}
            />
          </Grid>
        </Grid>

        {/* Button container */}
        <Box
          sx={{
            mb: 2,
            border: "1px solid #ccc",
            p: 1,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1
          }}
        >
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="contained" onClick={handleAdd}>
              Add
            </Button>
            <Button variant="contained" onClick={handleRemoveLast}>
              Remove
            </Button>
            <Button variant="contained" onClick={handleInsertAt}>
              Insert At
            </Button>
            <Button variant="contained" onClick={handleRemoveAt}>
              Remove At
            </Button>
            <Button variant="contained" onClick={handleReverse}>
              Reverse
            </Button>
          </Box>
        </Box>

        {/* Wrapper for both the visualization and the operations log */}
        <Box
          id="visualization-wrapper"
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "space-between",
            flexWrap: { xs: "wrap", md: "nowrap" }
          }}
        >
          {/* Visualization Box */}
          <Box
            id="linked-list-container"
            sx={{
              border: "1px solid #ccc",
              p: 2,
              backgroundColor: "#f9f9f9",
              overflow: "auto",
              flex: 1,
              maxHeight: "400px"
            }}
          >
            <svg ref={svgRef} width="1500" height="300" />
          </Box>

          {/* Operations Log Box */}
          <Box
            id="logs-container"
            sx={{
              border: "1px solid #ccc",
              p: 2,
              backgroundColor: "#fff",
              overflow: "auto",
              width: { xs: "100%", md: "300px" },
              maxHeight: "400px"
            }}
          >
            <Typography variant="h6" gutterBottom>
              Operations Log
            </Typography>
            {logs.length === 0 ? (
              <Typography variant="body2" color="textSecondary">
                No operations yet.
              </Typography>
            ) : (
              logs.map((log, i) => (
                <Typography key={i} variant="body2">
                  {log}
                </Typography>
              ))
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
