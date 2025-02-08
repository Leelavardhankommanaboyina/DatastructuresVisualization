import React, { useState } from "react";
import { Card, CardContent, Grid, Typography, TextField, Button, Select, MenuItem } from "@mui/material";

const HashTableVisualizer = () => {
  const [hashTable, setHashTable] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [tableSize, setTableSize] = useState(10);
  const [collisionMethod, setCollisionMethod] = useState("chaining");

  // Initialize the hash table
  const initializeHashTable = () => {
    const newTable = Array.from({ length: tableSize }, () => []);
    setHashTable(newTable);
  };

  // Hash function
  const hashFunction = (key) => {
    return key % tableSize;
  };

  // Insert into hash table with chaining
  const insertWithChaining = (key) => {
    const index = hashFunction(key);
    const newTable = [...hashTable];
    newTable[index].push(key);
    setHashTable(newTable);
  };

  // Insert into hash table with open addressing (linear probing)
  const insertWithOpenAddressing = (key) => {
    const newTable = [...hashTable];
    let index = hashFunction(key);

    while (newTable[index] && newTable[index].length > 0) {
      index = (index + 1) % tableSize; // Linear probing
    }

    newTable[index] = [key]; // Store the key
    setHashTable(newTable);
  };

  // Handle insertion
  const handleInsert = () => {
    const key = parseInt(inputValue.trim(), 10);
    if (isNaN(key)) {
      alert("Please enter a valid integer key.");
      return;
    }

    if (collisionMethod === "chaining") {
      insertWithChaining(key);
    } else {
      insertWithOpenAddressing(key);
    }

    setInputValue("");
  };

  // Render hash table
  const renderHashTable = () => {
    return (
      <Grid container spacing={1} style={{ marginTop: "20px" }}>
        {hashTable.map((bucket, index) => (
          <Grid item key={index} xs={12 / tableSize}>
            <Card elevation={3}>
              <CardContent style={{ textAlign: "center", minHeight: "100px" }}>
                <Typography variant="h6" gutterBottom>
                  Index {index}
                </Typography>
                {bucket.map((key, i) => (
                  <Typography key={i} variant="body1">
                    {key}
                  </Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Grid container spacing={3} justifyContent="center" style={{ padding: "20px" }}>
      {/* Input Section */}
      <Grid item xs={12} md={8}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h5" gutterBottom align="center">
              Hash Table Visualization
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Enter key"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Example: 25"
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Table Size"
                  type="number"
                  value={tableSize}
                  onChange={(e) => setTableSize(parseInt(e.target.value, 10))}
                />
              </Grid>
              <Grid item xs={3}>
                <Select
                  fullWidth
                  variant="outlined"
                  value={collisionMethod}
                  onChange={(e) => setCollisionMethod(e.target.value)}
                >
                  <MenuItem value="chaining">Chaining</MenuItem>
                  <MenuItem value="openAddressing">Open Addressing</MenuItem>
                </Select>
              </Grid>
            </Grid>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={initializeHashTable}
              style={{ marginTop: "10px" }}
            >
              Initialize Hash Table
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={handleInsert}
              style={{ marginTop: "10px" }}
            >
              Insert Key
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Hash Table Visualization */}
      <Grid item xs={12}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" align="center" gutterBottom>
              Hash Table Structure
            </Typography>
            {renderHashTable()}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default HashTableVisualizer;