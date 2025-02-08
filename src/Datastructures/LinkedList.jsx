import React, { useState, useEffect } from "react";
import { Button, TextField, Typography, Box } from "@mui/material";
import { select } from "d3";

class Node {
  constructor(value) {
    this.value = value;
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
      while (current.next) {
        current = current.next;
      }
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
      let current = this.head;
      let prev = null;
      let i = 0;
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
      let prev = null;
      let i = 0;
      while (i < index) {
        prev = current;
        current = current.next;
        i++;
      }
      prev.next = current.next;
    }
    this.size--;
  }

  // New method to remove the last node
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

  toArray() {
    const result = [];
    let current = this.head;
    while (current) {
      result.push(current.value);
      current = current.next;
    }
    return result;
  }
}

export default function LinkedList() {
  const [list, setList] = useState(new LinkedListClass());
  const [input, setInput] = useState("");
  const [index, setIndex] = useState("");
  const [mode, setMode] = useState("add");

  useEffect(() => {
    drawLinkedList();
  }, [list]);

  const drawLinkedList = () => {
    const svg = select("#linked-list-visual");
    svg.selectAll("*").remove();
    const nodes = list.toArray();

    nodes.forEach((node, i) => {
      // Draw nodes (circles)
      svg.append("circle")
        .attr("cx", i * 100 + 50)
        .attr("cy", 50)
        .attr("r", 20)
        .style("fill", "lightblue");

      svg.append("text")
        .attr("x", i * 100 + 45)
        .attr("y", 55)
        .text(node)
        .style("font-size", "14px");

      // Draw arrows between nodes
      if (i < nodes.length - 1) {
        svg.append("line")
          .attr("x1", i * 100 + 70)
          .attr("y1", 50)
          .attr("x2", i * 100 + 90)
          .attr("y2", 50)
          .style("stroke", "black");

        // Correct arrow direction: point right
        svg.append("polygon")
          .attr("points", `${i * 100 + 90},50 ${i * 100 + 95},45 ${i * 100 + 95},55`)
          .style("fill", "black");
      }
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#f4f4f9",
        padding: 3,
      }}
    >
      <Typography variant="h5" sx={{ marginBottom: 3, textAlign: "center" }}>
        Linked List Operations
      </Typography>

      <Box sx={{ marginBottom: 2, display: "flex", gap: 2 }}>
        {mode === "add" && (
          <TextField
            label="Value"
            variant="outlined"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            sx={{ width: 200 }}
          />
        )}
        {(mode === "insertAt" || mode === "removeAt") && (
          <>
            <TextField
              label="Value"
              variant="outlined"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              sx={{ width: 200 }}
            />
            <TextField
              label="Index"
              variant="outlined"
              value={index}
              onChange={(e) => setIndex(e.target.value)}
              sx={{ width: 100 }}
            />
          </>
        )}
      </Box>

      <Box sx={{ marginBottom: 3 }}>
        <Button
          variant="contained"
          onClick={() => {
            setMode("add");
            list.add(input);
            setList(new LinkedListClass());
            setList(Object.assign(Object.create(Object.getPrototypeOf(list)), list));
          }}
          sx={{ marginRight: 1 }}
        >
          Add
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            setMode("insertAt");
            list.insertAt(input, parseInt(index));
            setList(new LinkedListClass());
            setList(Object.assign(Object.create(Object.getPrototypeOf(list)), list));
          }}
          sx={{ marginRight: 1 }}
        >
          Insert At
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            setMode("removeAt");
            list.removeFrom(parseInt(index));
            setList(new LinkedListClass());
            setList(Object.assign(Object.create(Object.getPrototypeOf(list)), list));
          }}
          sx={{ marginRight: 1 }}
        >
          Remove At
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            list.reverse();
            setList(new LinkedListClass());
            setList(Object.assign(Object.create(Object.getPrototypeOf(list)), list));
          }}
          sx={{ marginRight: 1 }}
        >
          Reverse
        </Button>
        {/* Add the Remove Last Button */}
        <Button
          variant="contained"
          onClick={() => {
            list.removeLast();
            setList(new LinkedListClass());
            setList(Object.assign(Object.create(Object.getPrototypeOf(list)), list));
          }}
        >
          Remove Last
        </Button>
      </Box>

      <svg id="linked-list-visual" width="800" height="100" />
    </Box>
  );
}
