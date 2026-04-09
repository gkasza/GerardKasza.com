import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Briefcase, Building, TrendingUp, Award } from "lucide-react";

const experiences = [
  {
    id: 1,
    title: "Strategic Account Executive",
    company: "Envestnet Yodlee",
    companyUrl: "https://www.linkedin.com/company/yodlee",
    location: "Raleigh, NC",
    period: "2021 - Present",
    achievements: [
      "Secured top-10 and top-20 US broker-dealer clients (by AUM; second-largest wealth deal in company history), projected to generate $25M+ over 5 years combined, with strong upsell potential across bank, credit, and insurance relationships.",
      "Grew revenue from $7.6M to $9.2M (124% of target), with 42% and 57% YoY growth at two top-15 US wealth firms.",
      "Earned 2023 Wealth Sales Leader of the Year and 2024 Yodlee Sales Leader of the Year awards for consistent top performance.",
      "Promoted to Director overseeing largest Wealth Management and Bank logos; authored/secured funding for Advisor Acceleration Program (GTM to double wealth usage, launch Q1 2025).",
      "Created Advisor Insights initiative: hyper-personalized, anticipatory advice engine for AUM growth/retention and engagement (v0 prototype: held-away.com, April 2025).",
      "Led GTM for Crypto & Blockchain Strategies; co-authored Yodlee Onchain in 2022 (onchain transaction/holdings indexing) and Crypto Digital Wallet prototype."
    ],
    icon: TrendingUp,
  },
  {
    id: 2,
    title: "Technical Product Consultant",
    company: "Envestnet Tamarac",
    companyUrl: "https://www.linkedin.com/company/envestnet-tamarac-inc",
    location: "Raleigh, NC",
    period: "2016 - 2021",
    achievements: [
      "Served as technical relationship manager for the industry's largest RIAs and institutional wealth firms, bridging product engineering, sales, and clients on complex platform implementations.",
      "Led 50+ enterprise onboarding projects and transformations, overseeing migrations of billions in AUM with seamless execution and high adoption.",
      "Delivered executive solution presentations, proof-of-concepts, and technical consultations to drive client value and expansion.",
      "Influenced strategic product roadmap by advocating aggregated customer feedback to engineering and product leaders.",
      "Earned 2018 Employee Achievement Award (peer-voted) for excellence in teamwork, innovation, and productivity."
    ],
    icon: Building,
  },
  {
    id: 3,
    title: "Sales Training & Recruiting Manager",
    company: "Mutual of Omaha",
    companyUrl: "https://www.linkedin.com/company/mutual-of-omaha/",
    location: "Omaha, Nebraska",
    period: "2014 - 2016",
    achievements: [
      "Managed recruiting efforts and goals for 10 offices across VA, MD, WV, KY, and OH, training and developing agents to become licensed Financial Advisors (including FINRA Series 6, 63, and securities licensing).",
      "Met annual recruiting goal in just 10 months, generating $478K in additional revenue through new advisor hires.",
      "Achieved 2014 Company Recruiting Record Year, onboarding 73 new advisors to the region.",
      "Trained Financial Advisors extensively in compliance, needs-based sales practices, marketing initiatives, consultative selling, prospecting, referral strategies, and product knowledge.",
      "Doubled candidate sourcing output by redesigning Boolean search strategies across multiple systems."
    ],
    icon: Briefcase,
  },
  {
    id: 4,
    title: "Small Business Banking Officer",
    company: "Truist",
    companyUrl: "https://www.linkedin.com/company/truistfinancialcorporation",
    location: "Charlotte, NC",
    period: "2010 - 2014",
    achievements: [
      "Promoted to Small Business Banking Officer based on performance in personal banking role.",
      "Managed small business client relationships and sold financial products including lending and deposits.",
      "Completed BB&T Leadership Development Program (2012) and enterprise sales training.",
      "Focused on consultative sales and relationship management to support client growth."
    ],
    icon: Award,
  },
];

