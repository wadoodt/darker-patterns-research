import { FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import type { PasswordInputProps } from './PasswordInput.types';

export function PasswordInput({ field }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormControl>
      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter your password"
          value={field.value}
          onChange={field.onChange}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute top-1/2 right-3 -translate-y-1/2"
        >
          {showPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
        </button>
      </div>
    </FormControl>
  );
}
