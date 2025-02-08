import React, { useState, useEffect } from "react";
import { Network } from "vis-network";
import "vis-network/styles/vis-network.css";

const DijkstraVisualizer = () => {
  const [graph, setGraph] = useState(""); // Store user input graph
  const [steps, setSteps] = useState([]); // Stores Dijkstra's traversal steps
  const [currentStep, setCurrentStep] = useState(-1); // Start with -1 to show full graph
  const [network, setNetwork] = useState(null); // Store Vis.js network instance

  // ✅ **Dijkstra's Algorithm Implementation**
  const dijkstra = (graph, startNode) => {
    let V = Object.keys(graph).length; // Number of nodes
    let dist = {}; // Distance from source
    let sptSet = {}; // Shortest path set (visited nodes)
    let stepsArr = []; // Store visualization steps

    // Initialize distances as Infinity and sptSet as false
    Object.keys(graph).forEach((node) => {
      dist[node] = Number.MAX_VALUE;
      sptSet[node] = false;
    });

    dist[startNode] = 0; // Distance to self is always 0

    for (let count = 0; count < V - 1; count++) {
      let u = Object.keys(graph).reduce(
        (minNode, node) => (!sptSet[node] && dist[node] < dist[minNode] ? node : minNode),
        Object.keys(graph)[0]
      );

      sptSet[u] = true; // Mark the picked node as processed
      stepsArr.push({ visited: [...Object.keys(sptSet).filter((n) => sptSet[n])], current: u });

      // Update distance of adjacent nodes
      for (let neighbor of graph[u] || []) {
        let [v, weight] = neighbor.split("-"); // Parse neighbor format: "node-weight"
        weight = parseInt(weight, 10);
        if (!sptSet[v] && dist[u] !== Number.MAX_VALUE && dist[u] + weight < dist[v]) {
          dist[v] = dist[u] + weight;
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
      graph[node] = neighbors
        ? neighbors.split(" ").map((n) => n.trim())
        : [];
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
        let [neighborNode, weight] = neighbor.split("-");
        edges.push({ from: node, to: neighborNode, label: weight });
        allNodes.add(neighborNode);
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
        color: { background: "#4CAF50", border: "#2e7d32" }, // Default Green
        font: { color: "black", size: 16 },
      },
      edges: { color: "#333", arrows: "to" },
      physics: { enabled: false }, // Keep the graph static
    };

    const newNetwork = new Network(container, data, options);
    setNetwork(newNetwork);
  }, [graph]);

  // ✅ **Start Dijkstra Traversal**
  const handleDijkstra = () => {
    const parsedGraph = parseGraph(graph);
    if (Object.keys(parsedGraph).length > 0) {
      const startNode = Object.keys(parsedGraph)[0]; // Start from the first node
      const stepsArr = dijkstra(parsedGraph, startNode);
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

  // ✅ **Update Graph to Highlight Processed Nodes Correctly**
  useEffect(() => {
    if (!network || steps.length === 0) return;

    const updatedNodes = network.body.data.nodes.get(); // Get all nodes
    updatedNodes.forEach((node) => {
      const visited = steps[currentStep]?.visited || [];
      const current = steps[currentStep]?.current;

      if (node.id === current) {
        node.color = { background: "orange", border: "darkorange" }; // Node being processed
      } else if (visited.includes(node.id.toString())) {
        node.color = { background: "blue", border: "darkblue" }; // Shortest path nodes
      } else {
        node.color = { background: "#4CAF50", border: "#2e7d32" }; // Default Green
      }
    });

    network.body.data.nodes.update(updatedNodes); // Update the graph
  }, [steps, currentStep, network]);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Dijkstra's Algorithm Visualizer</h1>
      <input
        type="text"
        value={graph}
        onChange={(e) => setGraph(e.target.value)}
        placeholder="Enter graph (e.g. 1: 2-4 3-2, 2: 4-3)"
        style={styles.input}
      />
      <div style={styles.buttonContainer}>
        <button onClick={handleDijkstra} style={styles.button}>Start Dijkstra</button>
        <button onClick={nextStep} disabled={currentStep === steps.length - 1} style={styles.button}>Next Step</button>
      </div>
      <div id="network" style={styles.networkContainer}></div>
      <h2 style={styles.subHeader}>Visited Nodes:</h2>
      <p>{currentStep === -1 ? "Graph not traversed yet" : `Current: ${steps[currentStep].current} | Processed: ${steps[currentStep].visited.join(", ")}`}</p>
    </div>
  );
};

const styles = {
  container: { textAlign: "center", padding: "20px" },
  buttonContainer: { marginTop: "10px" },
  button: { margin: "5px", padding: "10px", cursor: "pointer" },
  networkContainer: { height: "400px", marginTop: "20px" },
};

export default DijkstraVisualizer;
