'use client';

import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import React, { useState } from 'react';
import UpdateItem from './UpdateItem';

// Assuming the same interfaces and iconMap from the parent
import type { Timestamp } from 'firebase/firestore';
import { BarChartBig, CalendarDays, Milestone, Newspaper, Users2 } from 'lucide-react';

interface LandingUpdate {
  id: string;
  title: string;
  date: Timestamp | { seconds: number; nanoseconds: number };
  description: string;
  iconName?: string;
}

const iconMap: { [key: string]: React.ElementType } = {
  BarChartBig: BarChartBig,
  Milestone: Milestone,
  Users2: Users2,
  Newspaper: Newspaper,
  default: CalendarDays,
};

const UPDATES_THRESHOLD = 5;

interface UpdateListProps {
  updates: LandingUpdate[];
}

const UpdateList: React.FC<UpdateListProps> = ({ updates }) => {
  const [showAll, setShowAll] = useState(false);

  const displayedUpdates = showAll ? updates : updates.slice(0, UPDATES_THRESHOLD);

  return (
    <div>
      <div className="space-y-8 sm:space-y-10">
        {displayedUpdates.map((update, index) => {
          const IconComponent = update.iconName ? iconMap[update.iconName] || iconMap['default'] : iconMap['default'];
          // Date formatting is now expected to be done before passing to this component
          // or we can do it here if we pass the raw date
          const dateObject = 'toDate' in update.date ? update.date.toDate() : new Date(update.date.seconds * 1000);
          const formattedDate = dateObject.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

          return (
            <UpdateItem
              key={update.id || update.title}
              title={update.title}
              date={formattedDate}
              description={update.description}
              icon={<IconComponent size={14} />}
              animationDelay={`${index * 100}ms`}
            />
          );
        })}
      </div>
      {updates.length > UPDATES_THRESHOLD && (
        <div className="mt-10 text-center">
          <Button variant="outline" onClick={() => setShowAll(!showAll)} className="btn-secondary-dark">
            {showAll ? 'Show Less' : 'Show All Updates'}
            {showAll ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      )}
    </div>
  );
};

export default UpdateList;