function renderAchievement(text: string) {
  // Bold key metrics: $amounts, percentages, and counts with units (e.g. "73 new advisors", "50+ enterprise")
  const bolded = text.replace(
    /(\$[\d.]+[MBK]*\+?(?:\s*over\s*\d+\s*years)?|[\d,]+%(?:\s*of\s*target)?|\d+%?\s*and\s*\d+%?\s*YoY|[\d,]+\+\s*enterprise|\$[\d,]+K|\d+\s+new\s+advisors|\d+\s+months)/g,
    '**$1**'
  );

  // Split on **...** markers and bold/link segments
  const parts = bolded.split(/\*\*(.+?)\*\*/g);
  const elements = parts.map((part, i) => {
    if (i % 2 === 1) {
      return <strong key={i} className="text-foreground/90 font-semibold">{part}</strong>;
    }
    if (part.includes("held-away.com")) {
      const [before, after] = part.split("held-away.com");
      return (
        <span key={i}>
          {before}
          <a
            href="https://held-away.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-neon-green transition-colors underline underline-offset-2 inline"
          >
            held-away.com
          </a>
          {after}
        </span>
      );
    }
    return part;
  });

  return <span>{elements}</span>;
}

function TimelineItem({ experience, index }: { experience: typeof experiences[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const Icon = experience.icon;
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      className={`relative flex items-center gap-6 ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
      data-testid={`timeline-item-${experience.id}`}
    >
      <div className={`hidden lg:block w-1/2 ${isEven ? 'text-right pr-8' : 'text-left pl-8'}`}>
        <div className={`backdrop-blur-md bg-card/60 border border-border rounded-lg p-6 hover:border-primary/50 transition-colors duration-300 inline-block text-left ${isEven ? 'ml-auto' : 'mr-auto'}`}>
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span className="text-xs font-mono text-neon-green bg-neon-green/10 px-2 py-1 rounded">{experience.period}</span>
            <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">{experience.location}</span>
          </div>
          <h3 className="font-heading text-xl font-semibold text-foreground mb-1">{experience.title}</h3>
          <div className="text-primary font-medium mb-4 flex items-center gap-2">
            <Building className="w-4 h-4" />
            {experience.companyUrl ? (
              <a href={experience.companyUrl} target="_blank" rel="noopener noreferrer" className="hover:text-neon-green transition-colors underline underline-offset-2">
                {experience.company}
              </a>
            ) : (
              experience.company
            )}
          </div>
          <ul className="space-y-2">
            {experience.achievements.map((achievement, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4 text-neon-green flex-shrink-0 mt-0.5" />
                <span className="flex-1">{renderAchievement(achievement)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative z-10 flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-card border-2 border-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-primary/20 rounded-full blur-md -z-10 animate-pulse" />
      </div>

      <div className="lg:hidden flex-1">
        <div className="backdrop-blur-md bg-card/60 border border-border rounded-lg p-6 hover:border-primary/50 transition-colors duration-300">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span className="text-xs font-mono text-neon-green bg-neon-green/10 px-2 py-1 rounded">{experience.period}</span>
            <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">{experience.location}</span>
          </div>
          <h3 className="font-heading text-xl font-semibold text-foreground mb-1">{experience.title}</h3>
          <div className="text-primary font-medium mb-4 flex items-center gap-2">
            <Building className="w-4 h-4" />
            {experience.companyUrl ? (
              <a href={experience.companyUrl} target="_blank" rel="noopener noreferrer" className="hover:text-neon-green transition-colors underline underline-offset-2">
                {experience.company}
              </a>
            ) : (
              experience.company
            )}
          </div>
          <ul className="space-y-2">
            {experience.achievements.map((achievement, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4 text-neon-green flex-shrink-0 mt-0.5" />
                <span className="flex-1">{renderAchievement(achievement)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={`hidden lg:block w-1/2 ${isEven ? 'pl-8' : 'pr-8'}`} />
    </motion.div>
  );
}

export function Timeline() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="experience"
      className="py-20 md:py-32 relative"
      data-testid="section-experience"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Professional <span className="text-primary">Journey</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A decade of driving growth in fintech, banking, crypto, and wealth management
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          <div className="absolute left-6 lg:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-neon-green to-primary -translate-x-1/2" />
          
          <div className="space-y-12">
            {experiences.map((experience, index) => (
              <TimelineItem key={experience.id} experience={experience} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
