import type { VercelRequest, VercelResponse } from "@vercel/node";
import { z } from "zod";
import { Resend } from "resend";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(200),
  subject: z.string().trim().max(200),
  message: z.string().trim().min(1).max(5000),
});

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const data = contactSchema.parse(req.body);

    if (!process.env.RESEND_API_KEY) {
      console.error("Contact form error: RESEND_API_KEY is not set");
      return res.status(500).json({ success: false, error: "Failed to send message" });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "gjkasza@gmail.com",
      replyTo: data.email,
      subject: `New Contact Form Message from ${data.name.replace(/[\r\n]+/g, " ")}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(data.subject || "No subject")}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(data.message).replace(/\n/g, "<br>")}</p>
      `,
    });

    if (error) {
      console.error("Contact form Resend error:", error);
      return res.status(500).json({ success: false, error: "Failed to send message" });
    }

    return res.status(201).json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: "Invalid form data", details: error.errors });
    }
    console.error("Contact form error:", error);
    return res.status(500).json({ success: false, error: "Failed to send message" });
  }
}
