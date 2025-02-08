import { Typography } from "@mui/material"; // Import Typography from MUI

export default function Home() {
  return (
    <Typography
      variant="h5"
      sx={{
        color: "text.primary", // Use theme's text color (automatically adjusts based on the theme)
        textAlign: "center", // Center the text
        padding: "20px", // Add some padding around the text for better readability
      }}
    >
      Welcome to Binary Brains!! Data Structures and Algorithms can be visualized and understood so easily. Click on the sidebar and explore the knowledge.
    </Typography>
  );
}
