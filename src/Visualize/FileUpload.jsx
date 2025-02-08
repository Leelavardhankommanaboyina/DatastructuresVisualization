import React, { useState } from "react";
import { Button, Input } from "@mui/material";
import Papa from "papaparse";

const FileUpload = ({ onDataLoaded, onError }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  const handleFileUpload = () => {
    if (!file) {
      onError("Please select a file to upload.");
      return;
    }

    const reader = new FileReader();
    const fileExtension = file.name.split(".").pop().toLowerCase();

    reader.onload = (event) => {
      const fileContent = event.target.result;

      if (fileExtension === "json") {
        try {
          const data = JSON.parse(fileContent);
          onDataLoaded(data);
        } catch (e) {
          onError("Invalid JSON file format. Please upload a valid JSON file.");
        }
      } else if (fileExtension === "csv") {
        Papa.parse(fileContent, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          delimiter: ",", // Explicitly set delimiter
          complete: (results) => {
            if (results.errors.length > 0) {
              console.log("CSV Errors:", results.errors);
              onError(`CSV Error: ${results.errors[0].message}`);
            } else {
              // Validate CSV structure
              const isValid = results.data.every(item => 
                ("Category" in item || "category" in item) &&
                ("Value" in item || "value" in item)
              );
              
              if (!isValid) {
                onError("CSV must contain 'Category' and 'Value' columns");
              } else {
                onDataLoaded(results.data);
              }
            }
          }
        });
      } else {
        onError("Unsupported file type. Please upload a JSON or CSV file.");
      }
    };

    reader.readAsText(file, "UTF-8"); // Specify encoding
  };

  return (
    <div>
      <Input type="file" onChange={handleFileChange} accept=".json,.csv" />
      <Button variant="contained" onClick={handleFileUpload} sx={{ marginLeft: 2 }}>
        Upload File
      </Button>
    </div>
  );
};

export default FileUpload;