import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import fetch from "node-fetch";

import xss from "xss";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 🔐 Middleware
const allowedOrigins = (process.env.FRONTEND_ORIGINS || "https://shahidportfolio.mshahid3845.workers.dev,http://localhost:5500,http://localhost:3000")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

app.use(cors({
    origin(origin, cb) {
        // allow server-to-server or curl requests without Origin header
        if (!origin) return cb(null, true);
        if (allowedOrigins.includes(origin)) return cb(null, true);
        return cb(new Error("CORS blocked"), false);
    }
}));
app.use(express.json({ limit: "32kb" }));

// 🛡️ Security headers
app.use(helmet());

// 🐢 Rate limiting (50 requests per 15 minutes)
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50
}));

app.get("/api/health", (_req, res) => res.json({ ok: true }));



// 📧 Mailing Route
app.post("/api/contact", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body ?? {};

        if (!name || !email || !message) {
            return res.status(400).json({ error: "Name, email, and message are required" });
        }

        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            return res.status(500).json({ error: "Server misconfigured: missing EMAIL_USER/EMAIL_PASS" });
        }

        const cleanName = xss(name);
        const cleanEmail = xss(email);
        const cleanSubject = xss(subject || "No Subject");
        const cleanMessage = xss(message);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            replyTo: cleanEmail,
            subject: `Portfolio Contact: ${cleanSubject}`,
            text: `Name: ${cleanName}\nEmail: ${cleanEmail}\n\nMessage:\n${cleanMessage}`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: "Message sent successfully!" });

    } catch (err) {
        console.error("Mailing Error:", err);
        res.status(500).json({ error: "Failed to send message" });
    }
});

// 📁 Serve frontend static files
app.use(express.static(path.join(__dirname, "../frontend")));

// 🔀 Catch-all route to serve index.html for client-side routing
app.get("*", (_req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// 🚀 Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
