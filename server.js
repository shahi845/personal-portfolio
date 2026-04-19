import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

dotenv.config();

const app = express();

// 🔐 Middleware
app.use(cors());
app.use(express.json());

// 🛡️ Security headers
app.use(helmet());

// 🐢 Rate limiting (100 requests per 15 minutes)
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
}));

// 🔒 AI Route
app.post("/api/chat", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message required" });
        }

        console.log("Receiving request for AI API...");

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "You are Muhammed Shahid's AI assistant." },
                    { role: "user", content: message }
                ]
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
