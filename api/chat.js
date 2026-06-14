// Vercel Serverless Function — POST /api/chat
//
// The OpenAI key lives ONLY here, server-side, read from the
// OPENAI_API_KEY environment variable (set it in the Vercel dashboard,
// Project → Settings → Environment Variables). It is never sent to the
// browser. The frontend posts { messages: [{role, content}, ...] } and
// gets back { reply }.
import { buildPortfolioContext } from "../src/lib/portfolioContext.js";

const MODEL = "gpt-4o-mini"; // cheap + fast; plenty for a portfolio Q&A
const MAX_MESSAGES = 12; // keep recent turns only (cost + abuse guard)
const MAX_CHARS = 1500; // per-message cap

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res
      .status(500)
      .json({ error: "Server is missing OPENAI_API_KEY." });
  }

  try {
    const body =
      typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const incoming = Array.isArray(body.messages) ? body.messages : [];

    // Sanitize: only user/assistant roles, trimmed + capped, last N turns.
    const history = incoming
      .filter(
        (m) =>
          m &&
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string"
      )
      .slice(-MAX_MESSAGES)
      .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));

    if (history.length === 0) {
      return res.status(400).json({ error: "No message provided." });
    }

    const messages = [
      { role: "system", content: buildPortfolioContext() },
      ...history,
    ];

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.5,
        max_tokens: 350,
      }),
    });

    if (!openaiRes.ok) {
      const detail = await openaiRes.text();
      console.error("OpenAI error:", openaiRes.status, detail);
      return res
        .status(502)
        .json({ error: "Upstream model error. Please try again." });
    }

    const data = await openaiRes.json();
    const reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      "Sorry, I couldn't come up with a response.";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("chat handler error:", err);
    return res.status(500).json({ error: "Something went wrong." });
  }
}
