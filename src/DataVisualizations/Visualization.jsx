import React from 'react';
import { useAppContext } from '../DataVisualizations/AppContext';

import {BarChart} from "./BarChart";

import { LineChart } from "./LineChart";
import { PieChart } from "./PieChart";
import { ScatterChart } from "./ScatterChart";


export default function Visualization() {
  const { inputData, selectedChartType } = useAppContext();

  // Format the data based on the selected chart type (if needed)
  const formattedData = inputData.map(row => ({
    value: parseInt(row.value),  // Convert value to number if it's not already
    category: row.category,
  }));

  let chartComponent;

  // Dynamically render the chart component based on selectedChartType
  switch (selectedChartType) {
    case 'bar':
      chartComponent = <BarChart data={formattedData} />;
      break;
    case 'line':
      chartComponent = <LineChart data={formattedData} />;
      break;
    case 'pie':
      chartComponent = <PieChart data={formattedData} />;
      break;
    case 'scatter':
      chartComponent = <ScatterChart data={formattedData} />;
      break;
    default:
      chartComponent = <div>Select a chart type</div>;
  }

  return <div>{chartComponent}</div>;
}
