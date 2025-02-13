import React, { useState, useRef } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { Tree } from "react-d3-tree";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

/* ========================= */
/*         BST Classes       */
/* ========================= */

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
      if (node.left) {
        this.insertNode(node.left, newNode);
      } else {
        node.left = newNode;
      }
    } else {
      if (node.right) {
        this.insertNode(node.right, newNode);
      } else {
        node.right = newNode;
      }
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
      // Node with no children.
      if (!node.left && !node.right) return null;
      // Node with one child.
      if (!node.left) return node.right;
      if (!node.right) return node.left;
      // Node with two children: get the smallest in the right subtree.
      const minRight = this.findMinNode(node.right);
      node.value = minRight.value;
      node.right = this.deleteNode(node.right, minRight.value);
      return node;
    }
  }

  findMinNode(node) {
    return node.left ? this.findMinNode(node.left) : node;
  }

  // Convert the BST into a hierarchy format for react-d3-tree.
  // Each node gets a "childPosition" property: "Root" for the root,
  // "L" for left children, and "R" for right children.
  toHierarchy() {
    return this.convertToObject(this.root, "Root");
  }

  convertToObject(node, childPosition) {
    if (!node) return null;
    return {
      name: node.value.toString(),
      childPosition: childPosition,
      children: [
        this.convertToObject(node.left, "L"),
        this.convertToObject(node.right, "R"),
      ].filter((child) => child !== null),
    };
  }
}

/* ========================= */
/*  Traversal Helper Methods */
/* ========================= */

// Returns an array of nodes in the order they are visited for the specified traversal.
const getTraversalSteps = (root, type) => {
  const steps = [];
  if (type === "preorder") {
    const traversePreorder = (node) => {
      if (!node) return;
      steps.push(node);
      traversePreorder(node.left);
      traversePreorder(node.right);
    };
    traversePreorder(root);
  } else if (type === "inorder") {
    const traverseInorder = (node) => {
      if (!node) return;
      traverseInorder(node.left);
      steps.push(node);
      traverseInorder(node.right);
    };
    traverseInorder(root);
  } else if (type === "postorder") {
    const traversePostorder = (node) => {
      if (!node) return;
      traversePostorder(node.left);
      traversePostorder(node.right);
      steps.push(node);
    };
    traversePostorder(root);
  }
  return steps;
};

/* ========================= */
/*    BST Visualization      */
/* ========================= */

