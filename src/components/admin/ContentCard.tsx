import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ContentCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
  id?: string;
}

export function ContentCard({ title, description, children, className, colSpan = 1, id }: ContentCardProps) {
  return (
    <Card id={id} className={cn('shadow-lg', className, colSpan && colSpan > 1 ? `lg:col-span-${colSpan}` : '')}>
      <CardHeader>
        <CardTitle className="font-headline">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
