import { lazy, Suspense } from "react";
import { Navigation } from "@/components/portfolio/Navigation";
import { Hero } from "@/components/portfolio/Hero";
import { CircuitBackground } from "@/components/CircuitBackground";

// Lazy load below-fold sections to reduce initial bundle
const Recognition = lazy(() => import("@/components/portfolio/Recognition").then(m => ({ default: m.Recognition })));
const Philosophy = lazy(() => import("@/components/portfolio/Philosophy").then(m => ({ default: m.Philosophy })));
const About = lazy(() => import("@/components/portfolio/About").then(m => ({ default: m.About })));
const Timeline = lazy(() => import("@/components/portfolio/Timeline").then(m => ({ default: m.Timeline })));
const Projects = lazy(() => import("@/components/portfolio/Projects").then(m => ({ default: m.Projects })));
const Ideas = lazy(() => import("@/components/portfolio/Ideas").then(m => ({ default: m.Ideas })));
const Contact = lazy(() => import("@/components/portfolio/Contact").then(m => ({ default: m.Contact })));
const Footer = lazy(() => import("@/components/portfolio/Footer").then(m => ({ default: m.Footer })));

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <CircuitBackground />
      <div className="relative z-10">
        <Navigation />
        <main>
          <Hero />
          <Suspense fallback={null}>
            <Recognition />
            <Philosophy />
            <About />
            <Timeline />
            <Projects />
            <Ideas />
            <Contact />
          </Suspense>
        </main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>
    </div>
  );
}
