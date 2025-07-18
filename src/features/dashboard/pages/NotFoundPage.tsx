import { Box, Heading, Text } from '@radix-ui/themes';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <Box style={{ textAlign: 'center', marginTop: '50px' }}>
    <Heading size="9">404</Heading>
    <Text size="5" as="p">Oops! The page you're looking for doesn't exist.</Text>
    <Text as="p">
      <Link to="/dashboard">Go back to Dashboard</Link>
    </Text>
  </Box>
);

export default NotFoundPage;
