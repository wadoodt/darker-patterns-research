import { useContext } from 'react';
import { AppContext } from '@contexts/AppContext/context';
import type { AppContextType } from '@contexts/AppContext/types';

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
