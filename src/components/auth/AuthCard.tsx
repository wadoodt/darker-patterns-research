import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { AuthCardProps } from './AuthCard.types';

export function AuthCard({ title, description, children, footer, className }: AuthCardProps) {
  return (
    <div className="from-background flex min-h-screen items-center justify-center bg-gradient-to-br to-slate-900 p-4">
      <Card className={cn('bg-card/80 border-border/50 w-full max-w-md shadow-2xl backdrop-blur-sm', className)}>
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-primary text-3xl">{title}</CardTitle>
          <CardDescription className="text-muted-foreground">{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
        <CardFooter className="text-muted-foreground flex flex-col space-y-2 text-center text-sm">{footer}</CardFooter>
      </Card>
    </div>
  );
}
