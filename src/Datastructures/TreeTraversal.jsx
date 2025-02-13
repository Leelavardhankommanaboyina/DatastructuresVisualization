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
import { motion } from "framer-motion";
import { Tree } from "react-d3-tree";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

// Basic binary tree node class.
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

// Converts a binary tree (TreeNode) into the format required by react-d3-tree.
// Each node is expected to have a 'name' string and a 'children' array (if non‑leaf).
const convertToD3Format = (node) => {
  if (!node) return null;
  return {
    name: node.value.toString(),
    children: [
      convertToD3Format(node.left),
      convertToD3Format(node.right),
    ].filter((child) => child !== null),
  };
};

// Returns an array of nodes (in the order they are visited) according to the specified traversal type.
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

const TreeTraversal = () => {
  // Input: comma-separated numbers (for example: "1,2,3,4,5,6")
  const [inputValues, setInputValues] = useState("");
  // d3 formatted tree data (for react-d3-tree)
  const [treeData, setTreeData] = useState(null);
  // Holds the value (as a string) of the currently highlighted node.
  const [currentNode, setCurrentNode] = useState("");
  // Holds the final traversal result (an array of values).
  const [traversalResult, setTraversalResult] = useState([]);
  // Holds the explanation steps for the traversal.
  const [traversalExplanations, setTraversalExplanations] = useState([]);
  // Indicates whether an animation is running.
  const [isTraversing, setIsTraversing] = useState(false);
  // Reference to the visualization container for PDF saving.
  const visualizationRef = useRef(null);

  // Build a binary tree (complete binary tree, level order) from comma-separated input.
  const buildBinaryTree = () => {
    const values = inputValues
      .split(",")
      .map((v) => parseInt(v.trim(), 10));
    if (!values.length || values.some(isNaN)) {
      alert("Please enter valid integers separated by commas");
      return null;
    }
    const root = new TreeNode(values[0]);
    const queue = [root];
    let index = 1;
    while (index < values.length) {
      const current = queue.shift();
      if (index < values.length) {
        current.left = new TreeNode(values[index]);
        queue.push(current.left);
        index++;
      }
      if (index < values.length) {
        current.right = new TreeNode(values[index]);
        queue.push(current.right);
        index++;
      }
    }
    return root;
  };

  // Animate the chosen traversal from the root.
  const animateTraversal = (root, type) => {
    const steps = getTraversalSteps(root, type);
    // Build the result array for display.
    const result = steps.map((node) => node.value);
    setTraversalResult(result);
    // Reset explanation steps.
    setTraversalExplanations([]);
    setIsTraversing(true);
    setCurrentNode(""); // reset current highlighted node

    steps.forEach((node, index) => {
      setTimeout(() => {
        setCurrentNode(node.value.toString());
        // Append an explanation for this step.
        setTraversalExplanations((prev) => [
          ...prev,
          `Step ${index + 1}: Visited node ${node.value} (${type} traversal)`,
        ]);
        if (index === steps.length - 1) {
          setIsTraversing(false);
        }
      }, index * 1000);
    });
  };

  // Handler invoked when a traversal button is clicked.
  const handleTraversal = (type) => {
    if (isTraversing) return;
    const root = buildBinaryTree();
    if (!root) return;
    // Reset any previous animation.
    setCurrentNode("");
    setTraversalResult([]);
    setTraversalExplanations([]);
    // Update the d3 tree data (for visualization).
    setTreeData(convertToD3Format(root));
    // Begin the chosen traversal animation.
    animateTraversal(root, type);
  };

  // Save the visualization (the container with the tree) as a PDF.
  const handleSaveVisualization = async () => {
    if (!visualizationRef.current) return;
    try {
      const canvas = await html2canvas(visualizationRef.current, {
        scale: 2,
        backgroundColor: "#fff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight);
      pdf.save("tree_visualization.pdf");
    } catch (error) {
      console.error("Error saving visualization", error);
    }
  };

  return (
    <Grid container spacing={2} sx={{ padding: 2 }}>
      {/* Left side: Input, traversal type buttons, and explanation */}
      <Grid item xs={12} md={4}>
        <Card sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography variant="h6" align="center" gutterBottom>
              Enter Node Values
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              label="Comma separated values"
              value={inputValues}
              onChange={(e) => setInputValues(e.target.value)}
              placeholder="Example: 1,2,3,4,5,6"
              disabled={isTraversing}
            />
          </CardContent>
        </Card>
        <Card sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography variant="h6" align="center" gutterBottom>
              Traversal Options
            </Typography>
            <Button
              fullWidth
              variant="contained"
              sx={{ marginBottom: 1 }}
              onClick={() => handleTraversal("preorder")}
              disabled={isTraversing || inputValues.trim() === ""}
            >
              Preorder
            </Button>
            <Button
              fullWidth
              variant="contained"
              sx={{ marginBottom: 1 }}
              onClick={() => handleTraversal("inorder")}
              disabled={isTraversing || inputValues.trim() === ""}
            >
              Inorder
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={() => handleTraversal("postorder")}
              disabled={isTraversing || inputValues.trim() === ""}
            >
              Postorder
            </Button>
          </CardContent>
        </Card>
        {/* Traversal Explanation Card */}
        <Card sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography variant="h6" align="center" gutterBottom>
              Traversal Explanation
            </Typography>
            {traversalExplanations.length === 0 ? (
              <Typography variant="body2" align="center">
                Click a traversal button to see step-by-step explanations.
              </Typography>
            ) : (
              traversalExplanations.map((exp, i) => (
                <Typography key={i} variant="body2">
                  {exp}
                </Typography>
              ))
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Right side: Visualization and traversal result */}
      <Grid item xs={12} md={8}>
        {/* Save Visualization Button */}
        <Box display="flex" justifyContent="center" mb={2}>
          <Button variant="outlined" onClick={handleSaveVisualization}>
            Save Visualization as PDF
          </Button>
        </Box>
        <Card sx={{ marginBottom: 2 }}>
          <CardContent sx={{ minHeight: 500 }}>
            <Typography variant="h6" align="center" gutterBottom>
              Binary Tree Visualization
            </Typography>
            <div
              ref={visualizationRef}
              style={{
                width: "100%",
                height: "600px",
                overflow: "auto",
                border: "1px solid #ccc",
                padding: "10px",
                backgroundColor: "#f9f9f9",
              }}
            >
              {treeData ? (
                <Tree
                  data={treeData}
                  orientation="vertical"
                  translate={{ x: 300, y: 100 }}
                  nodeSize={{ x: 120, y: 120 }}
                  separation={{ siblings: 1.5, nonSiblings: 1.5 }}
                  // Custom node renderer to animate the visited node.
                  renderCustomNodeElement={({ nodeDatum }) => (
                    <motion.g
                      initial={{ scale: 0 }}
                      animate={{
                        scale: nodeDatum.name === currentNode ? 1.2 : 1,
                        fill:
                          nodeDatum.name === currentNode
                            ? "#ff6b6b"
                            : "#4dabf7",
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <circle r={20} />
                      <text
                        fill="white"
                        strokeWidth={0}
                        x={0}
                        y={5}
                        textAnchor="middle"
                        fontSize={14}
                        fontWeight="bold"
                      >
                        {nodeDatum.name}
                      </text>
                    </motion.g>
                  )}
                />
              ) : (
                <Typography variant="body1" align="center">
                  Enter data and select a traversal method to see the tree.
                </Typography>
              )}
            </div>
          </CardContent>
        </Card>
        {traversalResult.length > 0 && (
          <Card>
            <CardContent>
              <Typography variant="h6" align="center" gutterBottom>
                Traversal Result
              </Typography>
              <Typography variant="body1" align="center" sx={{ fontSize: 18 }}>
                {traversalResult.join(" → ")}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Grid>
    </Grid>
  );
};

export default TreeTraversal;
