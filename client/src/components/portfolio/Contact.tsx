import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, Linkedin, Send, MapPin, MessageSquare, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactMessageSchema, type InsertContactMessage } from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const quickTopics = [
  "Enterprise Partnerships",
  "Executive Role / Advisory",
  "Private Project Demo",
  "General Inquiry",
] as const;

export function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { toast } = useToast();
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard?.writeText("gjkasza@gmail.com").catch(() => {});
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 1800);
  };

  const form = useForm<InsertContactMessage>({
    resolver: zodResolver(insertContactMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContactMessage) => {
      return apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. I'll get back to you soon.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertContactMessage) => {
    contactMutation.mutate(data);
  };

  return (
    <section
      id="contact"
      className="py-20 md:py-32 relative"
      data-testid="section-contact"
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
            Get in <span className="text-primary">Touch</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-neon-green mx-auto rounded-full mb-4" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Partnerships, product ideas, or a conversation worth having. Let's connect.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="backdrop-blur-md bg-card/50 border border-border rounded-lg p-6 space-y-6"
                aria-busy={contactMutation.isPending}
                data-status={contactMutation.status}
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your name"
                            className="bg-background/50 border-border"
                            data-testid="input-name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your@email.com"
                            className="bg-background/50 border-border"
                            data-testid="input-email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Quick Topic
                  </span>
                  <div className="flex flex-wrap gap-2" role="group" aria-label="Quick contact topic">
                    {quickTopics.map((topic) => {
                      const active = selectedTopic === topic;
                      return (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => {
                            setSelectedTopic(topic);
                            form.setValue("subject", topic, { shouldDirty: true });
                          }}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                            active
                              ? "border-primary bg-primary/15 text-primary font-medium"
                              : "border-border bg-background/40 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                          }`}
                        >
                          {topic}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="How can I help?"
                          className="bg-background/50 border-border"
                          data-testid="input-subject"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell me about your project or opportunity..."
                          rows={5}
                          className="bg-background/50 border-border resize-none"
                          data-testid="input-message"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button
                  type="submit"
                  className="w-full font-heading"
                  disabled={contactMutation.isPending}
                  data-testid="button-submit-contact"
                >
                  {contactMutation.isPending ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-6"
          >
            <div className="backdrop-blur-md bg-card/50 border border-border rounded-lg p-6 space-y-6">
              <h3 className="font-heading text-xl font-semibold text-primary">Connect With Me</h3>
              
              <div className="space-y-4">
                <a
                  href="https://www.linkedin.com/in/gerard-kasza-0x0/"
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-lg bg-background/30 border border-border hover-elevate transition-colors"
                  data-testid="link-linkedin-contact"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Linkedin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">LinkedIn</p>
                    <p className="text-sm text-muted-foreground">linkedin.com/in/gerard-kasza-0x0</p>
                  </div>
                </a>
                
                <div className="flex items-center justify-between gap-3 p-4 rounded-lg bg-background/30 border border-border">
                  <a
                    href="mailto:gjkasza@gmail.com"
                    className="flex items-center gap-4 min-w-0 flex-1 group"
                    data-testid="link-email-contact"
                  >
                    <div className="w-12 h-12 rounded-full bg-neon-green/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-neon-green" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground group-hover:text-primary transition-colors">Email</p>
                      <p className="text-sm text-muted-foreground truncate">gjkasza@gmail.com</p>
                    </div>
                  </a>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopyEmail}
                    className="border-primary/30 hover:border-primary/60 text-xs flex-shrink-0"
                    aria-label="Copy email address"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1.5 text-neon-green" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 mr-1.5 text-primary" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="flex items-center gap-4 p-4 rounded-lg bg-background/30 border border-border">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Location</p>
                    <p className="text-sm text-muted-foreground">Raleigh-Durham, NC USA</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-md bg-card/50 border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="w-5 h-5 text-neon-green" />
                <h3 className="font-heading text-lg font-semibold text-foreground">Quick Response</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                I typically respond within 24-48 hours. For urgent matters, please connect with me directly on LinkedIn.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
