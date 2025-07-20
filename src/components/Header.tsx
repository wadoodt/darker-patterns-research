import { Link } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import Button from '@components/Button';
import ThemeSwitcher from '@components/ThemeSwitcher';
import { PersonIcon, HamburgerMenuIcon } from '@radix-ui/react-icons';
import { Flex, Text, Inset, IconButton } from '@radix-ui/themes';
import styles from './Header.module.css';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header>
      <Inset clip="padding-box" side="all" pb="current">
        <Flex
          justify="between"
          align="center"
          p="4"
          style={{ borderBottom: '1px solid var(--gray-a5)' }}
        >
          <Flex align="center" gap="4">
          <div className={styles.logo}>
        <h2>PenguinMails</h2>
      </div>
            <IconButton onClick={onMenuClick} className={styles.menuButton}>
              <HamburgerMenuIcon width="24" height="24" />
            </IconButton>
            <Text size="5" weight="bold">
              Dashboard
            </Text>
          </Flex>
          <Flex align="center" gap="4">
            <ThemeSwitcher />
            <Link
              to="/dashboard/profile"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Flex align="center" gap="3">
                <PersonIcon width="24" height="24" />
                <div>
                  <Text as="div" size="2" weight="bold">
                    {user?.username || 'User'}
                  </Text>
                  <Text as="div" size="1" color="gray">
                    {user?.role || 'No role assigned'}
                  </Text>
                </div>
              </Flex>
            </Link>
            <Button variant="classic" color="gray" onClick={logout} highContrast>
              Logout
            </Button>
          </Flex>
        </Flex>
      </Inset>
    </header>
  );
}
