import React, { useState, useEffect } from "react";
import { Button, TextField, Typography, Box } from "@mui/material";
import { select, tree, hierarchy, linkVertical } from "d3";

class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BST {
  constructor() {
    this.root = null;
  }

  insert(value) {
    const newNode = new Node(value);
    if (!this.root) {
      this.root = newNode;
    } else {
      this.insertNode(this.root, newNode);
    }
  }

  insertNode(node, newNode) {
    if (newNode.value < node.value) {
      node.left ? this.insertNode(node.left, newNode) : node.left = newNode;
    } else {
      node.right ? this.insertNode(node.right, newNode) : node.right = newNode;
    }
  }

  delete(value) {
    this.root = this.deleteNode(this.root, value);
  }

  deleteNode(node, value) {
    if (!node) return null;

    if (value < node.value) {
      node.left = this.deleteNode(node.left, value);
      return node;
    } else if (value > node.value) {
      node.right = this.deleteNode(node.right, value);
      return node;
    } else {
      if (!node.left && !node.right) return null;
      if (!node.left) return node.right;
      if (!node.right) return node.left;

      const minRight = this.findMinNode(node.right);
      node.value = minRight.value;
      node.right = this.deleteNode(node.right, minRight.value);
      return node;
    }
  }

  findMinNode(node) {
    return node.left ? this.findMinNode(node.left) : node;
  }

  toHierarchy() {
    return this.convertToObject(this.root);
  }

  convertToObject(node) {
    if (!node) return null;
    return {
      name: node.value.toString(),
      children: [
        this.convertToObject(node.left),
        this.convertToObject(node.right)
      ].filter(child => child !== null)
    };
  }
}

const BSTVisualization = () => {
  const [bst, setBst] = useState(new BST());
  const [input, setInput] = useState("");
  const [operation, setOperation] = useState("insert");
  const [treeData, setTreeData] = useState(null);

  useEffect(() => {
    updateTree();
  }, [bst]);

  const updateTree = () => {
    const data = bst.toHierarchy();
    setTreeData(data);
    drawTree(data);
  };

  const drawTree = (data) => {
    if (!data) return;

    const svg = select("#bst-svg");
    svg.selectAll("*").remove();

    const width = 1000;
    const height = 600;
    const margin = { top: 20, right: 20, bottom: 20, left: 100};

    const root = hierarchy(data);
    const treeLayout = tree()
      .size([height - margin.top - margin.bottom, width - margin.left - margin.right])  // Adjusted tree layout size
      .nodeSize([50, 100]);  // Adjust node size for better spacing

    treeLayout(root);

    // Position nodes more compactly and adjust the left subtree layout
    const nodes = root.descendants();
    nodes.forEach(d => {
      d.y = d.depth * 150;  // Increase vertical spacing between levels
    });

    // Draw links
    svg.selectAll(".link")
      .data(root.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", linkVertical()
        .x(d => d.x + margin.left)
        .y(d => d.y + margin.top))
      .attr("fill", "none")
      .attr("stroke", "#666")
      .attr("stroke-width", 1.5);

    // Draw nodes
    const nodeGroups = svg.selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x + margin.left},${d.y + margin.top})`);

    nodeGroups.append("circle")
      .attr("r", 18)
      .attr("fill", "#4CAF50")
      .attr("stroke", "#388E3C")
      .attr("stroke-width", 1.5);

    nodeGroups.append("text")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .style("font-size", "12px")
      .text(d => d.data.name);
  };

  const handleOperation = () => {
    if (!input) return;

    const value = parseInt(input);
    const newBst = new BST();
    Object.assign(newBst, bst);

    if (operation === "insert") {
      newBst.insert(value);
    } else {
      newBst.delete(value);
    }

    setBst(newBst);
    setInput("");
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom sx={{ color: "#2c3e50", fontWeight: "bold" }}>
        Compact BST Visualization
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <TextField
          label="Enter value"
          variant="outlined"
          value={input}
          onChange={(e) => setInput(e.target.value.replace(/[^0-9]/g, ""))}
          sx={{ width: 200 }}
        />

        <Button
          variant="contained"
          color={operation === "insert" ? "primary" : "secondary"}
          onClick={() => setOperation("insert")}
        >
          Insert
        </Button>

        <Button
          variant="contained"
          color={operation === "delete" ? "primary" : "secondary"}
          onClick={() => setOperation("delete")}
        >
          Delete
        </Button>

        <Button
          variant="contained"
          color="success"
          onClick={handleOperation}
          sx={{ ml: 2 }}
        >
          Execute {operation}
        </Button>
      </Box>

      {/* Centering the SVG inside the card */}
      <Box sx={{
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: 600,  // Fixed height
  border: "2px solid #ddd",
  borderRadius: "8px",
  backgroundColor: "white",
  margin: "0 auto",
  width: "100%",
  overflow: "auto",  // Make the box scrollable
}}>
  <svg
    id="bst-svg"
    width="1000"
    height="600"
    style={{
      maxWidth: "100%",
    }}
  ></svg>
</Box>


      <Box mt={4} sx={{ backgroundColor: "white", p: 3, borderRadius: "4px" }}>
        <Typography variant="h6" gutterBottom>Operation Guide:</Typography>
        <ul>
          <li><strong>Insert:</strong> Enter number → Click Insert → Execute</li>
          <li><strong>Delete:</strong> Enter existing number → Click Delete → Execute</li>
          <li>Nodes automatically arrange with compact spacing</li>
          <li>Connection lines show parent-child relationships</li>
        </ul>
      </Box>
    </Box>
  );
};

export default BSTVisualization;
