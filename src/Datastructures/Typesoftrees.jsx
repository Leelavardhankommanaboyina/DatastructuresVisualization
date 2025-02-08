import { Card, CardContent, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function TreeTypes() {
  return (
    <Grid container spacing={2} justifyContent="center">
      {/* Tree Traversal Card */}
      <Grid item>
        <Link to="/preorder" style={{ textDecoration: "none" }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Preorder Traversal</Typography>
            </CardContent>
          </Card>
        </Link>
      </Grid>
      <Grid item>
        <Link to="/inorder" style={{ textDecoration: "none" }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Inorder Traversal</Typography>
            </CardContent>
          </Card>
        </Link>
      </Grid>
      <Grid item>
        <Link to="/postorder" style={{ textDecoration: "none" }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Postorder Traversal</Typography>
            </CardContent>
          </Card>
        </Link>
      </Grid>
      {/* Binary Search Tree Card */}
      <Grid item>
        <Link to="/bst" style={{ textDecoration: "none" }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Binary Search Tree</Typography>
            </CardContent>
          </Card>
        </Link>
      </Grid>
      {/* AVL Tree Card */}
      <Grid item>
        <Link to="/avl" style={{ textDecoration: "none" }}>
          <Card>
            <CardContent>
              <Typography variant="h6">AVL Tree</Typography>
            </CardContent>
          </Card>
        </Link>
      </Grid>
    </Grid>
  );
}
