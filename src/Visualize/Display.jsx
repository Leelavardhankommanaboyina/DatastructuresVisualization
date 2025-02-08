import React, { useState } from "react";
import { Container, Box, Button, Typography, Snackbar } from "@mui/material";
import FileUpload from "./FileUpload";
import DataVisualizer from "./DataVisualizer";

const Display = () => {
  const [selectedVisualizer, setSelectedVisualizer] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [chartOptions, setChartOptions] = useState({});

  const handleVisualizerSelect = (type) => {
    setSelectedVisualizer(type);
  };

  const handleDataLoaded = (loadedData) => {
    setData(loadedData);
  };

  const handleError = (errorMsg) => {
    setError(errorMsg);
  };

  const handleColorChange = (color) => {
    setChartOptions({ ...chartOptions, backgroundColor: color });
  };

  const handleBorderColorChange = (color) => {
    setChartOptions({ ...chartOptions, borderColor: color });
  };

  return (
    <Container>
      <Box sx={{ marginTop: 4, textAlign: "center" }}>
        <Typography variant="h4">Smart City Dashboard</Typography>
        <Box sx={{ marginTop: 4 }}>
          <Button variant="contained" onClick={() => handleVisualizerSelect("Bar")}>
            Bar Chart
          </Button>
          <Button variant="contained" sx={{ marginLeft: 2 }} onClick={() => handleVisualizerSelect("Line")}>
            Line Chart
          </Button>
          <Button variant="contained" sx={{ marginLeft: 2 }} onClick={() => handleVisualizerSelect("Pie")}>
            Pie Chart
          </Button>
        </Box>

        {selectedVisualizer && (
          <Box sx={{ marginTop: 4 }}>
            <Typography variant="h5">Select a file for {selectedVisualizer} chart</Typography>
            <FileUpload onDataLoaded={handleDataLoaded} onError={handleError} />
          </Box>
        )}

        {error && (
          <Snackbar
            open={true}
            autoHideDuration={6000}
            onClose={() => setError("")}
            message={error}
          />
        )}

        {data && selectedVisualizer && (
          <Box sx={{ marginTop: 4 }}>
            <DataVisualizer type={selectedVisualizer} data={data} chartOptions={chartOptions} />
            <Box sx={{ marginTop: 4 }}>
              <Button onClick={() => handleColorChange("rgba(75, 192, 192, 0.2)")}>Change Bar Color</Button>
              <Button sx={{ marginLeft: 2 }} onClick={() => handleBorderColorChange("rgba(75, 192, 192, 1)")}>Change Border Color</Button>
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Display;