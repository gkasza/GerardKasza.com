import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export function Philosophy() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="py-12 md:py-16 relative" data-testid="section-philosophy">
      <div className="container mx-auto px-6 relative z-10">
        <motion.blockquote
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <p className="font-heading text-lg md:text-xl lg:text-2xl font-medium text-foreground/80 leading-relaxed italic">
              "The best GTM leaders don't just sell technology — they understand it deeply enough to{" "}
              <span className="text-primary not-italic font-semibold">shape it</span>. That's why I build."
            </p>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          </div>
        </motion.blockquote>
      </div>
    </section>
  );
}
