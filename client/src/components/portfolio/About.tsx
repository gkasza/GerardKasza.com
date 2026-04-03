import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { TrendingUp, Code, Users, Wallet, Sparkles, Lightbulb, Target, Layers, Compass } from "lucide-react";

const skills = [
  { name: "Financial Services Ecosystem Navigation", years: 17, icon: Compass },
  { name: "Strategic Account Expansion", years: 12, icon: Target },
  { name: "Partnership Strategy & Development", years: 10, icon: Users },
  { name: "Technical Advisory & Engineering", years: 10, icon: Code },
  { name: "Crypto/Blockchain Experience", years: 9, icon: Wallet },
  { name: "Cross-Functional Project Management", years: 9, icon: Layers },
  { name: "Innovation & Future-Casting", years: 8, icon: Lightbulb },
  { name: "Go-to-Market Leadership", years: 7, icon: TrendingUp },
];

const maxYears = Math.max(...skills.map(s => s.years));

function SkillBar({ skill, index }: { skill: typeof skills[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const Icon = skill.icon;
  const barWidth = (skill.years / maxYears) * 100;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="space-y-2"
      data-testid={`skill-bar-${index}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Icon className="w-4 h-4 text-primary flex-shrink-0" />
          <span className="text-sm font-medium text-foreground truncate">{skill.name}</span>
        </div>
        <span className="text-[10px] sm:text-xs text-primary font-semibold whitespace-nowrap flex-shrink-0">{skill.years}+ Years</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${barWidth}%` } : {}}
          transition={{ delay: index * 0.08 + 0.3, duration: 0.8, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-primary to-neon-green rounded-full relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        </motion.div>
      </div>
    </motion.div>
  );
}

function AboutCard({ 
  title, 
  children, 
  index 
}: { 
  title: string; 
  children: React.ReactNode; 
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="border-l-2 border-primary/30 bg-card/50 backdrop-blur-sm rounded-r-lg p-6"
      data-testid={`about-card-${index}`}
    >
      <h3 className="font-heading text-xl font-semibold mb-4 text-primary">
        {title}
      </h3>
      <div className="text-foreground/80 leading-relaxed">
        {children}
      </div>
    </motion.div>
  );
}

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="about"
      className="py-20 md:py-32 relative overflow-x-hidden"
      data-testid="section-about"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
      
      <div className="container mx-auto px-5 sm:px-6 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            About <span className="text-primary">Me</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Bridging the gap between cutting-edge technology and business success
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start overflow-hidden">
          <div className="space-y-6">
            <AboutCard title="Background" index={0}>
              <p>
                I'm an accomplished executive blending sales leadership with technical insight across wealth management, banking, crypto, and fintech. Through closing multimillion-dollar enterprise software deals with premier Fortune 500 enterprises and industry giants, negotiating complex contracts, providing consultative guidance on cutting-edge implementations, and leading cross-functional transformations, I've helped these organizations strengthen their digital capabilities and realize extraordinary, quantifiable growth.
              </p>
            </AboutCard>

            <AboutCard title="What I Do" index={1}>
              <p>
                I excel at identifying and capitalizing on opportunities where cutting-edge technology meets strategic business priorities. From designing and executing go-to-market frameworks for SaaS platforms, providing deep consultative guidance on product-market fit in wealth management, fintech, and crypto environments, to engineering AI-driven MVPs, I bring a rare fusion of technical insight, enterprise sales leadership, and innovative problem-solving to transform challenges into measurable growth.
              </p>
            </AboutCard>

            <AboutCard title="Passions" index={2}>
              <p>
                What keeps me energized beyond deals and growth is a deep fascination with tomorrow's technologies and the incentives shaping them. I was early into DeFi during 2020's summer surge and started leveraging AI by 2022, well ahead of the curve. I gravitate toward circles of bold thinkers, dreamers, and relentless builders, where ideas accelerate. I stay ahead by curating beta alerts, scouring breakthroughs, and hands-on testing across AI, crypto, finance systems, robotics, and behavioral economics. Few things excite me more than the belief that everyday people will soon have AI advisors capable of rivaling and elevating traditional financial guidance. As someone who vibes seamlessly with engineers and C-suite leaders alike, I see this blend as my edge: understanding products deeply enough to build, sell, and scale them in a fast-evolving world.
              </p>
            </AboutCard>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="border-l-2 border-primary/30 bg-card/50 backdrop-blur-sm rounded-r-lg p-3 sm:p-6 h-full">
              <h3 className="font-heading text-xl font-semibold mb-8 text-primary">
                Core Skills
              </h3>
              <div className="space-y-6">
                {skills.map((skill, index) => (
                  <SkillBar key={skill.name} skill={skill} index={index} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
