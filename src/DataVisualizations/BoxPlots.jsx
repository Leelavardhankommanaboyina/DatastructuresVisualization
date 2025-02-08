import React from "react";
import { BoxPlot } from "react-chartjs-2";

const BoxPlotChart = ({ data }) => {
  const chartData = {
    labels: ["Dataset"],
    datasets: [{
      label: "Sales Distribution",
      data: data,
      borderColor: "#1976d2",
      fill: false,
    }]
  };

  return (
    <div>
      <BoxPlot data={chartData} options={{ responsive: true }} />
    </div>
  );
};

export default BoxPlotChart;
