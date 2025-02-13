import React, { useState, useRef } from 'react';
import {
  AppBar,
  Toolbar,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  Button,
  Box,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CodeIcon from '@mui/icons-material/Code';
import DesktopMacIcon from '@mui/icons-material/DesktopMac';
import { Graph } from 'react-d3-graph';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// -------------------------
// Default Graph Data
// -------------------------
const defaultGraphData = {
  nodes: [
    { id: 'A' },
    { id: 'B' },
    { id: 'C' },
    { id: 'D' },
    { id: 'E' },
    { id: 'F' },
  ],
  links: [
    { source: 'A', target: 'B', weight: 4 },
    { source: 'A', target: 'C', weight: 2 },
    { source: 'B', target: 'C', weight: 1 },
    { source: 'B', target: 'D', weight: 5 },
    { source: 'C', target: 'D', weight: 8 },
    { source: 'C', target: 'E', weight: 10 },
    { source: 'D', target: 'E', weight: 2 },
    { source: 'D', target: 'F', weight: 6 },
    { source: 'E', target: 'F', weight: 3 },
  ],
};

// -------------------------
// Update Graph Data with MST
// -------------------------
function getGraphDataWithMST(mstEdges, baseData) {
  const data = JSON.parse(JSON.stringify(baseData));
  data.links = data.links.map(link => {
    const isInMST = mstEdges.some(
      e =>
        (e.source === link.source && e.target === link.target) ||
        (e.source === link.target && e.target === link.source)
    );
    return isInMST
      ? { ...link, color: 'red', strokeWidth: 4 }
      : link;
  });
  return data;
}

// -------------------------
// Simulation Steps Arrays
// -------------------------
const primSteps = [
  {
    edge: { source: 'A', target: 'C', weight: 2 },
    description: "Step 1: Starting from A, choose edge A-C (2).",
  },
  {
    edge: { source: 'C', target: 'B', weight: 1 },
    description: "Step 2: Choose edge C-B (1).",
  },
  {
    edge: { source: 'B', target: 'D', weight: 5 },
    description: "Step 3: Choose edge B-D (5).",
  },
  {
    edge: { source: 'D', target: 'E', weight: 2 },
    description: "Step 4: Choose edge D-E (2).",
  },
  {
    edge: { source: 'E', target: 'F', weight: 3 },
    description: "Step 5: Choose edge E-F (3) to complete the MST.",
  },
];

const kruskalSteps = [
  {
    edge: { source: 'B', target: 'C', weight: 1 },
    description: "Step 1: Start by adding edge B-C (1).",
  },
  {
    edge: { source: 'A', target: 'C', weight: 2 },
    description: "Step 2: Add edge A-C (2).",
  },
  {
    edge: { source: 'D', target: 'E', weight: 2 },
    description: "Step 3: Add edge D-E (2).",
  },
  {
    edge: { source: 'E', target: 'F', weight: 3 },
    description: "Step 4: Add edge E-F (3).",
  },
  {
    edge: { source: 'B', target: 'D', weight: 5 },
    description: "Step 5: Add edge B-D (5) to complete the MST.",
  },
];

// -------------------------
// Graph Configuration
// -------------------------
const myConfig = {
  node: {
    color: 'lightblue',
    size: 500,        // Increased node size
    fontColor: 'black',
    fontSize: 16,
    highlightStrokeColor: 'blue',
  },
  link: {
    highlightColor: 'lightblue',
    renderLabel: true,
    labelProperty: 'weight',
    fontSize: 12,
    fontColor: 'black',
  },
  directed: false,
  panAndZoom: true,
  staticGraph: false,
  d3: {
    linkLength: 200,
    linkStrength: 1,
  },
};

export default function MSTVisualizer() {
  // Algorithm selection
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('prims');

  // Simulation state for Prim's
  const [primStep, setPrimStep] = useState(0);
  const [primMSTEdges, setPrimMSTEdges] = useState([]);

  // Simulation state for Kruskal's
  const [kruskalStep, setKruskalStep] = useState(0);
  const [kruskalMSTEdges, setKruskalMSTEdges] = useState([]);

  // Step log
  const [stepLogs, setStepLogs] = useState([]);
  // Running state
  const [isRunning, setIsRunning] = useState(false);

  // Dynamic code panel
  const [showCodePanel, setShowCodePanel] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState('javascript');

  // Graph data (customizable)
  const [graphDataBase, setGraphDataBase] = useState(defaultGraphData);
  const [customNodesInput, setCustomNodesInput] = useState('A,B,C,D,E,F');
  const [customLinksInput, setCustomLinksInput] = useState(
    'A-B:4, A-C:2, B-C:1, B-D:5, C-D:8, C-E:10, D-E:2, D-F:6, E-F:3'
  );

  // PDF export reference
  const visualizationRef = useRef(null);

  // Sample code snippets
  const codeSnippets = {
    javascript: `// JavaScript Implementation of MST Visualization
function getGraphDataWithMST(mstEdges, baseData) {
  // returns graph data with MST edges highlighted in red
}`,
    java: `// Java Implementation of MST Visualization (pseudo-code)
public GraphData getGraphDataWithMST(List<Edge> mstEdges, GraphData baseData) {
  // returns graph data with highlighted MST edges
}`,
    python: `# Python Implementation of MST Visualization (pseudo-code)
def get_graph_data_with_mst(mst_edges, base_data):
    # returns graph data with highlighted MST edges`,
    cpp: `// C++ Implementation of MST Visualization (pseudo-code)
GraphData getGraphDataWithMST(const vector<Edge>& mstEdges, const GraphData &baseData) {
  // returns graph data with highlighted MST edges
}`
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setSelectedAlgorithm(newValue);
    setStepLogs([]);
  };

  // Next simulation step
  const handleNextStep = async () => {
    setIsRunning(true);
    if (selectedAlgorithm === 'prims') {
      if (primStep < primSteps.length) {
        const next = primSteps[primStep];
        setPrimMSTEdges([...primMSTEdges, next.edge]);
        setStepLogs(prev => [...prev, next.description]);
        setPrimStep(primStep + 1);
      }
    } else {
      if (kruskalStep < kruskalSteps.length) {
        const next = kruskalSteps[kruskalStep];
        setKruskalMSTEdges([...kruskalMSTEdges, next.edge]);
        setStepLogs(prev => [...prev, next.description]);
        setKruskalStep(kruskalStep + 1);
      }
    }
    setIsRunning(false);
  };

  // Reset simulation
  const handleReset = () => {
    if (selectedAlgorithm === 'prims') {
      setPrimStep(0);
      setPrimMSTEdges([]);
    } else {
      setKruskalStep(0);
      setKruskalMSTEdges([]);
    }
    setStepLogs([]);
  };

  // Update graph data from custom input
  const handleUpdateGraph = () => {
    const nodes = customNodesInput
      .split(',')
      .map(n => ({ id: n.trim() }));
    const links = customLinksInput.split(',').map(item => {
      const [edge, weight] = item.split(':');
      const [source, target] = edge.split('-').map(v => v.trim());
      return { source, target, weight: Number(weight) };
    });
    setGraphDataBase({ nodes, links });
  };

  // Prepare final graph data
  const currentMSTEdges = selectedAlgorithm === 'prims' ? primMSTEdges : kruskalMSTEdges;
  const graphData = getGraphDataWithMST(currentMSTEdges, graphDataBase);

  // PDF export
  const handleSaveVisualization = async () => {
    if (!visualizationRef.current) return;
    try {
      const canvas = await html2canvas(visualizationRef.current, {
        scale: 2,
        backgroundColor: '#fff'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
      pdf.save('mst_visualization.pdf');
    } catch (error) {
      console.error('Error saving visualization', error);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      {/* AppBar */}
      <AppBar position="static" sx={{ mb: 3, backgroundColor: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            MST Visualization: Prim's & Kruskal's Algorithms
          </Typography>
          <Button color="inherit" onClick={() => setShowCodePanel(prev => !prev)}>
            {showCodePanel ? (
              <>
                <DesktopMacIcon sx={{ mr: 1 }} />
                Screen
              </>
            ) : (
              <>
                <CodeIcon sx={{ mr: 1 }} />
                Code
              </>
            )}
          </Button>
          <Button color="inherit" onClick={handleSaveVisualization}>
            Save Visualization
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 1200, margin: 'auto' }}>
        {/* Custom Graph Input */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" align="center" gutterBottom>
              Custom Graph Input
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nodes (comma separated)"
                  value={customNodesInput}
                  onChange={e => setCustomNodesInput(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Edges (format: "A-B:4, A-C:2, ...")'
                  value={customLinksInput}
                  onChange={e => setCustomLinksInput(e.target.value)}
                />
              </Grid>
            </Grid>
            {/* Explanation below input fields */}
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              <strong>How to Enter Nodes:</strong> Provide comma-separated node IDs (e.g. <em>A,B,C</em>).
              <br />
              <strong>How to Enter Edges:</strong> Use the format <em>A-B:4, A-C:2</em>, meaning there is an edge between A and B with weight 4, and an edge between A and C with weight 2.
            </Typography>
            <Box textAlign="center" mt={2}>
              <Button variant="contained" color="primary" onClick={handleUpdateGraph}>
                Click here
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Algorithm Selection Tabs */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Tabs
              value={selectedAlgorithm}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab label="Prim's Algorithm" value="prims" />
              <Tab label="Kruskal's Algorithm" value="kruskal" />
            </Tabs>
          </CardContent>
        </Card>

        {/* Graph Visualization */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" align="center" gutterBottom>
              Graph Visualization
            </Typography>
            <Box
              sx={{
                border: '1px solid #ccc',
                width: '100%',
                height: '300px',   // Increased container height
                overflow: 'auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              ref={visualizationRef}
            >
              <Graph id="graph-id" data={graphData} config={myConfig} />
            </Box>
          </CardContent>
        </Card>

        {/* Controls & Step Log */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" align="center" gutterBottom>
                  Controls
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleNextStep}
                  disabled={
                    selectedAlgorithm === 'prims'
                      ? primStep >= primSteps.length
                      : kruskalStep >= kruskalSteps.length
                  }
                  sx={{ mb: 1 }}
                >
                  {isRunning ? 'Running...' : 'Next Step'}
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  color="error"
                  onClick={handleReset}
                  disabled={
                    selectedAlgorithm === 'prims'
                      ? primStep === 0
                      : kruskalStep === 0
                  }
                >
                  Reset
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" align="center" gutterBottom>
                  Step Log
                </Typography>
                {stepLogs.length === 0 ? (
                  <Typography variant="body2" align="center" color="textSecondary">
                    No steps executed yet.
                  </Typography>
                ) : (
                  stepLogs.map((log, index) => (
                    <Typography key={index} variant="body2">
                      {log}
                    </Typography>
                  ))
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Dynamic Code Panel */}
        {showCodePanel && (
          <Box
            sx={{
              backgroundColor: '#f5f5f5',
              borderRadius: 1,
              p: 2,
              mb: 3,
              overflowX: 'auto',
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs
                value={codeLanguage}
                onChange={(e, newValue) => setCodeLanguage(newValue)}
                textColor="primary"
                indicatorColor="primary"
              >
                <Tab value="javascript" label="JavaScript" />
                <Tab value="java" label="Java" />
                <Tab value="python" label="Python" />
                <Tab value="cpp" label="C++" />
              </Tabs>
            </Box>
            <pre style={{ padding: '16px', borderRadius: '4px' }}>
              {codeSnippets[codeLanguage]}
            </pre>
          </Box>
        )}

        {/* Detailed Explanation Accordion */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Detailed Explanation</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2">
              This MST Visualizer demonstrates the step-by-step execution of
              Prim's and Kruskal's algorithms on a graph. You can update the
              graph data using the custom input fields above. Each simulation
              step highlights the chosen edge (displayed in red) and logs the action.
              Use the "Next Step" button to advance the simulation and "Reset" to start over.
              The "Save Visualization" button in the AppBar exports the current graph view as a PDF.
              Additionally, you can toggle the display of dynamic code and view a detailed explanation of the visualization.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
}
