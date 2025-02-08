import { Button, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const dataStructures = [
  { title: "Linked Lists", path: "/linkedlist" },
  { title: "Stack", path: "/stack" },
  { title: "Queue", path: "/queue" },
  { title: "Trees", path: "/typesoftrees" },
  { title: "Hash Tables", path: "/hashTable" },
];

export default function TypesOfDataStructures() {
  return (
    <Grid container spacing={2}>
      {dataStructures.map((item, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Button
            component={Link}
            to={item.path}
            variant="outlined"
            fullWidth
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 2,
              borderRadius: 2,
              textDecoration: 'none',
              border: '2px solid',
              boxShadow: 2,
              '&:hover': {
                boxShadow: 6,
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
              },
            }}
          >
            <Typography variant="h6" align="center">
              {item.title}
            </Typography>
          </Button>
        </Grid>
      ))}
    </Grid>
  );
}
