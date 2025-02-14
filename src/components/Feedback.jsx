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
  const [emailError, setEmailError] = useState(false);

  // Email validation function
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Handle input changes for text fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    // If the email field is updated, validate it
    if (name === "email") {
      setEmailError(!validateEmail(value));
    }
    setFormData({ ...formData, [name]: value });
  };

  // Handle rating changes
  const handleRatingChange = (event, newValue) => {
    setFormData({ ...formData, rating: newValue });
  };

  // Handle form submission and send data via EmailJS
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      setEmailError(true);
      return;
    }

    // Replace these with your actual EmailJS details
    const serviceID = "service_8fi1lc6"; // Your Email Service ID
    const templateID = "template_imb8ecd"; // Your Email Template ID for feedback
    const thankYouTemplateID = "template_ueeoweq"; // Your Thank You Email Template ID
    const userID = "4HBJLo4lT5a8QqsrC"; // Your User (Public) ID

    // Send feedback email
    emailjs.send(serviceID, templateID, formData, userID).then(
      (response) => {
        console.log("Feedback email SUCCESS!", response.status, response.text);

        // Send Thank You email to the user
        const thankYouParams = {
          to_email: formData.email,
          name: formData.name,
        };
        emailjs.send(serviceID, thankYouTemplateID, thankYouParams, userID).then(
          (res) => {
            console.log("Thank You email sent", res.status, res.text);
          },
          (err) => {
            console.error("Failed to send Thank You email", err);
          }
        );

        setSnackbarOpen(true);
        setFormData({
          name: "",
          email: "",
          message: "",
          rating: 0,
        });
      },
      (err) => {
        console.error("FAILED to send feedback...", err);
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
            error={emailError}
            helperText={emailError ? "Enter a valid email address" : ""}
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
            label="Need to improve any feature"
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
