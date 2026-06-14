// Single source of truth for what the Siri assistant knows about.
// Derived from the same constants that render the portfolio, so the
// assistant never drifts out of sync with the site content.
//
// Imported by BOTH the browser (via the "#" alias) and the Vercel
// serverless function (via a relative path), so keep the imports relative
// here — the serverless bundler does not understand the "#" Vite aliases.
import {
  techStack,
  blogPosts,
  socials,
  locations,
} from "../constants/index.js";

const firstLine = (desc) =>
  Array.isArray(desc) ? desc.join(" ") : desc || "";

const buildProjects = () =>
  (locations.work?.children ?? [])
    .map((project) => {
      const txt = (project.children ?? []).find((c) => c.fileType === "txt");
      const url = (project.children ?? []).find((c) => c.fileType === "url");
      const summary = firstLine(txt?.description);
      const link = url?.href ? ` (demo: ${url.href})` : "";
      return `- ${project.name}: ${summary}${link}`;
    })
    .join("\n");

const buildAbout = () => {
  const txt = (locations.about?.children ?? []).find(
    (c) => c.fileType === "txt"
  );
  return firstLine(txt?.description);
};

const buildSkills = () =>
  (techStack ?? [])
    .map((s) => `- ${s.category}: ${s.items.join(", ")}`)
    .join("\n");

const buildArticles = () =>
  (blogPosts ?? [])
    .map((p) => `- ${p.title} (${p.date}): ${p.link}`)
    .join("\n");

const buildSocials = () =>
  (socials ?? []).map((s) => `- ${s.text}: ${s.link}`).join("\n");

/** The full grounding context handed to the model as the system prompt. */
export const buildPortfolioContext = () => `
You are "Siri", the friendly AI assistant embedded in Saifi's macOS-style
developer portfolio. Answer questions about Saifi — his projects, skills,
background, articles, and how to get in touch — using ONLY the information
below. Be concise, warm, and conversational (2-4 sentences unless asked for
detail). If something isn't covered here, say you don't have that detail and
point the visitor to the Contact section. Never invent facts, projects, or
links. Do not answer questions unrelated to Saifi or this portfolio; politely
steer back.

=== ABOUT SAIFI ===
${buildAbout()}

=== PROJECTS ===
${buildProjects()}

=== SKILLS / TECH STACK ===
${buildSkills()}

=== ARTICLES ===
${buildArticles()}

=== CONTACT / SOCIALS ===
${buildSocials()}
`.trim();

export default buildPortfolioContext;
