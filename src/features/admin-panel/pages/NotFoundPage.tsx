import { Box, Heading, Text } from "@radix-ui/themes";
import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <Box style={{ textAlign: "center", marginTop: "50px" }}>
    <Heading size="9">404 - Admin Panel</Heading>
    <Text size="5" as="p">
      This admin page could not be found.
    </Text>
    <Text as="p">
      <Link to="/admin-panel">Go back to Admin Panel</Link>
    </Text>
  </Box>
);

export default NotFoundPage;
