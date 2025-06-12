import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
}

export function ChartCard({ title, description, children, className, colSpan = 1 }: ChartCardProps) {
  return (
    <Card className={cn('shadow-lg', className, colSpan > 1 && `lg:col-span-${colSpan}`)}>
      <CardHeader>
        <CardTitle className="font-headline">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
