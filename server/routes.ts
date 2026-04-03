import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema } from "@shared/schema";
import { z } from "zod";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      
      // Send email notification if Resend is configured
      if (resend) {
        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: "gjkasza@gmail.com",
          subject: `New Contact Form Message from ${validatedData.name}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${validatedData.name}</p>
            <p><strong>Email:</strong> ${validatedData.email}</p>
            <p><strong>Subject:</strong> ${validatedData.subject || "No subject"}</p>
            <p><strong>Message:</strong></p>
            <p>${validatedData.message.replace(/\n/g, "<br>")}</p>
          `,
        });
      } else {
        console.log("Resend not configured - email notification skipped");
      }
      
      res.status(201).json({ success: true, message: "Message sent successfully", id: message.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, error: "Invalid form data", details: error.errors });
      } else {
        console.error("Contact form error:", error);
        res.status(500).json({ success: false, error: "Failed to send message" });
      }
    }
  });

  return httpServer;
}
