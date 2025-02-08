import React from 'react';
import { ScatterChart as RechartsScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ScatterChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsScatterChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip />
        <Scatter name="Data" data={data} fill="#8884d8" />
      </RechartsScatterChart>
    </ResponsiveContainer>
  );
}
