import { Menu } from 'lucide-react';

interface MobileMenuButtonProps {
  onMobileMenuToggle: () => void;
}

const MobileMenuButton = ({ onMobileMenuToggle }: MobileMenuButtonProps) => {
  return (
    <div className="ml-3 flex items-center justify-center lg:hidden">
      <button
        type="button"
        className="text-dark-text-secondary hover:text-dark-text-primary -m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
        onClick={onMobileMenuToggle}
        aria-label="Open main menu"
      >
        <Menu className="h-6 w-6" />
      </button>
    </div>
  );
};

export default MobileMenuButton;
