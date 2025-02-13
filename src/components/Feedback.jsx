import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Snackbar,
  Alert,
  Rating,
} from "@mui/material";
import emailjs from "emailjs-com";

export default function FeedbackForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    rating: 0,
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Handle input changes for text fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle rating changes
  const handleRatingChange = (event, newValue) => {
    setFormData({ ...formData, rating: newValue });
  };

  // Handle form submission and send data via EmailJS
  const handleSubmit = (e) => {
    e.preventDefault();

    // Replace these with your actual EmailJS details
    const serviceID = "service_8fi1lc6"; // Your Email Service ID
    const templateID = "template_imb8ecd"; // Your Email Template ID
    const userID = "4HBJLo4lT5a8QqsrC"; // Your User (Public) ID

    emailjs.send(serviceID, templateID, formData, userID).then(
      (response) => {
        console.log("SUCCESS!", response.status, response.text);
        setSnackbarOpen(true);
        setFormData({
          name: "",
          email: "",
          message: "",
          rating: 0,
        });
      },
      (err) => {
        console.error("FAILED...", err);
      }
    );
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Box
        sx={{
          backgroundColor: "#f9f9f9",
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Feedback Form
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            required
            margin="normal"
            type="email"
          />
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Overall Website Rating:
          </Typography>
          <Rating
            name="rating"
            value={formData.rating}
            onChange={handleRatingChange}
            size="large"
            sx={{ my: 1 }}
          />
          <TextField
            label="Need to improve any feature "
            name="message"
            value={formData.message}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            required
            margin="normal"
            multiline
            rows={4}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, py: 1.5 }}
          >
            Send Feedback
          </Button>
        </form>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Thank you for filling the form. Your feedback supports a lot!
        </Alert>
      </Snackbar>
    </Container>
  );
}
