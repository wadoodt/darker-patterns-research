import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  return (
    <div className="from-background flex min-h-screen flex-col items-center justify-center bg-gradient-to-br to-slate-900 p-8 text-center">
      <h1 className="font-headline text-primary mb-6 text-5xl font-bold">About Us</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl text-lg">
        The Dark Pattern Validator project is dedicated to identifying, cataloging, and raising awareness about
        deceptive user interface designs, commonly known as dark patterns. Our goal is to foster a more transparent and
        ethical digital environment for everyone.
      </p>
      <Image
        src="https://placehold.co/600x400.png"
        alt="Team working on computers"
        width={600}
        height={400}
        className="mb-8 rounded-lg shadow-xl"
        data-ai-hint="team collaboration"
      />
      <p className="text-muted-foreground mb-8 max-w-2xl text-lg">
        We provide tools for users to submit potential dark patterns and a platform for researchers to analyze and
        document these findings. By working together, we can push for better design standards and protect users from
        manipulative practices.
      </p>
      <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
}
