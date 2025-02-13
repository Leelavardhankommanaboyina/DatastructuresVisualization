import React, { useState, useRef } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  TextField,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  DesktopMac as DesktopMacIcon,
  Code as CodeIcon,
  PictureAsPdf as PictureAsPdfIcon,
} from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import "./HeapSort.css"; // Import CSS for styling and animations

const HeapSort = () => {
  const [array, setArray] = useState("");
  const [sortedArray, setSortedArray] = useState([]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  // New state for dynamic code panel
  const [showCodePanel, setShowCodePanel] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState("javascript");

  // Code snippets for HeapSort in different languages.
  const codeSnippets = {
    javascript: `// JavaScript HeapSort Implementation
function heapify(arr, n, i) {
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
    heapify(arr, n, largest);
  }
}

function heapSort(arr) {
  let n = arr.length;
  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  // Extract elements one by one
  for (let i = n - 1; i >= 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  return arr;
}`,
    java: `// Java HeapSort Implementation
public class HeapSort {
  public void heapify(int[] arr, int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;
    if (left < n && arr[left] > arr[largest])
      largest = left;
    if (right < n && arr[right] > arr[largest])
      largest = right;
    if (largest != i) {
      int swap = arr[i];
      arr[i] = arr[largest];
      arr[largest] = swap;
      heapify(arr, n, largest);
    }
  }
  
  public void heapSort(int[] arr) {
    int n = arr.length;
    for (int i = n / 2 - 1; i >= 0; i--)
      heapify(arr, n, i);
    for (int i = n - 1; i >= 0; i--) {
      int temp = arr[0];
      arr[0] = arr[i];
      arr[i] = temp;
      heapify(arr, i, 0);
    }
  }
}`,
    python: `# Python HeapSort Implementation
def heapify(arr, n, i):
    largest = i
    left = 2 * i + 1
    right = 2 * i + 2
    if left < n and arr[left] > arr[largest]:
        largest = left
    if right < n and arr[right] > arr[largest]:
        largest = right
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)

def heap_sort(arr):
    n = len(arr)
    for i in range(n//2 - 1, -1, -1):
        heapify(arr, n, i)
    for i in range(n-1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        heapify(arr, i, 0)
    return arr`,
    cpp: `// C++ HeapSort Implementation
#include <vector>
using namespace std;

void heapify(vector<int>& arr, int n, int i) {
  int largest = i;
  int left = 2 * i + 1;
  int right = 2 * i + 2;
  if (left < n && arr[left] > arr[largest])
    largest = left;
  if (right < n && arr[right] > arr[largest])
    largest = right;
  if (largest != i) {
    swap(arr[i], arr[largest]);
    heapify(arr, n, largest);
  }
}

void heapSort(vector<int>& arr) {
  int n = arr.size();
  for (int i = n / 2 - 1; i >= 0; i--)
    heapify(arr, n, i);
  for (int i = n - 1; i >= 0; i--) {
    swap(arr[0], arr[i]);
    heapify(arr, i, 0);
  }
}`
  };

  // Create a ref for the visualization container (to capture all steps)
  const vizRef = useRef(null);

  // Function to heapify the array and record steps.
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

  // Heap Sort function that records each step.
  const heapSort = (arr) => {
    let stepsArr = [];
    let n = arr.length;

    // Build the max heap.
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(arr, n, i, stepsArr);
    }
    // Extract elements one by one.
    for (let i = n - 1; i >= 0; i--) {
      [arr[0], arr[i]] = [arr[i], arr[0]];
      stepsArr.push([...arr]);
      heapify(arr, i, 0, stepsArr);
    }
    return stepsArr;
  };

  // Handle sort button click.
  const handleSort = () => {
    const arr = array.split(",").map(Number);
    const stepsArr = heapSort([...arr]);
    setSortedArray(arr);
    setSteps(stepsArr);
    setCurrentStep(0);
  };

  // Move to the next step.
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Save visualization as PDF, splitting content page by page.
  const handleDownloadPDF = async () => {
    if (!vizRef.current) {
      alert("Visualization not found!");
      return;
    }
    try {
      const element = vizRef.current;
      // Capture the entire container (all steps)
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#fff",
        width: element.scrollWidth,
        height: element.scrollHeight,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfPageWidth = pdf.internal.pageSize.getWidth();
      const pdfPageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfPageWidth;
      const imgHeight = (canvas.height * pdfPageWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add the first page.
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfPageHeight;

      // Add more pages if the content overflows.
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfPageHeight;
      }
      pdf.save("heap_sort_visualization.pdf");
    } catch (error) {
      console.error("Error generating PDF", error);
      alert("An error occurred while generating the PDF.");
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      {/* AppBar with Title, Code Toggle, and Save Visualization Button */}
      <AppBar position="static" sx={{ mb: 2, backgroundColor: "#1976d2" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Heap Sort Visualizer
          </Typography>
          <Button color="inherit" onClick={() => setShowCodePanel((prev) => !prev)}>
            {showCodePanel ? (
              <>
                <DesktopMacIcon sx={{ mr: 1 }} />
                Screen
              </>
            ) : (
              <>
                <CodeIcon sx={{ mr: 1 }} />
                Code
              </>
            )}
          </Button>
          <Button
            color="inherit"
            startIcon={<PictureAsPdfIcon />}
            onClick={handleDownloadPDF}
          >
            Save Visualization
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 800, margin: "auto" }}>
        {!showCodePanel ? (
          <>
            <TextField
              fullWidth
              variant="outlined"
              label="Enter array elements separated by commas"
              value={array}
              onChange={(e) => setArray(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <Button variant="contained" onClick={handleSort}>
                Sort
              </Button>
              {/* Next Step button now uses contained variant with secondary color */}
              <Button
                variant="contained"
                color="secondary"
                onClick={nextStep}
                disabled={currentStep === steps.length - 1 || steps.length === 0}
              >
                Next Step
              </Button>
            </Box>

            {/* Visualization container wrapped in ref for PDF export */}
            <Box ref={vizRef}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Steps:
              </Typography>
              <div className="array-visualization">
                {steps[currentStep] &&
                  steps[currentStep].map((value, index) => (
                    <div
                      key={index}
                      className="bar"
                      style={{
                        height: `${
                          (value / Math.max(...steps[currentStep])) * 100
                        }%`,
                        backgroundColor:
                          currentStep === steps.length - 1 ? "green" : "#4CAF50",
                      }}
                    >
                      {value}
                    </div>
                  ))}
              </div>
            </Box>

            <Typography variant="h6" sx={{ mt: 2 }}>
              Sorted Array:
            </Typography>
            <Typography>{sortedArray.join(", ")}</Typography>
          </>
        ) : (
          <>
            <Tabs
              value={codeLanguage}
              onChange={(e, newValue) => setCodeLanguage(newValue)}
              textColor="primary"
              indicatorColor="primary"
              sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}
            >
              <Tab value="javascript" label="JavaScript" />
              <Tab value="java" label="Java" />
              <Tab value="python" label="Python" />
              <Tab value="cpp" label="C++" />
            </Tabs>
            <pre
              style={{
                backgroundColor: "#f5f5f5",
                padding: "16px",
                borderRadius: "4px",
                overflow: "auto",
              }}
            >
              {codeSnippets[codeLanguage]}
            </pre>
          </>
        )}

        {/* Detailed Explanation Accordion */}
        <Accordion sx={{ mt: 4 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Detailed Explanation</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Heap Sort Algorithm:</strong>
            </Typography>
            <Typography variant="body2" paragraph>
              Heap Sort converts the input array into a max heap—a complete binary tree where each parent node is greater than or equal to its child nodes.
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>How It Works:</strong>
              <br />
              1. Build a max heap from the input array.
              <br />
              2. Swap the root (maximum element) with the last element and reduce the heap size.
              <br />
              3. Heapify the root to maintain the max heap property.
              <br />
              4. Repeat until the heap is fully sorted.
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Time Complexity:</strong> O(n log n) in all cases.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
};

export default HeapSort;
