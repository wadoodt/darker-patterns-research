import React, { useState, useEffect } from "react";
import {
  Table,
  Select,
  Switch,
  Flex,
  Text,
  Badge,
  Box,
  Card,
  Heading,
} from "@radix-ui/themes";
import type { User } from "types";
import apiClient from "@api/client";

interface UserTableRowProps {
  user: User;
  onUpdate: (
    userId: string,
    updates: Partial<Pick<User, "role" | "status">>,
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
        defaultValue={user.role}
        onValueChange={(newRole) =>
          onUpdate(user.id, { role: newRole as "admin" | "user" })
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
    <Table.Cell>
      <Flex align="center" gap="2">
        <Switch
          checked={user.status === "active"}
          onCheckedChange={(checked) =>
            onUpdate(user.id, { status: checked ? "active" : "inactive" })
          }
        />
      </Flex>
    </Table.Cell>
  </Table.Row>
);

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: response, status } = await apiClient.get("/admin/users");
        if (status !== 200) {
          throw new Error(
            response.data.error?.detail || "Failed to fetch users",
          );
        }
        setUsers(response.data.users);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUpdateUser = async (
    userId: string,
    updates: Partial<Pick<User, "role" | "status">>,
  ) => {
    try {
      const response = await apiClient.patch(`/admin/users/${userId}`, updates);

      const data = response.data;
      if (data.code !== "OPERATION_SUCCESS") {
        throw new Error(data.error?.detail || "Failed to update user");
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, ...data.data } : user,
        ),
      );
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Failed to update user");
    }
  };

  if (loading) return <Text>Loading users...</Text>;
  if (error) return <Text color="red">Error: {error}</Text>;

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
            <Table.ColumnHeaderCell>Active/Inactive</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {users.map((user) => (
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
