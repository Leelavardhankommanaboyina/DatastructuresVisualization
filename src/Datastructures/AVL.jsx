import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { Tree } from "react-d3-tree";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

/* ========================= */
/*         AVL Node          */
/* ========================= */

class AVLNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}

/* ========================= */
/*      AVL Helper Functions */
/* ========================= */

const getHeight = (node) => (node ? node.height : 0);

const updateHeight = (node) => {
  node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));
};

const getBalance = (node) => (node ? getHeight(node.left) - getHeight(node.right) : 0);

const rotateRight = (y) => {
  const x = y.left;
  const T2 = x.right;

  x.right = y;
  y.left = T2;

  updateHeight(y);
  updateHeight(x);

  return x;
};

const rotateLeft = (x) => {
  const y = x.right;
  const T2 = y.left;

  y.left = x;
  x.right = T2;

  updateHeight(x);
  updateHeight(y);

  return y;
};

const insertNode = (node, value) => {
  if (!node) return new AVLNode(value);

  if (value < node.value) {
    node.left = insertNode(node.left, value);
  } else if (value > node.value) {
    node.right = insertNode(node.right, value);
  } else {
    // Duplicate values are not allowed.
    return node;
  }

  updateHeight(node);
  const balance = getBalance(node);

  // Left Left Case
  if (balance > 1 && value < node.left.value) return rotateRight(node);

  // Right Right Case
  if (balance < -1 && value > node.right.value) return rotateLeft(node);

  // Left Right Case
  if (balance > 1 && value > node.left.value) {
    node.left = rotateLeft(node.left);
    return rotateRight(node);
  }

  // Right Left Case
  if (balance < -1 && value < node.right.value) {
    node.right = rotateRight(node.right);
    return rotateLeft(node);
  }

  return node;
};

const minValueNode = (node) => {
  let current = node;
  while (current.left !== null) {
    current = current.left;
  }
  return current;
};

const deleteAVLNode = (node, value) => {
  if (!node) return node;

  if (value < node.value) {
    node.left = deleteAVLNode(node.left, value);
  } else if (value > node.value) {
    node.right = deleteAVLNode(node.right, value);
  } else {
    // Node to be deleted found.
    if (!node.left || !node.right) {
      let temp = node.left ? node.left : node.right;
      if (!temp) {
        // No child case.
        node = null;
      } else {
        // One child case.
        node = temp;
      }
    } else {
      // Node with two children: get the inorder successor (smallest in the right subtree)
      let temp = minValueNode(node.right);
      node.value = temp.value;
      node.right = deleteAVLNode(node.right, temp.value);
    }
  }

  if (!node) return node;

  updateHeight(node);
  const balance = getBalance(node);

  // Left Left Case
  if (balance > 1 && getBalance(node.left) >= 0) return rotateRight(node);

  // Left Right Case
  if (balance > 1 && getBalance(node.left) < 0) {
    node.left = rotateLeft(node.left);
    return rotateRight(node);
  }

  // Right Right Case
  if (balance < -1 && getBalance(node.right) <= 0) return rotateLeft(node);

  // Right Left Case
  if (balance < -1 && getBalance(node.right) > 0) {
    node.right = rotateRight(node.right);
    return rotateLeft(node);
  }

  return node;
};

/* ========================= */
/*  Convert to D3 Format     */
/* ========================= */

// Adds a "childPosition" property ("Root", "L", or "R") so that our custom
// node renderer can display a marker.
const convertToD3Format = (node, childPosition = "Root") => {
  if (!node) return null;
  return {
    name: node.value.toString(),
    childPosition: childPosition,
    children: [
      convertToD3Format(node.left, "L"),
      convertToD3Format(node.right, "R"),
    ].filter(Boolean),
  };
};

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
/*    Check for Duplicates   */
/* ========================= */

// Recursively search the AVL tree for a given value.
const containsValue = (node, value) => {
  if (!node) return false;
  if (node.value === value) return true;
  return value < node.value
    ? containsValue(node.left, value)
    : containsValue(node.right, value);
};

/* ========================= */
/*    AVL Tree Visualizer    */
/* ========================= */

