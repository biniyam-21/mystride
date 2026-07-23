import { findResponse } from "../data/ragMock";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api/v1";

export async function fetchRAGResponse(question) {
  const query = question.trim();
  if (!query) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question: query }),
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    if (data.success && data.data?.answer) {
      return {
        answer: data.data.answer,
        sources: data.data.sources || [],
        meta: data.data.meta || { provider: "openrouter" },
        isLive: true,
      };
    }

    throw new Error("Invalid API response format");
  } catch (error) {
    console.warn("RAG backend unreachable or returned error, using local fallback:", error);
    const mockAnswer = findResponse(query);
    return {
      answer: mockAnswer,
      sources: [],
      meta: { provider: "fallback" },
      isLive: false,
    };
  }
}
