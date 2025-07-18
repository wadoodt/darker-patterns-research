// src/components/Header.tsx
import { Link } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";
import Button from "@components/Button";
import { PersonIcon } from "@radix-ui/react-icons";
import { Flex, Text, Inset } from "@radix-ui/themes";

export default function Header() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header>
      <Inset clip="padding-box" side="all" pb="current">
        <Flex
          justify="between"
          align="center"
          p="4"
          style={{ borderBottom: "1px solid var(--gray-a5)" }}
        >
          <Text size="5" weight="bold">
            Dashboard
          </Text>
          <Flex align="center" gap="4">
            <Link
              to="/dashboard/profile"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Flex align="center" gap="3">
                <PersonIcon width="24" height="24" />
                <div>
                  <Text as="div" size="2" weight="bold">
                    {user?.username || "User"}
                  </Text>
                  <Text as="div" size="1" color="gray">
                    {user?.role || "No role assigned"}
                  </Text>
                </div>
              </Flex>
            </Link>
            <Button
              variant="classic"
              color="gray"
              onClick={handleLogout}
              highContrast
            >
              Logout
            </Button>
          </Flex>
        </Flex>
      </Inset>
    </header>
  );
}
