import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import DataInputStep from "./Algorithms/DataInputStep";
import SelectAlgorithmStep from "./Algorithms/SelectAlgorithmStep";
import Visualize from "./Algorithms/Visualize";
import TypesofAlgorithms from "./Algorithms/TypesofAlgorithms";
import SearchingList from "./Algorithms/SearchingList";
import SortingList from "./Algorithms/SortingList";
import GraphsList from "./Algorithms/GraphsList";
import LinearSearch from "./Algorithms/LinearSearch";
import BinarySearch from "./Algorithms/BinarySearch";
import InterpolationSearch from "./Algorithms/InterpolationSearch";
import BubbleSort from "./Algorithms/BubbleSort";
import QuickSort from "./Algorithms/QuickSort";
import MergeSort from "./Algorithms/MergeSort";
import HeapSort from "./Algorithms/HeapSort";
import CountSort from "./Algorithms/CountSort";
import BFS from "./Algorithms/BFS";
import DFS from "./Algorithms/DFS";
import Dijkstra from "./Algorithms/Dijkstra";

import LinkedList from "./Datastructures/LinkedList";
import Typesofdatastructures from "./Datastructures/Typesofdatastructures";
import Stack from "./Datastructures/Stack";
import Queue from "./Datastructures/Queue";
import AVL from "./Datastructures/AVL";
import BST from "./Datastructures/BST";
import HashTable from "./Datastructures/HashTable";
import Typesoftrees from "./Datastructures/Typesoftrees";
import Preorder from "./Datastructures/Preorder";
import Postorder from "./Datastructures/Postorder";
import Inorder from "./Datastructures/Inorder";
import Display from "./Visualize/Display"; 

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

// Define light and dark themes
const lightTheme = {
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#90caf9",
    },
  },
  typography: {
    // Define the default text color for light theme
    allVariants: {
      color: "#000", // black text for light mode
    },
  },
};

const darkTheme = {
  palette: {
    mode: "dark",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#90caf9",
    },
  },
  typography: {
    // Define the default text color for dark theme
    allVariants: {
      color: "#fff", // white text for dark mode
    },
  },
};

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false); // Track dark mode state

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode); // Toggle between light and dark mode
  };

  return (
    <ThemeProvider theme={createTheme(isDarkMode ? darkTheme : lightTheme)}>
      <CssBaseline /> {/* Global CSS reset to apply theme */}
      <Router>
        <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
        <div style={{ paddingTop: "60px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="data-input" element={<DataInputStep />} />
            <Route path="select-algorithm" element={<SelectAlgorithmStep />} />
            <Route path="visualize" element={<Visualize />} />
            <Route path="/typesofalgorithms" element={<TypesofAlgorithms />} />
            <Route path="/searchingList" element={<SearchingList />} />
            <Route path="/sortingList" element={<SortingList />} />
            <Route path="/graphsList" element={<GraphsList />} />
            <Route path="/linearSearch" element={<LinearSearch />} />
            <Route path="/binarySearch" element={<BinarySearch />} />
            <Route path="/interpolationSearch" element={<InterpolationSearch />} />
            <Route path="/bubbleSort" element={<BubbleSort />} />
            <Route path="/quickSort" element={<QuickSort />} />
            <Route path="/mergeSort" element={<MergeSort />} />
            <Route path="/heapSort" element={<HeapSort />} />
            <Route path="/countSort" element={<CountSort />} />
            <Route path="/bfs" element={<BFS />} />
            <Route path="/dfs" element={<DFS />} />
            <Route path="/dijkstra" element={<Dijkstra />} />
            <Route path="/typesofdatastructures" element={<Typesofdatastructures />} />
            <Route path="/linkedlist" element={<LinkedList />} />
            <Route path="/stack" element={<Stack />} />
            <Route path="/queue" element={<Queue />} />
            <Route path="/typesoftrees" element={<Typesoftrees />} />
            <Route path="/bst" element={<BST />} />
            <Route path="/avl" element={<AVL />} />
            <Route path="/preorder" element={<Preorder />} />
            <Route path="/postorder" element={<Postorder />} />
            <Route path="/inorder" element={<Inorder />} />
            <Route path="/hashTable" element={<HashTable />} />
            <Route path="/display" element={<Display />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}
