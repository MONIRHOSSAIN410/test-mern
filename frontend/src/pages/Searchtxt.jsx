import React, { useEffect, useMemo, useState } from "react";
// BUG FIX: `motion` was used throughout this file but never imported.
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import apiClient from "../api/client.js";

// Used only if the backend request fails, so the page still works standalone.
const FALLBACK_PARAGRAPH =
  "In the quiet hours of dawn, a small fishing village along the coast begins to stir. Fishermen prepare their nets while the gentle aroma of freshly brewed tea fills the air. Children run along the sandy shore, laughing as the waves gently kiss their feet. The old lighthouse standing tall at the edge of the village has guided sailors safely home for over a century. Every evening, the sky turns brilliant shades of orange and purple, painting a breathtaking backdrop over the calm sea.";

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Splits `text` into React nodes, wrapping every case-insensitive
 * occurrence of `query` in a <mark> tag so it renders with a yellow
 * background.
 */
function renderHighlightedParagraph(text, query) {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return text;

  const pattern = new RegExp(`(${escapeRegExp(trimmedQuery)})`, "gi");
  const parts = text.split(pattern);

  return parts.map((part, index) =>
    part.toLowerCase() === trimmedQuery.toLowerCase() ? (
      <mark key={index} className="search-highlight">
        {part}
      </mark>
    ) : (
      <React.Fragment key={index}>{part}</React.Fragment>
    )
  );
}

export default function Searchtxt() {
  const [paragraph, setParagraph] = useState(FALLBACK_PARAGRAPH);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadParagraph() {
      try {
        const { data } = await apiClient.get("/api/paragraph");
        if (isMounted && data?.text) {
          setParagraph(data.text);
          setFetchError(false);
        }
      } catch (err) {
        if (isMounted) setFetchError(true);
        console.error("Failed to load paragraph:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadParagraph();
    return () => {
      isMounted = false;
    };
  }, []);

  const trimmedQuery = query.trim();

  const noMatchFound = useMemo(() => {
    if (!trimmedQuery) return false;
    return !paragraph.toLowerCase().includes(trimmedQuery.toLowerCase());
  }, [paragraph, trimmedQuery]);

  const highlightedContent = useMemo(
    () => renderHighlightedParagraph(paragraph, query),
    [paragraph, query]
  );

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:py-14">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto"
      >
        <Link
          to="/"
          className="inline-block text-sm text-brand-600 hover:text-brand-700 mb-4"
        >
          &larr; Back to home
        </Link>

        <h1 className="text-2xl sm:text-3xl font-bold text-brand-800 mb-2">
          Search the Paragraph
        </h1>
        <p className="text-slate-500 mb-6">
          Type a word or phrase below — every match inside the paragraph gets a
          yellow highlight instantly.
        </p>

        <div className="relative mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search inside the paragraph..."
            aria-label="Search text"
            className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3 text-base shadow-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          />
        </div>

        <AnimatePresence>
          {noMatchFound && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm font-medium overflow-hidden"
              role="status"
            >
              no text found
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          layout
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md"
        >
          {loading ? (
            <p className="text-slate-400 animate-pulse">Loading paragraph...</p>
          ) : (
            <p className="text-slate-700 leading-relaxed text-[1.05rem]">
              {highlightedContent}
            </p>
          )}

          {fetchError && !loading && (
            <p className="mt-4 text-xs text-amber-600">
              Couldn&apos;t reach the backend (/api/paragraph), showing a local
              fallback paragraph instead.
            </p>
          )}
        </motion.div>
      </motion.section>
    </div>
  );
}
