import { Card, CardActionArea, CardContent, Container, Grid, Typography } from "@mui/material";
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
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Grid container direction="column" spacing={3}>
        {dataStructures.map((item, index) => (
          <Grid item key={index}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 3,
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: 6,
                },
              }}
            >
              <CardActionArea component={Link} to={item.path}>
                <CardContent sx={{ textAlign: "center", py: 3 }}>
                  <Typography variant="h5" component="div" sx={{ fontWeight: "bold" }}>
                    {item.title}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
