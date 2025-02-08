import { Card, CardContent, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function TypesofAlgorithms() {
  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item>
        <Link to="/searchingList" style={{ textDecoration: "none" }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Searching Algorithms</Typography>
            </CardContent>
          </Card>
        </Link>
      </Grid>
      <Grid item>
        <Link to="/sortingList" style={{ textDecoration: "none" }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Sorting Algorithms</Typography>
            </CardContent>
          </Card>
        </Link>
      </Grid>
      <Grid item>
        <Link to="/graphsList" style={{ textDecoration: "none" }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Graph Algorithms</Typography>
            </CardContent>
          </Card>
        </Link>
      </Grid>
    </Grid>
  );
}
