import React from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement);

const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const DataVisualizer = ({ type, data, chartOptions }) => {
  const categories = data.map((item) => item.Category || item.category); // Handle both "Category" and "category"
  const values = data.map((item) => item.Value || item.value); // Handle both "Value" and "value"

  const colors = values.map(() => generateRandomColor());

  const chartData = {
    labels: categories,
    datasets: [
      {
        label: "Data Visualization",
        data: values,
        backgroundColor: chartOptions.backgroundColor || colors,
        borderColor: chartOptions.borderColor || colors.map((color) => color.replace("0.2", "1")),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      {type === "Bar" && <Bar data={chartData} />}
      {type === "Line" && <Line data={chartData} />}
      {type === "Pie" && <Pie data={chartData} />}
    </div>
  );
};

export default DataVisualizer;