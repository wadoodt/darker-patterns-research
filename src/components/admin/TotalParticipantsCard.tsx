// src/components/admin/TotalParticipantsCard.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Timestamp } from 'firebase/firestore';

interface TotalParticipantsCardProps {
  total: number;
  lastUpdatedAt?: Timestamp | Date;
}

export function TotalParticipantsCard({ total, lastUpdatedAt }: TotalParticipantsCardProps) {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle className="text-dark-text-primary text-base font-medium">
          Total Participants with Demographics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-dark-text-primary text-3xl font-bold">{total?.toLocaleString() || 'N/A'}</p>
        {lastUpdatedAt && (
          <p className="text-dark-text-tertiary mt-1 text-xs">
            Last updated:{' '}
            {lastUpdatedAt instanceof Timestamp
              ? lastUpdatedAt.toDate().toLocaleDateString()
              : new Date(lastUpdatedAt).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
