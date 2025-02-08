import React, { useState } from "react";

const CountingSort = () => {
  const [array, setArray] = useState("");
  const [sortedArray, setSortedArray] = useState([]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  // Counting Sort Algorithm
  const countingSort = (arr) => {
    let stepsArr = [];
    let max = Math.max(...arr);
    let count = new Array(max + 1).fill(0);
    let output = new Array(arr.length);

    // Count the occurrences of each element
    for (let i = 0; i < arr.length; i++) {
      count[arr[i]]++;
    }

    // Update the count array to store actual positions
    for (let i = 1; i <= max; i++) {
      count[i] += count[i - 1];
    }

    // Build the output array from the front (left to right)
    for (let i = 0; i < arr.length; i++) {
      output[count[arr[i]] - 1] = arr[i];
      count[arr[i]]--;
      stepsArr.push([...output]); // Capture the output array in each step
    }

    return stepsArr;
  };

  // Handle sort button click
  const handleSort = () => {
    const arr = array.split(",").map(Number);
    const stepsArr = countingSort(arr);
    setSortedArray(stepsArr[stepsArr.length - 1]); // Final sorted array
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
    <div style={styles.container}>
      <h1 style={styles.header}>Counting Sort Visualizer</h1>
      <input
        type="text"
        value={array}
        onChange={(e) => setArray(e.target.value)}
        placeholder="Enter array elements separated by commas"
        style={styles.input}
      />
      <button onClick={handleSort} style={styles.button}>Sort</button>
      <button onClick={nextStep} disabled={currentStep === steps.length - 1} style={styles.button}>
        Next Step
      </button>

      <h2 style={styles.subHeader}>Steps:</h2>
      <div style={styles.visualization}>
        {/* Drawing the array with indices and filling the elements in each step */}
        {steps[currentStep] && (
          <div style={styles.arrayContainer}>
            {steps[currentStep].map((value, index) => (
              <div key={index} style={styles.barContainer}>
                {/* Line connecting each element */}
                <div
                  style={{
                    ...styles.line,
                    height: `${(value / Math.max(...steps[currentStep])) * 100}%`,
                    top: `${100 - (value / Math.max(...steps[currentStep])) * 100}%`,
                    transition: "top 0.3s ease-out",
                  }}
                ></div>
                {/* Bar representing the element */}
                <div
                  style={{
                    ...styles.bar,
                    height: `${(value / Math.max(...steps[currentStep])) * 100}%`,
                    backgroundColor: currentStep === steps.length - 1 ? 'green' : '#4CAF50',
                    transition: "height 0.3s ease-out", // Smooth transition for filling elements
                  }}
                >
                  {value}
                </div>
                {/* Small square box at each index */}
                <div style={styles.indexBox}>
                  {index}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <h2 style={styles.subHeader}>Sorted Array:</h2>
      <p>{sortedArray.join(", ")}</p>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    textAlign: "center",
    backgroundColor: "#f4f4f9",
    borderRadius: "8px",
    maxWidth: "800px",
    margin: "0 auto",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  header: {
    color: "#333",
  },
  input: {
    padding: "10px",
    margin: "10px",
    width: "300px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    cursor: "pointer",
    margin: "10px",
    borderRadius: "4px",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
    cursor: "not-allowed",
  },
  subHeader: {
    color: "#555",
  },
  visualization: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    height: "200px",
    marginTop: "20px",
    position: "relative",
  },
  arrayContainer: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "flex-end",
    width: "100%",
  },
  barContainer: {
    position: "relative",
    marginBottom: "10px",
  },
  bar: {
    width: "30px",
    margin: "0 5px",
    backgroundColor: "#4CAF50",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "4px",
    position: "relative",
  },
  line: {
    position: "absolute",
    width: "2px",
    backgroundColor: "#333",
    left: "50%",
    marginLeft: "-1px",
    transition: "top 0.3s ease-out",
  },
  indexBox: {
    position: "absolute",
    top: "100%",
    left: "50%",
    marginLeft: "-12px",
    marginTop: "5px",
    width: "20px",
    height: "20px",
    backgroundColor: "#333",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "4px",
  },
};

export default CountingSort;
