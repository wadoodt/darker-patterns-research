import { Button } from '@/components/ui/button';
import { SubmitButtonProps } from './SubmitButton.types';

export default function SubmitButton({ text, onClick, disabled, isLoading, dataTour }: SubmitButtonProps) {
  return (
    <div className="mt-1 mb-5 text-center" data-tour={dataTour}>
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        className="btn-primary-light min-w-[220px] px-6 py-2.5 text-sm"
      >
        {text}
      </Button>
    </div>
  );
}
