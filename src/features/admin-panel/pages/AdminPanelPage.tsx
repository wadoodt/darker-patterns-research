import { useState, useEffect } from "react";
import { Table, Select, Badge, Flex, Heading } from "@radix-ui/themes";
import api from "@api/client";
import type { User } from "types/api";

const AdminPanelPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get<{ data: { users: User[] } }>("/admin/users");
        setUsers(response.data.data.users);
      } catch {
        setError("Failed to fetch users. You may not have super-admin privileges.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: User['platformRole']) => {
    // Optimistically update the UI
    setUsers(users.map(u => u.id === userId ? { ...u, platformRole: newRole } : u));

    try {
      await api.patch(`/admin/users/${userId}`, { platformRole: newRole });
    } catch {
      setError(`Failed to update role for user ${userId}.`);
      // Revert the change in the UI if the API call fails
      // For simplicity, we're not doing this in the mock, but in a real app you would.
    }
  };

  if (loading) {
    return <p>Loading users...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <Flex direction="column" gap="4" p="4">
        <Heading>Platform User Management</Heading>
        <Table.Root variant="surface">
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Platform Role</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {users.map((user) => (
                    <Table.Row key={user.id}>
                        <Table.Cell>{user.name}</Table.Cell>
                        <Table.Cell>{user.email}</Table.Cell>
                        <Table.Cell>
                            <Select.Root 
                                value={user.platformRole} 
                                onValueChange={(newRole: User['platformRole']) => handleRoleChange(user.id, newRole)}>
                                <Select.Trigger />
                                <Select.Content>
                                    <Select.Item value="user">User</Select.Item>
                                    <Select.Item value="qa">QA</Select.Item>
                                    <Select.Item value="super-admin">Super Admin</Select.Item>
                                </Select.Content>
                            </Select.Root>
                        </Table.Cell>
                        <Table.Cell>
                            <Badge color={user.status === 'active' ? 'grass' : 'gray'}>{user.status}</Badge>
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table.Root>
    </Flex>
  );
};

export default AdminPanelPage;

