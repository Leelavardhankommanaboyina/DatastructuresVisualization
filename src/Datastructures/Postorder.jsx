import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, Grid, Typography, TextField, Button } from "@mui/material";
import { Tree } from "react-d3-tree";

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

const PostorderTraversal = () => {
  const [treeData, setTreeData] = useState(null);
  const [currentNode, setCurrentNode] = useState('');
  const [inputValues, setInputValues] = useState('');
  const [traversalResult, setTraversalResult] = useState([]);
  const [isTraversing, setIsTraversing] = useState(false);

  // Convert binary tree to D3.js format
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

  // Postorder traversal with visualization
  const animatePostorderTraversal = (root) => {
    const traversalSteps = [];
    const result = [];
    
    const traverse = (node) => {
      if (!node) return;
      traverse(node.left);
      traverse(node.right);
      traversalSteps.push(node);  // Changed order: Process children first
      result.push(node.value);
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

  // Build binary tree from input values (same as preorder)
  const buildBinaryTree = () => {
    const values = inputValues.split(',').map(val => parseInt(val.trim(), 10));
    
    if (!values.length || values.some(isNaN)) {
      alert("Please enter valid integers separated by commas");
      return;
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

    setTreeData(convertToD3Format(root));
    animatePostorderTraversal(root);
  };

  return (
    <Grid container spacing={3} justifyContent="center" style={{ padding: 20 }}>
      {/* Input Section */}
      <Grid item xs={12} md={8}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h5" gutterBottom align="center">
              Binary Tree Visualization
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              label="Enter node values (comma separated)"
              value={inputValues}
              onChange={(e) => setInputValues(e.target.value)}
              placeholder="Example: 1,2,3,4,5,6"
              disabled={isTraversing}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={buildBinaryTree}
              style={{ marginTop: 15 }}
              disabled={isTraversing}
            >
              {isTraversing ? 'Traversing...' : 'Start Postorder Traversal'}
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Tree Visualization */}
      <Grid item xs={12} md={10}>
        <Card elevation={3}>
          <CardContent style={{ minHeight: 400 }}>
            <Typography variant="h6" align="center" gutterBottom>
              Binary Tree Structure
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
                Postorder Traversal Result
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

export default PostorderTraversal;