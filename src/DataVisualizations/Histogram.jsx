import React from "react";
import { Histogram } from "react-chartjs-2";

const HistogramChart = ({ data }) => {
  const chartData = {
    labels: data,
    datasets: [{
      label: "Frequency",
      data: data,
      backgroundColor: "#1976d2",
    }]
  };

  return (
    <div>
      <Histogram data={chartData} options={{ responsive: true }} />
    </div>
  );
};

export default HistogramChart;
