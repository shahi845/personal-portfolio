import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import xss from "xss";

dotenv.config();

const app = express();

// 🔐 Middleware
app.use(cors({
    origin: ["https://your-portfolio-domain.com", "http://localhost:3000"]
}));
app.use(express.json());

// 🛡️ Security headers
app.use(helmet());

// 🐢 Rate limiting (50 requests per 15 minutes)
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50
}));

// 🔒 AI Route
app.post("/api/chat", async (req, res) => {
    try {
        const { message, history = [] } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message required" });
        }

        if (message.length > 500) {
            return res.status(400).json({ error: "Message too long" });
        }

        const cleanMessage = xss(message);

        console.log("Receiving request for AI API...");

        const systemPrompt = {
            role: "system",
            content: `You are Muhammed Shahid's professional AI assistant. Only answer questions about his portfolio, skills, and projects. Reject unrelated queries.`
        };

        const apiMessages = [
            systemPrompt,
            ...history,
            { role: "user", content: cleanMessage }
        ];

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: apiMessages
            })
        });

        const data = await response.json();

        res.json({
            reply: data.choices?.[0]?.message?.content || "No response. Check API key."
        });

    } catch (err) {
        console.error("API Fetch Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// 🚀 Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
