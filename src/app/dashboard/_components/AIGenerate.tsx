'use client'

import axios from "axios";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";

const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY; // Must be public for client-side

export interface BlogAIResponse {
  content: string;
}

const model = "deepseek/deepseek-chat-v3-0324";

async function generateBlogPost(systemPrompt: string, userPrompt: string): Promise<BlogAIResponse> {
  if (!OPENROUTER_API_KEY) {
    throw new Error("Missing OPENROUTER_API_KEY");
  }

  const res = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model,
      messages: [
        { role: "system", content: systemPrompt.trim() },
        { role: "user", content: userPrompt.trim() }
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: 120000,
    }
  );

  const raw = (res.data?.choices?.[0]?.message?.content ?? "").trim();
  return { content: raw };
}

export const prompts = {
  blog: `
You are an expert SEO blog writer. Return ONLY the complete blog article as VALID HTML (no JSON, no markdown, no extra commentary).
The article must meet these strict rules:

1. Length: 1000–1400 words (approx).  
2. Output must be HTML only. Do NOT include any text outside the HTML document fragment. Do NOT wrap in markdown or code fences.  
3. Use only semantic HTML tags: <article>, <h1>-<h6>, <p>, <ul>, <ol>, <li>, <table>, <thead>, <tbody>, <tr>, <th>, <td>, <blockquote>, <strong>, <em>, <figure>, <figcaption>, <code>, <pre>, <img>, <a>.  
4. Do NOT include any <script>, <style>, inline event handlers (e.g. onclick), or any JavaScript code. Do NOT include data-* attributes intended for JS.  
5. Keep markup clean and minimal — avoid editor-specific ids/classes. Do NOT add unique ids for headings.  
6. Headings should be well-structured (one <h1> for the title, then <h2>/<h3> as needed).  
7. All tags must be properly closed and nested (valid HTML fragment).  
8. Tone: friendly, helpful, conversational, with concrete examples and actionable tips. Avoid repetition and filler.  
9. If you include lists or tables, ensure they are relevant and readable.  
10. End naturally — do NOT add a separate call-to-action paragraph unless the user explicitly requested one.  
11. Do NOT include any tracking, analytics, or external script references.  
12. Keep links minimal and inline only when relevant; use absolute URLs if necessary.

If the user's title/topic is given, write the article focused on that title. If not, ask for a clear title (but in this system prompt you will generally receive a title in the user prompt).
`.trim(),

  product: `
You are a creative e-commerce copywriter.
Write persuasive, SEO-friendly product descriptions.
Return plain text only.
`.trim(),

  social: `
You are a witty social media manager.
Write catchy Instagram captions.
Return only captions, one per line.
`.trim()
};

interface AiGenerateProps {
    setEditorContent: (content: string) => void;
  }
  

export default function AiGenerate({ setEditorContent }: AiGenerateProps) {
  const [formData, setFormData] = useState({
    systemPrompt: prompts.blog,
    userPrompt: ""
  });

  const [showPopup, setShowPopup] = useState(false);
  const [aiResult, setAiResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const res = await generateBlogPost(formData.systemPrompt, formData.userPrompt);
      setAiResult(res.content);
    } catch (error) {
      console.error("AI generation error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
  {/* Main trigger button */}
  <button
    type="button"
    onClick={() => setShowPopup(true)}
    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium shadow-md hover:shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200"
  >
    🚀 Generate Using AI
  </button>

  {showPopup && (
    <div className="fixed inset-0 z-20  flex items-center justify-center bg-black bg-opacity-40">
      <div className="w-[800px]  p-6 border rounded-lg shadow-lg bg-white relative">
        
        {/* Close button */}
        <button
          type="button"
          onClick={() => setShowPopup(false)}
          className="absolute  top-3 right-3 text-gray-500 hover:text-gray-700 "
        >
          <FaTimes className="2xl" />
        </button>

        <h3 className="text-xl font-bold mb-4">Generate Using AI</h3>

        {/* Prompt type selector */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Prompt Type</label>
          <select
            value={formData.systemPrompt}
            onChange={(e) =>
              setFormData({ ...formData, systemPrompt: e.target.value })
            }
            className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(prompts).map(([key, value]) => (
              <option key={key} value={value}>
                {key}
              </option>
            ))}
          </select>
        </div>

        {/* User input */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Your Topic / Request</label>
          <input
            type="text"
            value={formData.userPrompt}
            onChange={(e) =>
              setFormData({ ...formData, userPrompt: e.target.value })
            }
            placeholder="e.g., Best Cashback Apps for 2025"
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          type="button"
          className="w-full bg-green-500 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:bg-green-600 transition-colors"
        >
          {loading ? "Generating..." : "Generate Content"}
        </button>

        {/* AI Result */}
        {aiResult && (
          <div className="mt-4 border max-h-[300px] border-gray-300 p-3 bg-gray-50  overflow-y-auto rounded-lg">
            <div dangerouslySetInnerHTML={{ __html: aiResult }} />

            <button
      type="button"
      onClick={() => {
        setEditorContent(aiResult); 
        setShowPopup(false); 
      }}
      className="mt-3 w-full bg-blue-500 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:bg-blue-600 transition-colors"
    >
      ✅ Accept Content
    </button>
          </div>
        )}
      </div>
    </div>
  )}
</div>

  );
}
