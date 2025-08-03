
import React from "react";
import {
  Table,
  Select,
  Flex,
  Text,
  Badge,
  Box,
  Card,
  Heading,
} from "@radix-ui/themes";
import type { User } from "@api/domains/users/types";
import { useAdminUsers, useUpdateAdminUser } from "@api/domains/admin/hooks";
import type { PlatformRole } from "@api/domains/users/types";

interface UserTableRowProps {
  user: User;
  onUpdate: (
    userId: string,
    updates: { platformRole: PlatformRole },
  ) => void;
}

const UserTableRow: React.FC<UserTableRowProps> = ({ user, onUpdate }) => (
  <Table.Row key={user.id}>
    <Table.RowHeaderCell>
      <Flex direction="column">
        <Text weight="bold">{user.name}</Text>
        <Text size="2" color="gray">
          {user.email}
        </Text>
      </Flex>
    </Table.RowHeaderCell>
    <Table.Cell>
      <Select.Root
        defaultValue={user.platformRole}
        onValueChange={(newRole) =>
          onUpdate(user.id, { platformRole: newRole as PlatformRole })
        }
      >
        <Select.Trigger />
        <Select.Content>
          <Select.Item value="admin">Admin</Select.Item>
          <Select.Item value="user">User</Select.Item>
        </Select.Content>
      </Select.Root>
    </Table.Cell>
    <Table.Cell>
      <Badge color={user.status === "active" ? "green" : "red"}>
        {user.status}
      </Badge>
    </Table.Cell>
  </Table.Row>
);

const UsersPage: React.FC = () => {
  const { data: usersData, loading: isLoading, error } = useAdminUsers({});
  const { mutate: updateUser } = useUpdateAdminUser();

  const handleUpdateUser = (
    userId: string,
    updates: { platformRole: PlatformRole },
  ) => {
    updateUser(userId, updates);
  };

  if (isLoading) return <Text>Loading users...</Text>;
  if (error) return <Text color="red">Error: {error.message}</Text>;

  return (
    <Card size="4">
      <Box mb="4">
        <Heading>User Management</Heading>
        <Text as="p" color="gray">
          View and manage all users in your company.
        </Text>
      </Box>
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>User</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {usersData?.users.map((user: User) => (
            <UserTableRow
              key={user.id}
              user={user}
              onUpdate={handleUpdateUser}
            />
          ))}
        </Table.Body>
      </Table.Root>
    </Card>
  );
};

export default UsersPage;
