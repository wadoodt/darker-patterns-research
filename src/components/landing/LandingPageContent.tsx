// src/components/landing/LandingPageContent.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
// import HeroSection from './HeroSection'; // If we decide to revert to modular sections later
// import StatsSection from './StatsSection';
// import ProgressSection from './ProgressSection';
// import UpdatesSection from './UpdatesSection';
// import BenefitsSection from './BenefitsSection';
// import ResearchersSection from './ResearchersSection';

const LandingPageContent = () => {
  return (
    // Content from the original src/app/page.tsx is now here
    // It will be wrapped by DarkNavbar and DarkFooter from src/app/(landing)/layout.tsx
    <main className="from-background flex min-h-[calc(100vh-var(--navbar-height,4rem)-var(--footer-height,4rem))] flex-col items-center justify-center bg-gradient-to-br to-slate-900 px-4 pt-16 pb-8 text-center sm:px-8">
      <div className="absolute inset-0 -z-10 overflow-hidden opacity-10">
        {/* Decorative background SVGs or images can go here */}
      </div>
      <div className="relative z-10 max-w-3xl">
        <ShieldCheck className="text-primary mx-auto mb-6 h-20 w-20 animate-pulse sm:mb-8 sm:h-24 sm:w-24" />

        <h1 className="font-headline from-primary via-accent mb-6 bg-gradient-to-r to-purple-400 bg-clip-text text-4xl font-extrabold text-transparent sm:text-5xl md:text-6xl">
          Dark Pattern Validator
        </h1>

        <p className="text-md text-muted-foreground mx-auto mb-8 max-w-xl sm:mb-10 sm:text-lg">
          Uncover and analyze deceptive user interface designs. Empowering researchers and consumers to build a more
          transparent web.
        </p>

        <div className="mb-10 flex flex-col items-center justify-center gap-4 sm:mb-12 sm:flex-row">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 text-base shadow-lg transition-transform hover:scale-105 sm:px-8 sm:py-6 sm:text-lg"
            asChild
          >
            <Link href="/survey/step-introduction">
              {' '}
              {/* Updated link to survey intro */}
              Start Validating <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-accent text-accent hover:bg-accent/10 hover:text-accent px-6 py-3 text-base shadow-lg transition-transform hover:scale-105 sm:px-8 sm:py-6 sm:text-lg"
            asChild
          >
            <Link href="/info/about-research">Learn More</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 text-left sm:gap-6 md:grid-cols-3">
          <div className="bg-card/50 border-border/30 rounded-lg border p-4 shadow-md backdrop-blur-sm sm:p-6">
            <h3 className="font-headline text-primary mb-2 text-lg font-semibold sm:text-xl">Identify Patterns</h3>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Utilize our tools to detect common dark patterns in websites and applications.
            </p>
          </div>
          <div className="bg-card/50 border-border/30 rounded-lg border p-4 shadow-md backdrop-blur-sm sm:p-6">
            <h3 className="font-headline text-primary mb-2 text-lg font-semibold sm:text-xl">Contribute Research</h3>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Researchers can submit findings and help expand our knowledge base.
            </p>
          </div>
          <div className="bg-card/50 border-border/30 rounded-lg border p-4 shadow-md backdrop-blur-sm sm:p-6">
            <h3 className="font-headline text-primary mb-2 text-lg font-semibold sm:text-xl">Promote Transparency</h3>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Join us in advocating for ethical design practices across the web.
            </p>
          </div>
        </div>
        <div className="mt-12 opacity-75 sm:mt-16">
          <Image
            src="https://placehold.co/800x200.png"
            alt="Abstract digital pattern"
            width={800}
            height={200}
            className="rounded-lg object-cover shadow-xl"
            data-ai-hint="abstract digital"
          />
        </div>
      </div>
      {/* Footer content is now handled by src/app/(landing)/layout.tsx */}
    </main>
  );
};
export default LandingPageContent;
