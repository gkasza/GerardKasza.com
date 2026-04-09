import { Navigation } from "@/components/portfolio/Navigation";
import { Hero } from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { Timeline } from "@/components/portfolio/Timeline";
import { Projects } from "@/components/portfolio/Projects";
import { Ideas } from "@/components/portfolio/Ideas";
import { Contact } from "@/components/portfolio/Contact";
import { Footer } from "@/components/portfolio/Footer";
import { Recognition } from "@/components/portfolio/Recognition";
import { Philosophy } from "@/components/portfolio/Philosophy";
import { CircuitBackground } from "@/components/CircuitBackground";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <CircuitBackground />
      <div className="relative z-10">
        <Navigation />
        <main>
          <Hero />
          <Recognition />
          <Philosophy />
          <About />
          <Timeline />
          <Projects />
          <Ideas />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}
