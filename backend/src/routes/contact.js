const express = require("express");
const validator = require("validator");
const nodemailer = require("nodemailer");

const contactRouter = express.Router();

const hasSmtpConfig = () => {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
};

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_PORT) === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

contactRouter.get("/health/mail", async (req, res) => {
  try {
    if (process.env.NODE_ENV === "production") {
      return res.status(403).json({ error: "Mail health endpoint is disabled in production." });
    }

    if (!hasSmtpConfig()) {
      return res.status(500).json({
        ok: false,
        error: "SMTP config missing.",
        details: {
          hasHost: Boolean(process.env.SMTP_HOST),
          hasUser: Boolean(process.env.SMTP_USER),
          hasPass: Boolean(process.env.SMTP_PASS),
        },
      });
    }

    const transporter = createTransporter();
    await transporter.verify();

    return res.status(200).json({
      ok: true,
      message: "SMTP connection verified successfully.",
    });
  } catch (err) {
    console.error("Mail health check failed:", err);
    return res.status(500).json({
      ok: false,
      error: "SMTP verification failed.",
      details: err.message,
    });
  }
});

contactRouter.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required." });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Please provide a valid email address." });
    }

    if (!hasSmtpConfig()) {
      return res.status(500).json({ error: "Mail service is not configured on server." });
    }

    const transporter = createTransporter();
    const recipient = "22156@iiitu.ac.in";
    const subject = `FarmXpress Contact Form | ${name}`;
    const senderName = name.trim();
    const senderEmail = email.trim();

    await transporter.sendMail({
      from: `"FarmXpress Contact" <${process.env.SMTP_USER}>`,
      to: recipient,
      subject,
      replyTo: `"${senderName}" <${senderEmail}>`,
      text: `New contact form submission\n\nName: ${senderName}\nEmail: ${senderEmail}\n\nMessage:\n${message}`,
      html: `
        <h2>New FarmXpress Contact Submission</h2>
        <p><strong>Name:</strong> ${senderName}</p>
        <p><strong>Email:</strong> ${senderEmail}</p>
        <p><strong>Message:</strong></p>
        <p>${String(message).replace(/\n/g, "<br/>")}</p>
      `,
    });

    return res.status(200).json({ message: "Message sent successfully." });
  } catch (err) {
    console.error("Contact email error:", err);
    return res.status(500).json({ error: "Failed to send message. Please try again." });
  }
});

module.exports = contactRouter;
