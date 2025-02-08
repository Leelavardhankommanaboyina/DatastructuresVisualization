import React, { useState, useEffect } from "react";
import { Network } from "vis-network";
import "vis-network/styles/vis-network.css";

const BFSVisualizer = () => {
  const [graph, setGraph] = useState(""); // Store user input graph
  const [steps, setSteps] = useState([]); // Stores BFS traversal steps
  const [currentStep, setCurrentStep] = useState(-1); // Start with -1 to show full graph
  const [network, setNetwork] = useState(null); // Store Vis.js network instance

  // ✅ **Correct BFS Algorithm Implementation**
  const bfs = (graph, startNode) => {
    let queue = [startNode]; // Initialize queue
    let stepsArr = [];
    let visited = new Set();
    visited.add(startNode);

    while (queue.length > 0) {
      let currentNode = queue.shift();
      stepsArr.push([...visited]); // Save visited nodes at this step

      for (let neighbor of graph[currentNode] || []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }

    return stepsArr;
  };

  // ✅ **Parse Input Graph into an Adjacency List**
  const parseGraph = (graphInput) => {
    const graph = {};
    if (!graphInput) return graph;

    graphInput.split(",").forEach((edge) => {
      const [node, neighbors] = edge.split(":").map((item) => item.trim());
      graph[node] = neighbors ? neighbors.split(" ").map((n) => n.trim()) : [];
    });

    return graph;
  };

  // ✅ **Initialize Graph in Vis.js**
  useEffect(() => {
    if (!graph) return;
    const parsedGraph = parseGraph(graph);
    if (!parsedGraph || Object.keys(parsedGraph).length === 0) return;

    const container = document.getElementById("network");
    const nodes = [];
    const edges = [];

    // ✅ Ensure all nodes are displayed
    const allNodes = new Set(Object.keys(parsedGraph));
    Object.keys(parsedGraph).forEach((node) => {
      nodes.push({ id: node, label: node });
      parsedGraph[node].forEach((neighbor) => {
        edges.push({ from: node, to: neighbor });
        allNodes.add(neighbor);
      });
    });

    // ✅ Ensure isolated nodes (without edges) are included
    allNodes.forEach((node) => {
      if (!nodes.find((n) => n.id === node)) {
        nodes.push({ id: node, label: node });
      }
    });

    const data = { nodes, edges };
    const options = {
      nodes: {
        shape: "dot",
        size: 15,
        color: { background: "#4CAF50", border: "#2e7d32" }, // Initially Green
        font: { color: "black", size: 16 },
      },
      edges: { color: "#333" },
      physics: { enabled: false }, // Keep the graph static
    };

    const newNetwork = new Network(container, data, options);
    setNetwork(newNetwork);
  }, [graph]);

  // ✅ **Start BFS Traversal**
  const handleBFS = () => {
    const parsedGraph = parseGraph(graph);
    if (Object.keys(parsedGraph).length > 0) {
      const startNode = Object.keys(parsedGraph)[0]; // Start from the first node
      const stepsArr = bfs(parsedGraph, startNode);
      setSteps(stepsArr);
      setCurrentStep(0);
    }
  };

  // ✅ **Move to the Next Step**
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // ✅ **Save BFS Steps to a File**
  const saveStepsToFile = () => {
    const stepData = steps.map((step, index) =>
      `Step ${index + 1}: ${step.join(", ")}`
    ).join("\n");

    const blob = new Blob([stepData], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "BFS_Steps.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ✅ **Update Graph to Highlight Visited Nodes Correctly**
  useEffect(() => {
    if (!network || steps.length === 0) return;

    const updatedNodes = network.body.data.nodes.get(); // Get all nodes
    updatedNodes.forEach((node) => {
      if (steps[currentStep]?.includes(node.id.toString())) {
        node.color = { background: "orange", border: "darkorange" }; // Mark visited nodes
      } else {
        node.color = { background: "#4CAF50", border: "#2e7d32" }; // Default Green
      }
    });

    network.body.data.nodes.update(updatedNodes); // Update the graph
  }, [steps, currentStep, network]);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Breadth-First Search Visualizer</h1>
      <input
        type="text"
        value={graph}
        onChange={(e) => setGraph(e.target.value)}
        placeholder="Enter graph (e.g. 1: 2 3, 2: 4)"
        style={styles.input}
      />
      <div style={styles.buttonContainer}>
        <button onClick={handleBFS} style={styles.button}>Start BFS</button>
        <button onClick={nextStep} disabled={currentStep === steps.length - 1} style={styles.button}>Next Step</button>
        <button onClick={saveStepsToFile} style={styles.saveButton}>Save Steps</button>
      </div>
      <div id="network" style={styles.networkContainer}></div>
      <h2 style={styles.subHeader}>Visited Nodes:</h2>
      <p>{currentStep === -1 ? "Graph not traversed yet" : steps[currentStep].join(", ")}</p>
    </div>
  );
};

const styles = {
  container: { textAlign: "center", padding: "20px" },
  buttonContainer: { marginTop: "10px" },
  button: { margin: "5px", padding: "10px", cursor: "pointer" },
  saveButton: { backgroundColor: "#4CAF50", color: "white", border: "none", padding: "10px", cursor: "pointer" },
  networkContainer: { height: "400px", marginTop: "20px" },
};

export default BFSVisualizer;
