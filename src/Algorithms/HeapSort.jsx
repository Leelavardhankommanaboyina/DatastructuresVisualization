import React, { useState } from "react";
import './HeapSort.css'; // Importing CSS file for styling and animations

const HeapSort = () => {
  const [array, setArray] = useState("");
  const [sortedArray, setSortedArray] = useState([]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  // Function to heapify the tree
  const heapify = (arr, n, i, stepsArr) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) {
      largest = left;
    }
    if (right < n && arr[right] > arr[largest]) {
      largest = right;
    }

    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      stepsArr.push([...arr]);
      heapify(arr, n, largest, stepsArr);
    }
  };

  // Heap Sort function
  const heapSort = (arr) => {
    let stepsArr = [];
    let n = arr.length;

    // Build the max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(arr, n, i, stepsArr);
    }

    // Extract elements one by one
    for (let i = n - 1; i >= 0; i--) {
      [arr[0], arr[i]] = [arr[i], arr[0]];
      stepsArr.push([...arr]);
      heapify(arr, i, 0, stepsArr);
    }

    return stepsArr;
  };

  // Handle sort button click
  const handleSort = () => {
    const arr = array.split(",").map(Number);
    const stepsArr = heapSort(arr);
    setSortedArray(arr);
    setSteps(stepsArr);
    setCurrentStep(0);
  };

  // Move to the next step
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="heap-sort-container">
      <h1>Heap Sort Visualizer</h1>
      <input
        type="text"
        value={array}
        onChange={(e) => setArray(e.target.value)}
        placeholder="Enter array elements separated by commas"
      />
      <button onClick={handleSort}>Sort</button>
      <button onClick={nextStep} disabled={currentStep === steps.length - 1}>
        Next Step
      </button>

      <h2>Steps:</h2>
      <div className="array-visualization">
        {steps[currentStep] &&
          steps[currentStep].map((value, index) => (
            <div
              key={index}
              className="bar"
              style={{
                height: `${(value / Math.max(...steps[currentStep])) * 100}%`,
                backgroundColor: currentStep === steps.length - 1 ? 'green' : '#4CAF50',
              }}
            >
              {value}
            </div>
          ))}
      </div>

      <h2>Sorted Array:</h2>
      <p>{sortedArray.join(", ")}</p>
    </div>
  );
};

export default HeapSort;
