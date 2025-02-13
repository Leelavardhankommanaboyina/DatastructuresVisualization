import { Card, CardActionArea, CardContent, Container, Grid, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SwapVertIcon from "@mui/icons-material/SwapVert";

export default function TreeTypes() {
  const cardData = [
    {
      title: "Tree Traversal Visualization",
      path: "/traversal",
      icon: (
        <AccountTreeIcon
          sx={{ fontSize: 120, color: "rgba(0, 0, 0, 0.1)" }}
        />
      ),
    },
    {
      title: "Binary Search Tree",
      path: "/bst",
      icon: (
        <TrendingUpIcon
          sx={{ fontSize: 120, color: "rgba(0, 0, 0, 0.1)" }}
        />
      ),
    },
    {
      title: "AVL Tree",
      path: "/avl",
      icon: (
        <SwapVertIcon
          sx={{ fontSize: 120, color: "rgba(0, 0, 0, 0.1)" }}
        />
      ),
    },
  ];

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Grid container spacing={3} justifyContent="center">
        {cardData.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: 3,
                transition: "transform 0.3s, box-shadow 0.3s",
                height: 200,
                overflow: "hidden",
                position: "relative",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: 6,
                },
              }}
            >
              <CardActionArea component={Link} to={item.path} sx={{ height: "100%" }}>
                <CardContent
                  sx={{
                    position: "relative",
                    height: "100%",
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end", // Positions text at the bottom
                    alignItems: "center",
                  }}
                >
                  {/* Background Icon */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      zIndex: 0,
                    }}
                  >
                    {item.icon}
                  </Box>
                  {/* Title Text at bottom */}
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      position: "relative",
                      zIndex: 1,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
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
