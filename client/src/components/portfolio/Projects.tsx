import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, forwardRef } from "react";
import { ExternalLink, Layers, LineChart, Lock, Mail, ShieldCheck, Sparkles, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TiltCard } from "./TiltCard";
import { profile, type Project } from "@shared/profile";
import advisorSignalsImg from "@assets/advisor-signals.webp";
import portfloImg from "@assets/portflo-screenshot.webp";
import jamesKaszaImg from "@assets/image_1772987645677.webp";
import armoredGarageImg from "@assets/armored-garage-door.webp";

const categories = ["All", "Wealth", "Crypto", "Sports", "Local"];

const visuals: Record<number, { icon: typeof LineChart; image: string }> = {
  1: { icon: LineChart, image: advisorSignalsImg },
  2: { icon: Layers, image: portfloImg },
  3: { icon: Target, image: jamesKaszaImg },
  4: { icon: ShieldCheck, image: armoredGarageImg },
};

const projects = (profile.projects as Project[]).map((p) => ({ ...p, ...(visuals[p.id] ?? { icon: Sparkles, image: "" }) }));

const PrivateProjectsCard = forwardRef<HTMLDivElement, { index: number; onRequestAccess: () => void }>(
  function PrivateProjectsCard({ index, onRequestAccess }, forwardedRef) {
    const inViewRef = useRef(null);
    const isInView = useInView(inViewRef, { once: true, margin: "-50px" });

    return (
      <motion.div
        ref={(node) => {
          (inViewRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof forwardedRef === 'function') forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        layout
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
        transition={{ delay: index * 0.1, duration: 0.4 }}
        className="group backdrop-blur-md bg-card/60 border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300 cursor-pointer"
        data-testid="project-card-private"
        onClick={onRequestAccess}
      >
        <div className="relative h-32 bg-gradient-to-br from-primary/10 via-card to-neon-green/5 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,217,255,0.1),transparent_70%)]" />
          <div className="relative flex items-center gap-3">
            <Lock className="w-8 h-8 text-primary/40 group-hover:text-primary/60 transition-all duration-300" />
            <Sparkles className="w-6 h-6 text-neon-green/40 group-hover:text-neon-green/60 transition-all duration-300 animate-pulse" />
          </div>
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 text-xs">
              30+ Private
            </Badge>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              More Projects [Request Access]
            </h3>
          </div>
          
          <p className="text-muted-foreground text-sm leading-relaxed">
            I've built 30+ projects and counting, aiming for one new build every two weeks. These span AI agents, DeFi tools, automation systems, fintech prototypes, education apps for my kids, and lifestyle apps. All are private, but I'm always happy to discuss ideas and demos in conversation.
          </p>
          
          <div className="flex flex-wrap gap-2">
            <span className="text-xs bg-primary/10 text-primary/80 px-2 py-1 rounded-md">AI Agents</span>
            <span className="text-xs bg-primary/10 text-primary/80 px-2 py-1 rounded-md">DeFi</span>
            <span className="text-xs bg-primary/10 text-primary/80 px-2 py-1 rounded-md">Education</span>
            <span className="text-xs bg-primary/10 text-primary/80 px-2 py-1 rounded-md">Lifestyle</span>
          </div>
        </div>
      </motion.div>
    );
  }
);

function RequestAccessModal({ show, onClose }: { show: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={onClose}
          data-testid="request-access-overlay"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-sm bg-card border border-border rounded-lg p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-primary" />
                </div>
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground">Request Access</h3>
              <p className="text-muted-foreground text-sm">
                These projects are private. Reach out and I'll be happy to walk you through demos and discuss ideas.
              </p>
            </div>

            <div className="space-y-3">
              <a
                href="mailto:gjkasza@gmail.com?subject=Private%20Projects%20Access%20Request"
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all"
                data-testid="button-email-access"
              >
                <Mail className="w-4 h-4" />
                gjkasza@gmail.com
              </a>
              <a
                href="https://www.linkedin.com/in/gerard-kasza-0x0/"
                target="_blank"
                rel="me noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-md border border-border text-muted-foreground text-sm hover:text-foreground hover:border-primary/50 transition-all"
                data-testid="button-linkedin-access"
              >
                Connect on LinkedIn
              </a>
              <button
                type="button"
                onClick={onClose}
                className="w-full px-4 py-2 text-muted-foreground/60 text-sm hover:text-muted-foreground transition-colors"
                data-testid="button-cancel-access"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const ProjectCard = forwardRef<HTMLDivElement, { project: typeof projects[0]; index: number }>(
  function ProjectCard({ project, index }, forwardedRef) {
    const inViewRef = useRef(null);
    const isInView = useInView(inViewRef, { once: true, margin: "-50px" });
    const Icon = project.icon;
    const hasLink = 'link' in project && project.link;
    const hasImage = 'image' in project && project.image;

    const handleCardClick = () => {
      if (hasLink) {
        window.open(project.link as string, '_blank', 'noopener,noreferrer');
      }
    };

    return (
      <TiltCard className="rounded-lg">
        <motion.div
          ref={(node) => {
            (inViewRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
            if (typeof forwardedRef === 'function') forwardedRef(node);
            else if (forwardedRef) forwardedRef.current = node;
          }}
          layout
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
          className={`group backdrop-blur-md bg-card/60 border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300 ${hasLink ? 'cursor-pointer' : ''}`}
          data-testid={`project-card-${project.id}`}
          onClick={handleCardClick}
          onKeyDown={hasLink ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCardClick(); } } : undefined}
          role={hasLink ? "link" : undefined}
          tabIndex={hasLink ? 0 : undefined}
        >
          <div className="relative h-32 bg-gradient-to-br from-primary/20 via-card to-neon-green/10 flex items-center justify-center overflow-hidden">
            {hasImage ? (
              <img
                src={project.image as string}
                alt={project.title}
                loading="lazy"
                width={600}
                height={128}
                className="w-full h-full object-cover object-center opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
              />
            ) : (
              <Icon className="w-12 h-12 text-primary/60 group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
            )}
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="bg-neon-green/20 text-neon-green border-neon-green/30 text-xs">
                {project.highlight}
              </Badge>
            </div>
            {hasLink && (
              <div className="absolute top-3 left-3">
                <ExternalLink className="w-4 h-4 text-primary" />
              </div>
            )}
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {project.title}
              </h3>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed">
              {project.description}
            </p>

            {'featuredLink' in project && project.featuredLink && (
              <p className="text-sm">
                <span className="text-muted-foreground">{(project as any).featuredText} </span>
                <a
                  href={(project as any).featuredLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-neon-green transition-colors underline underline-offset-2"
                  onClick={(e) => e.stopPropagation()}
                  data-testid="link-featured-wealthmanagement"
                >
                  {(project as any).featuredSite}
                </a>
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, i) => (
                <span key={i} className="text-xs bg-primary/10 text-primary/80 px-2 py-1 rounded-md">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </TiltCard>
    );
  }
);

export function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeCategory, setActiveCategory] = useState("All");
  const [showLogin, setShowLogin] = useState(false);

  const filteredProjects = activeCategory === "All" 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <section
      id="projects"
      className="py-20 md:py-32 relative"
      data-testid="section-projects"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Featured <span className="text-primary">Projects</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-neon-green mx-auto rounded-full mb-8" />
          
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className={activeCategory === category ? "" : "border-border text-muted-foreground hover:text-foreground hover:border-primary/50"}
                data-testid={`filter-${category.toLowerCase().replace(' ', '-')}`}
              >
                {category}
              </Button>
            ))}
          </div>
        </motion.div>

        <motion.div 
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
            {activeCategory === "All" && (
              <PrivateProjectsCard key="private-projects" index={filteredProjects.length} onRequestAccess={() => setShowLogin(true)} />
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <RequestAccessModal show={showLogin} onClose={() => setShowLogin(false)} />
    </section>
  );
}
