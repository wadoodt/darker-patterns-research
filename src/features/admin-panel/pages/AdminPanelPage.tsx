
import { Table, Select, Badge, Flex, Heading } from "@radix-ui/themes";
import { useAdminUsers, useUpdateAdminUser } from "@api/domains/admin/hooks";
import type { User } from "@api/domains/users/types";
import type { PlatformRole } from "@api/domains/users/types";

const AdminPanelPage = () => {
  const { data: usersData, loading: isLoading, error } = useAdminUsers();
  const { mutate: updateUser } = useUpdateAdminUser();

  const handleRoleChange = async (userId: string, newRole: PlatformRole) => {
    updateUser(userId, { platformRole: newRole });
  };

  if (isLoading) {
    return <p>Loading users...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error.message}</p>;
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
                {usersData?.users.map((user: User) => (
                    <Table.Row key={user.id}>
                        <Table.Cell>{user.name}</Table.Cell>
                        <Table.Cell>{user.email}</Table.Cell>
                        <Table.Cell>
                            <Select.Root
                                value={user.platformRole}
                                onValueChange={(newRole: PlatformRole) => handleRoleChange(user.id, newRole)}>
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
