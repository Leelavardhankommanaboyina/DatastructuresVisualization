import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, Grid, Typography, TextField, Button } from "@mui/material";
import { Tree } from "react-d3-tree";

class AVLNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}

const AVLTreeVisualizer = () => {
  const [treeData, setTreeData] = useState(null);
  const [currentNode, setCurrentNode] = useState('');
  const [inputValues, setInputValues] = useState('');
  const [traversalResult, setTraversalResult] = useState([]);
  const [isTraversing, setIsTraversing] = useState(false);

  // AVL Tree helper functions
  const getHeight = (node) => node ? node.height : 0;
  
  const updateHeight = (node) => {
    node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));
  };

  const getBalance = (node) => {
    return node ? getHeight(node.left) - getHeight(node.right) : 0;
  };

  // AVL Rotations
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

  // AVL Insertion
  const insertNode = (node, value) => {
    if (!node) return new AVLNode(value);

    if (value < node.value) {
      node.left = insertNode(node.left, value);
    } else if (value > node.value) {
      node.right = insertNode(node.right, value);
    } else {
      return node; // Duplicate values not allowed
    }

    updateHeight(node);
    const balance = getBalance(node);

    // Left Left Case
    if (balance > 1 && value < node.left.value) {
      return rotateRight(node);
    }

    // Right Right Case
    if (balance < -1 && value > node.right.value) {
      return rotateLeft(node);
    }

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

  // Convert AVL tree to D3.js format
  const convertToD3Format = (node) => {
    if (!node) return null;
    return {
      name: node.value.toString(),
      children: [
        convertToD3Format(node.left),
        convertToD3Format(node.right)
      ].filter(Boolean)
    };
  };

  // Inorder traversal with visualization
  const animateInorderTraversal = (root) => {
    const traversalSteps = [];
    const result = [];
    
    const traverse = (node) => {
      if (!node) return;
      traverse(node.left);
      traversalSteps.push(node);
      result.push(node.value);
      traverse(node.right);
    };

    traverse(root);
    setTraversalResult(result);
    setIsTraversing(true);

    traversalSteps.forEach((node, index) => {
      setTimeout(() => {
        setCurrentNode(node.value.toString());
        if (index === traversalSteps.length - 1) {
          setIsTraversing(false);
        }
      }, index * 1000);
    });
  };

  // Build AVL tree from input values
  const buildAVLTree = () => {
    const values = inputValues.split(',').map(val => parseInt(val.trim(), 10));
    
    if (!values.length || values.some(isNaN)) {
      alert("Please enter valid integers separated by commas");
      return;
    }

    let root = null;
    values.forEach(value => {
      root = insertNode(root, value);
    });

    setTreeData(convertToD3Format(root));
    animateInorderTraversal(root);
  };

  return (
    <Grid container spacing={3} justifyContent="center" style={{ padding: 20 }}>
      {/* Input Section */}
      <Grid item xs={12} md={8}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h5" gutterBottom align="center">
              AVL Tree Visualization
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              label="Enter node values (comma separated)"
              value={inputValues}
              onChange={(e) => setInputValues(e.target.value)}
              placeholder="Example: 10,20,30,40,50,25"
              disabled={isTraversing}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={buildAVLTree}
              style={{ marginTop: 15 }}
              disabled={isTraversing}
            >
              {isTraversing ? 'Traversing...' : 'Build AVL Tree'}
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Tree Visualization */}
      <Grid item xs={12} md={10}>
        <Card elevation={3}>
          <CardContent style={{ minHeight: 400 }}>
            <Typography variant="h6" align="center" gutterBottom>
              AVL Tree Structure
            </Typography>
            {treeData && (
              <Tree
                data={treeData}
                orientation="vertical"
                translate={{ x: 300, y: 100 }}
                nodeSize={{ x: 120, y: 120 }}
                separation={{ siblings: 1.5, nonSiblings: 1.5 }}
                renderCustomNodeElement={({ nodeDatum }) => (
                  <motion.g
                    initial={{ scale: 0 }}
                    animate={{ 
                      scale: nodeDatum.name === currentNode ? 1.2 : 1,
                      fill: nodeDatum.name === currentNode ? '#ff6b6b' : '#4dabf7'
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
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Traversal Result */}
      {traversalResult.length > 0 && (
        <Grid item xs={12} md={8}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" align="center" gutterBottom>
                Inorder Traversal Result (Sorted Order)
              </Typography>
              <Typography variant="body1" align="center" style={{ fontSize: 18 }}>
                {traversalResult.join(' → ')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );
};

export default AVLTreeVisualizer;