const AVLTreeVisualizer = () => {
  // State variables.
  const [treeData, setTreeData] = useState(null);
  const [currentNode, setCurrentNode] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [traversalResult, setTraversalResult] = useState([]);
  const [isTraversing, setIsTraversing] = useState(false);
  const [logs, setLogs] = useState([]);

  // References.
  const visualizationRef = useRef(null);
  // This ref will store the current AVL tree root.
  const avlTreeRef = useRef(null);

  // Insert a single node into the AVL tree.
  const handleInsert = () => {
    if (inputValue === "") return;
    const value = parseInt(inputValue.trim(), 10);
    if (isNaN(value)) {
      alert("Please enter a valid integer.");
      return;
    }
    // Check for duplicate.
    if (containsValue(avlTreeRef.current, value)) {
      setLogs((prev) => [
        ...prev,
        `Duplicate not allowed: your value ${value} is already present in AVL.`,
      ]);
      setInputValue("");
      return;
    }
    avlTreeRef.current = insertNode(avlTreeRef.current, value);
    setLogs((prev) => [...prev, `Inserted ${value}`]);
    setTreeData(convertToD3Format(avlTreeRef.current));
    setInputValue("");
  };

  // Delete a single node from the AVL tree.
  const handleDelete = () => {
    if (inputValue === "") return;
    const value = parseInt(inputValue.trim(), 10);
    if (isNaN(value)) {
      alert("Please enter a valid integer.");
      return;
    }
    avlTreeRef.current = deleteAVLNode(avlTreeRef.current, value);
    setLogs((prev) => [...prev, `Deleted ${value}`]);
    setTreeData(convertToD3Format(avlTreeRef.current));
    setInputValue("");
  };

  // Animate a traversal (preorder, inorder, or postorder).
  const animateTraversal = (root, type) => {
    const steps = getTraversalSteps(root, type);
    const result = steps.map((node) => node.value);
    setTraversalResult(result);
    setIsTraversing(true);
    setCurrentNode("");
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
    if (!avlTreeRef.current || isTraversing) return;
    animateTraversal(avlTreeRef.current, type);
  };

  // Save the AVL tree visualization as a PDF.
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
      pdf.save("avl_tree_visualization.pdf");
    } catch (error) {
      console.error("Error saving visualization", error);
    }
  };

  return (
    <Grid container spacing={3} style={{ padding: 20 }}>
      {/* Header */}
      <Grid item xs={12}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" style={{ fontWeight: "bold" }}>
            AVL Tree Visualization & Traversal
          </Typography>
          <Button variant="outlined" onClick={handleSaveVisualization} type="button">
            Save Visualization as PDF
          </Button>
        </Box>
      </Grid>

      {/* Left Panel: Operations & Logs */}
      <Grid item xs={12} md={4}>
        <Card elevation={3} style={{ marginBottom: 20 }}>
          <CardContent>
            <Typography variant="h6" align="center" gutterBottom>
              AVL Tree Operations
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              label="Enter node value"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value.replace(/[^0-9\-]/g, ""))}
              placeholder="Example: 10"
              disabled={isTraversing}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleInsert}
              style={{ marginTop: 15 }}
              disabled={isTraversing}
              type="button"
            >
              Insert
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="error"
              onClick={handleDelete}
              style={{ marginTop: 10 }}
              disabled={isTraversing}
              type="button"
            >
              Delete
            </Button>
          </CardContent>
        </Card>
        <Card elevation={3}>
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
        <Box display="flex" justifyContent="center" gap={2} mb={2} flexWrap="wrap">
          <Button
            variant="contained"
            onClick={() => handleTraversal("preorder")}
            disabled={isTraversing || !avlTreeRef.current}
            type="button"
          >
            Preorder
          </Button>
          <Button
            variant="contained"
            onClick={() => handleTraversal("inorder")}
            disabled={isTraversing || !avlTreeRef.current}
            type="button"
          >
            Inorder
          </Button>
          <Button
            variant="contained"
            onClick={() => handleTraversal("postorder")}
            disabled={isTraversing || !avlTreeRef.current}
            type="button"
          >
            Postorder
          </Button>
        </Box>
        <Card elevation={3}>
          <CardContent ref={visualizationRef} style={{ minHeight: 400 }}>
            <Typography variant="h6" align="center" gutterBottom>
              AVL Tree Structure
            </Typography>
            {treeData ? (
              <div style={{ width: "100%", height: 600 }}>
                <Tree
                  data={treeData}
                  orientation="vertical"
                  translate={{ x: 300, y: 100 }}
                  nodeSize={{ x: 120, y: 120 }}
                  separation={{ siblings: 1.5, nonSiblings: 1.5 }}
                  renderCustomNodeElement={({ nodeDatum }) => (
                    <motion.g
                      initial={{ scale: 0 }}
                      animate={{ scale: nodeDatum.name === currentNode ? 1.2 : 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <circle r={20} fill="#4dabf7" stroke="#1e88e5" strokeWidth={2} />
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
                      {nodeDatum.childPosition && nodeDatum.childPosition !== "Root" && (
                        <>
                          <rect x={-10} y={25} width={20} height={15} fill="#ff6b6b" rx={3} ry={3} />
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
                Insert nodes to build the AVL Tree.
              </Typography>
            )}
          </CardContent>
        </Card>
        {traversalResult.length > 0 && (
          <Card elevation={3} style={{ marginTop: 20 }}>
            <CardContent>
              <Typography variant="h6" align="center" gutterBottom>
                Traversal Result
              </Typography>
              <Typography
                variant="body1"
                align="center"
                style={{ fontSize: 18, fontWeight: "bold" }}
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

export default AVLTreeVisualizer;
