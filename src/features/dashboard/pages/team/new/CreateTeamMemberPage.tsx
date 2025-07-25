import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTeamPage } from "../hooks/useTeamPage";
import type { NewTeamMember, CompanyRole } from "types/api/user";
import {
  Flex,
  Heading,
  Text,
  TextField,
  Select,
  Button,
} from "@radix-ui/themes";

const CreateTeamMemberPage = () => {
  const navigate = useNavigate();
  const { handleCreateMember } = useTeamPage();
  const [formData, setFormData] = useState<NewTeamMember>({
    name: "",
    email: "",
    companyRole: "employee",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: CompanyRole) => {
    setFormData((prev) => ({ ...prev, companyRole: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleCreateMember(formData);
    navigate("/dashboard/team?refresh=true");
  };

  return (
    <Flex direction="column" gap="4" p="4">
      <Heading>Create Team Member</Heading>
      <form onSubmit={handleSubmit}>
        <Flex direction="column" gap="4" style={{ maxWidth: 500 }}>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Name
            </Text>
            <TextField.Root
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Email
            </Text>
            <TextField.Root
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Role
            </Text>
            <Select.Root
              name="companyRole"
              required
              value={formData.companyRole}
              onValueChange={handleRoleChange}
            >
              <Select.Trigger />
              <Select.Content>
                <Select.Item value="admin">Admin</Select.Item>
                <Select.Item value="employee">Employee</Select.Item>
              </Select.Content>
            </Select.Root>
          </label>
          <Button type="submit" size="3" style={{ width: 'fit-content' }}>
            Create Member
          </Button>
        </Flex>
      </form>
    </Flex>
  );
};

export default CreateTeamMemberPage;
