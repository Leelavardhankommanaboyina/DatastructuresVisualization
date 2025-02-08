import React from "react";
import { HeatMapGrid } from "react-heatmap-grid";

const Heatmap = ({ data }) => {
  const heatmapData = data.map(item => item.value); // Prepare data for heatmap

  const xLabels = ["A", "B", "C", "D", "E"];
  const yLabels = ["1", "2", "3", "4", "5"];

  return (
    <div>
      <HeatMapGrid
        data={heatmapData}
        xLabels={xLabels}
        yLabels={yLabels}
        cellHeight={30}
        cellWidth={30}
      />
    </div>
  );
};

export default Heatmap;