const BSTVisualization = () => {
  // State for BST operations and logs.
  const [bst, setBst] = useState(new BST());
  const [input, setInput] = useState("");
  const [logs, setLogs] = useState([]);

  // State for tree traversal (highlighting and result).
  const [currentNode, setCurrentNode] = useState("");
  const [traversalResult, setTraversalResult] = useState([]);
  const [isTraversing, setIsTraversing] = useState(false);

  // Reference to the container holding the tree diagram (for saving as PDF).
  const visualizationRef = useRef(null);

  // Prepare tree data from the current BST for react-d3-tree.
  const treeData = bst.root ? bst.toHierarchy() : null;

  /* ---------- BST Operations ---------- */

  const handleInsert = () => {
    if (input === "") return;
    const value = parseInt(input, 10);
    const newBst = new BST();
    // Clone the existing BST structure.
    Object.assign(newBst, bst);
    newBst.insert(value);
    setBst(newBst);
    setLogs((prev) => [...prev, `Inserted ${value}`]);
    setInput("");
  };

  const handleDelete = () => {
    if (input === "") return;
    const value = parseInt(input, 10);
    const newBst = new BST();
    Object.assign(newBst, bst);
    newBst.delete(value);
    setBst(newBst);
    setLogs((prev) => [...prev, `Deleted ${value}`]);
    setInput("");
  };

  /* ---------- Traversal Operations ---------- */

  const animateTraversal = (root, type) => {
    const steps = getTraversalSteps(root, type);
    // Build and set the traversal result.
    setTraversalResult(steps.map((node) => node.value));
    setIsTraversing(true);
    setCurrentNode(""); // Reset current highlight.
    steps.forEach((node, index) => {
      setTimeout(() => {
        setCurrentNode(node.value.toString());
        if (index === steps.length - 1) {
          setIsTraversing(false);
        }
      }, index * 1000);
    });
  };

  const handleTraversal = (type) => {
    if (!bst.root || isTraversing) return;
    animateTraversal(bst.root, type);
  };

  /* ---------- Save Visualization ---------- */

  const handleSaveVisualization = async () => {
    if (!visualizationRef.current) return;
    try {
      const canvas = await html2canvas(visualizationRef.current, {
        scale: 2,
        backgroundColor: "#fff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight);
      pdf.save("bst_visualization.pdf");
    } catch (error) {
      console.error("Error saving visualization", error);
    }
  };

  return (
    <Grid container spacing={2} sx={{ padding: 2 }}>
      {/* Header */}
      <Grid item xs={12}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ marginBottom: 2 }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            BST Visualization & Traversal
          </Typography>
          <Button
            variant="outlined"
            onClick={handleSaveVisualization}
            type="button"
          >
            Save Visualization as PDF
          </Button>
        </Box>
      </Grid>

      {/* Left Panel: BST Operations & Logs */}
      <Grid item xs={12} md={4}>
        <Card sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography variant="h6" align="center" gutterBottom>
              BST Operations
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              label="Enter value"
              value={input}
              onChange={(e) =>
                setInput(e.target.value.replace(/[^0-9]/g, ""))
              }
              placeholder="Example: 5"
              sx={{ marginBottom: 2 }}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleInsert}
              type="button"
              sx={{ marginBottom: 1 }}
            >
              Insert
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="error"
              onClick={handleDelete}
              type="button"
            >
              Delete
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h6" align="center" gutterBottom>
              Operation Logs
            </Typography>
            {logs.length === 0 ? (
              <Typography variant="body2" align="center">
                No operations yet.
              </Typography>
            ) : (
              logs.map((log, index) => (
                <Typography key={index} variant="body2">
                  {log}
                </Typography>
              ))
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Right Panel: Traversal Buttons, Visualization, and Result */}
      <Grid item xs={12} md={8}>
        {/* Traversal Buttons */}
        <Box
          display="flex"
          justifyContent="center"
          gap={2}
          mb={2}
          flexWrap="wrap"
        >
          <Button
            variant="contained"
            onClick={() => handleTraversal("preorder")}
            disabled={isTraversing || !bst.root}
            type="button"
          >
            Preorder
          </Button>
          <Button
            variant="contained"
            onClick={() => handleTraversal("inorder")}
            disabled={isTraversing || !bst.root}
            type="button"
          >
            Inorder
          </Button>
          <Button
            variant="contained"
            onClick={() => handleTraversal("postorder")}
            disabled={isTraversing || !bst.root}
            type="button"
          >
            Postorder
          </Button>
        </Box>

        {/* BST Diagram */}
        <Card>
          <CardContent ref={visualizationRef} sx={{ minHeight: 500 }}>
            {treeData ? (
              <div style={{ width: "100%", height: "600px" }}>
                <Tree
                  data={treeData}
                  orientation="vertical"
                  translate={{ x: 300, y: 100 }}
                  nodeSize={{ x: 120, y: 120 }}
                  separation={{ siblings: 1.5, nonSiblings: 1.5 }}
                  // Custom node renderer: shows the node value and a small box (if not the root)
                  // indicating if the node is a left ("L") or right ("R") child.
                  renderCustomNodeElement={({ nodeDatum }) => (
                    <motion.g
                      initial={{ scale: 0 }}
                      animate={{
                        scale: nodeDatum.name === currentNode ? 1.2 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <circle
                        r={20}
                        fill="#4dabf7"
                        stroke="#1e88e5"
                        strokeWidth={2}
                      />
                      <text
                        fill="white"
                        x={0}
                        y={5}
                        textAnchor="middle"
                        fontSize={14}
                        fontWeight="bold"
                      >
                        {nodeDatum.name}
                      </text>
                      {nodeDatum.childPosition &&
                        nodeDatum.childPosition !== "Root" && (
                          <>
                            <rect
                              x={-10}
                              y={25}
                              width={20}
                              height={15}
                              fill="#ff6b6b"
                              rx={3}
                              ry={3}
                            />
                            <text
                              x={0}
                              y={25 + 12}
                              textAnchor="middle"
                              fill="white"
                              fontSize={10}
                            >
                              {nodeDatum.childPosition}
                            </text>
                          </>
                        )}
                    </motion.g>
                  )}
                />
              </div>
            ) : (
              <Typography variant="body1" align="center">
                Insert nodes to see the BST.
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Traversal Result */}
        {traversalResult.length > 0 && (
          <Card sx={{ marginTop: 2 }}>
            <CardContent>
              <Typography variant="h6" align="center" gutterBottom>
                Traversal Result
              </Typography>
              <Typography
                variant="body1"
                align="center"
                sx={{ fontSize: 18, fontWeight: "bold" }}
              >
                {traversalResult.join(" → ")}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Grid>
    </Grid>
  );
};

export default BSTVisualization;
